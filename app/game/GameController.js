/**
 * Controller for main game page. This is where code for communicating
 * with the Socket server for playing the game resides.
 */

app.controller('GameController', function($scope, $routeParams, $location, $timeout, Player, Question, Song, spotify, $document) {

	var playerData;
	var gameStarted;
	var socket;
	var myPlayer;
	var currentAudio;
	var timer;

	var init = function() {
		playerData = JSON.parse(localStorage.getItem('playerData'));

		// Reroutes player to login page if they aren't logged in
		if (!playerData) {
			$location.path('/');
		}

		$scope.roomId = $routeParams.roomId;
		$scope.players = [];
		gameStarted = false;

		// Client asks to join room
		socket = io('/game/' + $scope.roomId);
		socket.emit('joinRoom', playerData);
	}
	init();

	// For copying room ID to clipboard
	$scope.copyToClipboard = function() {
		const el = document.createElement('textarea');
		el.value = $scope.roomId;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

	$scope.startGame = function() {
		socket.emit('startQuestion');
	}

	// Server message to load in current players of the game when joining
	socket.on('currentPlayers', (playersObject) => {
		var players = playersObject.map(player => Player.getPlayer(player));
		players.forEach(player => {
			addPlayer(player);
		})
	});

	// Server message to add in new player
	socket.on('newPlayer', (playerObject) => {
		var player = Player.getPlayer(playerObject);
		addPlayer(player);
	});

	// Server message that player left
	socket.on('playerLeft', (socketId) => {
		removePlayer(socketId);
	});

	// Server message to play song
	socket.on('playSong', (songObject) => {
		var song = new Song(song);
		playSong(song);
	});

	// Server message to start question
	socket.on('sendQuestion', (questionObject) => {
		playQuestion(Question.getQuestion(questionObject));
	});

	// Server message to add points to given player
	socket.on('addPoints', (socketId, seconds, choice) => {
		var playerIndex = $scope.players.map(player => player.socketId).indexOf(socketId);
		var score = $scope.players[playerIndex].addPoints(seconds, choice);
		console.log(socketId + ' got ' + score + ' points!');
		$scope.$apply();
	})

	// Adds player to page
	function addPlayer(player) {
		if (player.socketId == socket.id) {
			myPlayer = player;
		}
		if ($scope.players.includes(player)) {
			return;
		}
		$scope.players.push(player);
		console.log('New player added: ' + player.socketId);
		toggleButton();	
		$scope.$apply();
	}

	// Removes player from page
	function removePlayer(socketId) {
		$scope.players = $scope.players.filter(player => player.socketId != socketId);
		console.log('Player left: ' + socketId);
		$scope.$apply();
		toggleButton();
	}

	// Have start game button show only for the "host"
	function toggleButton() {
		if ($scope.players[0].socketId == socket.id && !gameStarted) {
			$scope.showButton = true;
		} else {
			$scope.showButton = false;
		}
	}

	// Plays given song (pauses previous song if needed)
	function playSong(song) {
		if (currentAudio) {
			currentAudio.pause();
		}
		console.log('Playing song: ' + song.toString());

		// In case the song is unable to be played (i.e. no preview URL)
		if (song.previewUrl) {
			currentAudio = new Audio(song.previewUrl);
			currentAudio.play();
			return true;
		} else {
			currentAudio = null;
			return false;
		}
	}

	// Starts question for player and sets up scope for it
	function playQuestion(question) {
		playSong(question.song);
		$scope.question = question.question;
		$scope.questionImage = question.image;
		$scope.answers = question.answers;
		$scope.choices = question.choices;
		$scope.activeButtons = false;
		$scope.counter = 30;

		// Starts timer
		$timeout.cancel(timer);
		$scope.onTimeout = function() {
			$scope.counter--;
			if ($scope.counter > 0) {
				timer = $timeout($scope.onTimeout, 1000);
			} else {
				$timeout.cancel(timer);
				$scope.activateButtons();
			}
		}
		timer = $timeout($scope.onTimeout, 1000);

		$scope.$apply();
		console.log('Starting question: ' + question.question);
	}

	// Helper method for when player answers
	$scope.activateButtons = function(choiceIndex) {
		if (!$scope.activeButtons) {
			$timeout.cancel(timer);
			$scope.activeButtons = true;
			var choice = $scope.choices[choiceIndex];

			// Plays audio for whether the answer is correct or not
			var audio;
			if ($scope.answers.includes(choice)) {
				audio = new Audio('/wav/mixkit-correct-positive-answer-949.wav');
				socket.emit('pointsRequest', $scope.counter, choice);
			} else {
				audio = new Audio('/wav/mixkit-wrong-answer-bass-buzzer-948.wav');
			}
			currentAudio.pause();
			audio.play();
		}
	}
});