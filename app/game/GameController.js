app.controller('GameController', function($scope, $routeParams, socket, $location) {

	const roomId = $routeParams.roomId;
	const user = JSON.parse(localStorage.getItem('user'));
	var gameStarted = false;
	if (!user) {
		$location.path('/');
	}

	$scope.roomId = roomId;
	$scope.user = user;
	$scope.players = [];

	socket.on('connect', () => {
		console.log('A player connected!');
		socket.emit('joinServer', user);
	});

	socket.emit('joinRoom', roomId, user);

	socket.on('currentPlayers', (players) => {
		console.log('Loading current players...');
		players.forEach(player => {
			if (!($scope.players.map(p => p.socketId).includes(player.socketId))) {
				$scope.players.push(player);
			}
		});
		toggleButton();
		$scope.$apply();
	});

	socket.on('newPlayer', (player) => {
		console.log('A new player joined: ' + player.socketId);
		if (!($scope.players.map(p => p.socketId).includes(player.socketId))) {
			$scope.players.push(player);
		}
		$scope.$apply();
	});

	socket.on('playerLeft', (socketId) => {
		console.log('A player just left: ' + socketId);
		$scope.players = $scope.players.filter(player => player.socketId != socketId);
		toggleButton();
		$scope.$apply();
	});

	socket.on('playSong', (song) => {
		console.log(`Currently playing ${song.name} by ${song.artists[0].name}`);
		var audio = new Audio(song.preview_url);
		audio.play();
	})

	socket.on('receiveQuestion', (question) => {
		console.log('Received question.');
		currentQuestion(question);
	})

	var toggleButton = function() {
		if ($scope.players[0].socketId == socket.id && !gameStarted) {
			$scope.showButton = true;
		} else {
			$scope.showButton = false;
		}
	}

	$scope.startGame = function() {
		console.log('Started a question.');
		socket.emit('sendQuestion', roomId, new identifyPlayerQuestion('recent'));
	}

	function currentQuestion(question) {
		console.log(question.song);
		console.log(question.choices);
		$scope.question = question.question;
		$scope.choices = question.choices;
		$scope.questionImage = getSongImage(question.song);
		$scope.$apply();
	}

	class identifyPlayerQuestion {
		constructor(option) {
			var songs = [];
			$scope.players.forEach(player => {
				songs.push(getRandomSong(player, option));
			})
			this.song = songs[Math.floor(Math.random() * songs.length)];
			this.question = `Whose favorite ${option} song is ${this.song.name} by ${this.song.artists[0].name}?`
			this.choices = $scope.players.map(player => player.playerData.name);
			this.answers = $scope.players.filter(player => playerLikesSong(player, this.song, option));
		}
	}

	function getRandomSong(player, option) {
		var n = Math.floor(Math.random() * 10);
		if (option == 'recent') {
			return player.playerData.recent_songs[n];
		} else if (option == 'alltime') {
			return player.playerData.alltime_songs[n]
		} else {
			console.err('Not possible option.');
		}
	}

	function playerLikesSong(player, song, option) {
		if (option == 'recent') {
			return player.playerData.recent_songs.includes(song);
		} else if (option == 'alltime') {
			return player.playerData.alltime_songs.includes(song);
		} else {
			console.err('Not possible option.');
		}
	}

	function getSongImage(song) {
		var images = song.album.images;
		return images[Math.floor(Math.random() * images.length)].url;
	}
});