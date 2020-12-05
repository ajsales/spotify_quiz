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
		console.log($scope.players);
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

	var toggleButton = function() {
		if ($scope.players[0].socketId == socket.id && !gameStarted) {
			$scope.showButton = true;
		} else {
			$scope.showButton = false;
		}
	}

	$scope.startGame = function() {
		let n = Math.floor(Math.random() * 10);
		let song = user.recent_songs[n];
		socket.emit('sendSong', roomId, song);
	}

});