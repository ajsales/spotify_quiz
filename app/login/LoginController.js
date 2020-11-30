app.controller('LoginController', function($scope, Spotify, $location) {

	$scope.login = function() {

		const user = {};
		
		Spotify.login().then(() => {
			alert('You are now logged in.');

			// Get user's profile name and image.
			return Spotify.getCurrentUser();
		}, () => console.log("Couldn't get profile name and image."))
		.then((res) => {
			user.name = res.data.display_name;
			user.image = res.data.images[0].url;

			// Get user's top 10 recent songs.
			return Spotify.getUserTopTracks({limit: 10, time_range: 'short_term'});
		}, () => console.log("Couldn't get top tracks (short-term)."))
		.then((res) => {
			user.recent_songs = res.data.items;

			// Get user's top 10 all-time songs.
			return Spotify.getUserTopTracks({limit: 10, time_range: 'long_term'});
		}, () => console.log("Couldn't get top tracks (long-term)."))
		.then((res) => {
			user.alltime_songs = res.data.items;

			//Get user's top 10 recent artists.
			return Spotify.getUserTopArtists({limit: 10, time_range: 'short_term'});
		}, () => console.log("Couldn't get top artists (short-term)."))
		.then((res) => {
			user.recent_artists = res.data.items;

			//Get user's top 10 all-time artists.
			return Spotify.getUserTopArtists({limit: 10, time_range: 'long_term'});
		}, () => console.log("Couldn't get top artists (long-term)."))
		.then((res) => {
			user.alltime_artists = res.data.items;

			localStorage.setItem('user', JSON.stringify(user));
			$location.path('/rooms');
		})
	};
});