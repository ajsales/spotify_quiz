var app = angular.module('SpotifyQuizApp', ['ngRoute']);

app.config(($routeProvider, $locationProvider) => {
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
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('');
});

app.factory('spotify', () => {
	return new SpotifyWebApi();
});

app.factory('socket', () => {
	const socket = io({transports: ['websocket'], upgrade: false});
	return socket;
});