var app = angular.module('SpotifyQuizApp', ['ngRoute', 'spotify']);

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

app.config((SpotifyProvider) => {
	SpotifyProvider.setClientId('aeac4f1243f347d0a8a020c150d78fd8');
	if (location.host == 'localhost:8081') {
		SpotifyProvider.setRedirectUri('http://localhost:8081/callback');
	}
	SpotifyProvider.setScope('user-read-private user-top-read');
	
})

app.factory('socket', () => {
	const socket = io({transports: ['websocket'], upgrade: false});
	return socket;
});