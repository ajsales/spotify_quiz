/**
 * This sets up the AngularJS side of the app.
 */

var app = angular.module('SpotifyQuizApp', ['ngRoute', 'ngAnimate']);


app.config(($routeProvider, $locationProvider) => {

	// Sets up the routes for the app
	$routeProvider
		.when('/', {
			controller: 'LoginController',
			templateUrl: 'login/login.html'
		})
		.when('/callback', {
			controller:'CallbackController',
			templateUrl: 'callback/callback.html'
		})
		.when('/rooms', {
			controller: 'RoomsController',
			templateUrl: 'rooms/rooms.html'
		})
		.when('/game/:roomId', {
			controller: 'GameController',
			templateUrl: 'game/game.html'
		})
		.otherwise({
			redirectTo: '/'
		})

	// Cleans up random symbols in the route
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('');
});

// Imports Spotify API for use in controllers
app.factory('spotify', () => {
	return new SpotifyWebApi();
});

// Imports Player helper methods for use in controllers
app.factory('Player', () => {
	return helper.Player;
});

// Imports Song helper methods for use in controllers
app.factory('Song', () => {
	return helper.Song;
})

// Imports Question helper methods for use in controllers
app.factory('Question', () => {
	return helper.Question;
});