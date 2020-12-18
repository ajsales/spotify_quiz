app.controller('LoginController', function($scope, $location, $window) {

	var init = function() {
		if (location.host == 'localhost:8081') {
			var redirect_uri = 'http://localhost:8081/callback';
		} else {
			var redirect_uri = 'https://spotify-friends-quiz.herokuapp.com/callback';
		}

		var params = {
			client_id: 'aeac4f1243f347d0a8a020c150d78fd8',
			redirect_uri: redirect_uri,
			scope: 'user-read-private user-top-read',
			response_type: 'token'
		};

		$scope.url ='https://accounts.spotify.com/authorize?' + toQueryString(params);
		$scope.spotifyLogo = 'img/Spotify_Logo_RGB_White.png';

	}
	init();

	function toQueryString(params) {
		var query = [];
		for (var key in params) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
		}
		return query.join('&')
	}
	
});