app.controller('RoomsController', function($scope, $location) {

	var availableRooms;
	var socket;

	var init = function() {
		socket = io('/rooms');
	}
	init();

	socket.on('availableRooms', (rooms) => {
		console.log('Here are the available rooms: ' + rooms);
		availableRooms = rooms;
	})

	$scope.createRoom = function() {
		socket.emit('createRoom', socket.id);
		$location.path('/game/' + socket.id);
	};

	$scope.joinRoom = function() {
		const roomId = $scope.roomId;
		if (availableRooms.includes(roomId)) {
			$location.path('/game/' + roomId);
		} else {
			alert('Room does not exist.');
		}
	};
});