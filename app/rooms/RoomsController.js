app.controller('RoomsController', function($scope, $location, socket) {

	$scope.createRoom = function() {
		$location.path('/game/' + socket.id);
		$scope.apply();
	};

	$scope.joinRoom = function() {
		const roomId = $scope.roomId;
		$location.path('/game/' + roomId);
		$scope.apply();
	};
});