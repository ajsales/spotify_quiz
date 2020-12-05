app.controller('CallbackController', function($scope, spotify, $location) {

	var token = $location.hash().split('&')[0].split('=')[1];
	spotify.setAccessToken(token);

	const user = {};

	spotify.getMe().then((res) => {
		user.name = res.display_name;
		if (res.images) {
			user.image = res.images[0].url;
		} else {
			user.image = 'https://img.icons8.com/clouds/200/000000/spotify.png';
		}

		// Get user's top 10 recent songs.
		return spotify.getMyTopTracks({limit: 10, time_range: 'short_term'});
	}, (err) => console.log(err))
	.then((res) => {
		user.recent_songs = res.items;

		// Get user's top 10 all-time songs.
		return spotify.getMyTopTracks({limit: 10, time_range: 'long_term'});
	}, (err) => console.log(err))
	.then((res) => {
		user.alltime_songs = res.items;

		//Get user's top 10 recent artists.
		return spotify.getMyTopArtists({limit: 10, time_range: 'short_term'});
	}, (err) => console.log(err))
	.then((res) => {
		user.recent_artists = res.items;

		//Get user's top 10 all-time artists.
		return spotify.getMyTopArtists({limit: 10, time_range: 'long_term'});
	}, (err) => console.log(err))
	.then((res) => {
		user.alltime_artists = res.items;

		localStorage.setItem('user', JSON.stringify(user));

		$location.hash('');
		$location.path('/rooms');
		$scope.$apply();
	}, (err) => console.log(err))
});