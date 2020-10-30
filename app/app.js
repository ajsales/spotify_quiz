var app = angular.module('SpotifyQuizApp', ['ngRoute']);

app.config(($routeProvider) => {
	$routeProvider
		.when('/', {
			controller: 'HomeController',
			templateUrl: 'home/home.html'
		})
		.otherwise({
			redirectTo: '/'
		})

})