app.controller('RoomsController', function($scope, $location, socket) {

	const user = JSON.parse(localStorage.getItem('user'));
	socket.on('connect', () => {
		console.log('A player connected!');
		socket.emit('joinServer', user);
	});

	var availableRooms;
	socket.emit('currentRoomsRequest');

	socket.on('currentRooms', (rooms) => {
		console.log('Here are the available rooms: ' + rooms);
		availableRooms = rooms;
	})

	$scope.createRoom = function() {
		$location.path('/game/' + socket.id);
	};

	$scope.joinRoom = function() {
		const roomId = $scope.roomId;
		if (availableRooms && availableRooms.includes(roomId)) {
			$location.path('/game/' + roomId);
		} else {
			alert('Room does not exist.');
		}
	};
});