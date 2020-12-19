app.controller('CallbackController', function($scope, spotify, $location, $animate, $timeout) {

	var token;
	var playerData;

	var init = function() {

		token = $location.hash().split('&')[0].split('=')[1];
		spotify.setAccessToken(token);

		var windowEl = angular.element(document.querySelector('.window'));
		$animate.addClass(windowEl, 'typewriter').then(() => {
			$timeout(getSpotifyData, 1500);
		}, (err) => {
			console.log(err);
		})
	}
	init();

	var getSpotifyData = async function() {
		playerData = {};
		var response;

		// Get player's profile name and image.
		response = await spotify.getMe();
		playerData.name = response.display_name;
		console.log(response);
		if (response.images) {
			playerData.profileImage = response.images[0].url;
		} else {
			playerData.profileImage = 'https://img.icons8.com/clouds/200/000000/spotify.png';
		}

		// Get player's favorite recent songs.
		response = await spotify.getMyTopTracks({limit: 10, time_range: 'short_term'});
		playerData.recentSongs = response.items;

		// Get player's favorite all-time songs.
		response = await spotify.getMyTopTracks({limit: 10, time_range: 'long_term'});
		playerData.allTimeSongs = response.items;

		// Get player's favorite recent artists and their top tracks.
		response = await spotify.getMyTopArtists({limit: 10, time_range: 'short_term'});
		playerData.recentArtists = response.items;
		for (var i = 0; i < playerData.recentArtists.length; i++) {
			var artist = playerData.recentArtists[i];
			response = await spotify.getArtistTopTracks(artist.id, 'US');
			playerData.recentArtists[i].topTracks = response.tracks;
		}

		// Get player's favorite all-time artists and their top tracks.
		response = await spotify.getMyTopArtists({limit: 10, time_range: 'long_term'});
		playerData.allTimeArtists = response.items;
		for (var i = 0; i < playerData.allTimeArtists.length; i++) {
			var artist = playerData.allTimeArtists[i];
			response = await spotify.getArtistTopTracks(artist.id, 'US');
			playerData.allTimeArtists[i].topTracks = response.tracks;
		}

		localStorage.setItem('playerData', JSON.stringify(playerData));

		$location.hash('');
		$location.path('/rooms');
		$scope.$apply();
	}

});