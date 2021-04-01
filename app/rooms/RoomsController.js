/**
 * Controller for rooms page. Allows player to create room or
 * join existing one.
 */

app.controller('RoomsController', function($scope, $location) {

	var availableRooms;
	var socket;
	var extraSongs;
	var extraArtists;

	var init = function() {
		socket = io('/rooms');
		$scope.spotifyLogo = 'img/Spotify_Logo_RGB_White.png';
	}
	init();

	// Server message for showing the available rooms
	socket.on('availableRooms', (rooms) => {
		availableRooms = rooms;
	})

	// Creates new room for player
	$scope.createRoom = function() {

		// Loads in extra data for room, in case of fewer players
		extraSongs = JSON.parse(localStorage.getItem('extraSongs'));
		extraArtists = JSON.parse(localStorage.getItem('extraArtists'));

		socket.emit('createRoom', socket.id, extraSongs, extraArtists);
		$location.path('/game/' + socket.id);
	};

	// Player joins existing room
	$scope.joinRoom = function() {
		const roomId = $scope.roomId;
		if (availableRooms.includes(roomId)) {
			$location.path('/game/' + roomId);
		} else {
			alert('Room does not exist.');
		}
	};
});