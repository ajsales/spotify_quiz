app.controller('CallbackController', function($scope, Spotify) {

	var token = window.location.hash.split('&')[0].split('=')[1];
    localStorage.setItem('spotify-token', token);
});