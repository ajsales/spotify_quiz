app.controller('CallbackController', function($scope, Spotify) {

	var token = window.location.hash.split('&')[0].split('=')[1];
    localStorage.setItem('spotify-token', token);
    $scope.token = token;
    $scope.token2 = localStorage.getItem('spotify-token');
});