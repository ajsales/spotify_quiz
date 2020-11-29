app.controller('GameController', function($scope, $routeParams, socket, $location) {

	const roomId = $routeParams.roomId;
	const user = JSON.parse(localStorage.getItem('user'));
	console.log(user);
	var gameStarted = false;
	if (!user) {
		$location.path('/');
	}

	$scope.roomId = roomId;
	$scope.user = user;
	$scope.players = [];

	socket.emit('joinRoom', roomId, user);

	socket.on('currentPlayers', (players) => {
		players.forEach(player => {
			$scope.players.push(player);
		});
		toggleButton();
		$scope.$apply();
	});

	socket.on('newPlayer', (player) => {
		$scope.players.push(player);
		$scope.$apply();
	});

	socket.on('playerLeft', (socketId) => {
		$scope.players = $scope.players.filter(player => player.socketId != socketId);
		toggleButton();
		$scope.$apply();
	});

	socket.on('playSong', (song) => {
		var audio = new Audio(song.preview_url);
		audio.play();
	})

	toggleButton = function() {
		if ($scope.players[0].socketId == socket.id && !gameStarted) {
			$scope.showButton = true;
		} else {
			$scope.showButton = false;
		}
	}

	$scope.startGame = function() {
		let n = Math.floor(Math.random() * 10);
		console.log(n);
		let song = user.recent_songs[n];
		console.log(song);
		socket.emit('sendSong', roomId, song);
	}

});