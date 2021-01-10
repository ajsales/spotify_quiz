app.controller('GameController', function($scope, $routeParams, $location, $timeout, Player, spotify, $document) {

	var gameStarted;
	var socket;
	var myPlayer;
	var currentAudio;
	var timer;

	var init = function() {
		$scope.playerData = JSON.parse(localStorage.getItem('playerData'));

		if (!$scope.playerData) {
			$location.path('/');
		}

		$scope.roomId = $routeParams.roomId;
		$scope.players = [];
		gameStarted = false;

		socket = io('/game/' + $scope.roomId);
		socket.emit('joinRoom', $scope.playerData);
	}
	init();

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

	socket.on('currentPlayers', (playersObject) => {
		var players = playersObject.map(player => Player.getPlayer(player));
		players.forEach(player => {
			addPlayer(player);
		})
	});

	socket.on('newPlayer', (playerObject) => {
		var player = Player.getPlayer(playerObject);
		addPlayer(player);
	});

	socket.on('playerLeft', (socketId) => {
		removePlayer(socketId);
	});

	socket.on('playSong', (songObject) => {
		var song = new Song(song);
		playSong(song);
	});

	socket.on('sendQuestion', (questionObject) => {
		playQuestion(Question.getQuestion(questionObject));
	});

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

	function removePlayer(socketId) {
		$scope.players = $scope.players.filter(player => player.socketId != socketId);
		console.log('Player left: ' + socketId);
		$scope.$apply();
		toggleButton();
	}

	function toggleButton() {
		if ($scope.players[0].socketId == socket.id && !gameStarted) {
			$scope.showButton = true;
		} else {
			$scope.showButton = false;
		}
	}

	function playSong(song) {
		if (currentAudio) {
			currentAudio.pause();
		}
		console.log('Playing song: ' + song.toString());
		$scope.songImage = song.image;
		$scope.song = song.toString();
		if (song.previewUrl) {
			currentAudio = new Audio(song.previewUrl);
			currentAudio.play();
			return true;
		} else {
			currentAudio = null;
			return false;
		}
	}

	function playQuestion(question) {
		playSong(question.song);
		$scope.question = question.question;
		$scope.questionImage = question.image;
		$scope.answers = question.answers;
		$scope.choices = question.choices.concat(['Wrong answer!']);
		$scope.activeButtons = false;
		$scope.counter = 30;
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

	$scope.activateButtons = function() {
		$timeout.cancel(timer);
		$scope.activeButtons = true;
	}
});