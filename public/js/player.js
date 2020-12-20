class Player {
	constructor(socketId, playerData) {
		this.socketId = socketId;

		playerData.recentSongs = playerData.recentSongs.map(song => new Song(song));
		playerData.allTimeSongs = playerData.allTimeSongs.map(song => new Song(song));
		playerData.recentArtists = playerData.recentArtists.map(artist => new Artist(artist));
		playerData.allTimeArtists = playerData.allTimeArtists.map(artist => new Artist(artist));
		
		this.playerData = playerData;
	}

	/**
	 * Returns player name.
	 */
	get name() {
		return this.playerData.name;
	}

	/**
	 * Returns player profile image.
	 */
	get profileImage() {
		return this.playerData.profileImage;
	}


	/**
	 * Returns a random song from the given list.
	 *
	 * @param {string} option The list from which to pick a song.
	 */
	pickRandomSong(option) {
		var n;
		if (option == 'recent') {
			n = _randomInt(this.playerData.recentSongs.length)
			return this.playerData.recentSongs[n];
		} else if (option == 'all-time') {
			n = _randomInt(this.playerData.allTimeSongs.length)
			return this.playerData.allTimeSongs[n];
		} else {
			console.error('Option inputted is incorrect.');
		}
	}

	/**
	 * Returns a random song from the player's recent favorites.
	 */
	get randomRecentSong() {
		return this.pickRandomSong('recent');
	}

	/**
	 * Returns a random song from the player's all-time favorites.
	 */
	get randomAllTimeSong() {
		return this.pickRandomSong('all-time');
	}

	/**
	 * Returns a random artist from the given list.
	 *
	 * @param {string} option The list from which to pick an artist.
	 */
	pickRandomArtist(option) {
		var n;
		if (option == 'recent') {
			n = _randomInt(this.playerData.recentArtists.length)
			return this.playerData.recentArtists[n];
		} else if (option == 'all-time') {
			n = _randomInt(this.playerData.allTimeArtists.length)
			return this.playerData.allTimeArtists[n];
		} else {
			console.error('Option inputted is incorrect.');
		}
	}

	/**
	 * Returns a random artist from the player's recent favorites.
	 */
	get randomRecentArtist() {
		return this.pickRandomArtist('recent');
	}

	/**
	 * Returns a random artist from the player's all-time favorites.
	 */
	get randomAllTimeArtist() {
		return this.pickRandomArtist('all-time');
	}

	/**
	 * Returns true if song is on the player's given favorite list.
	 *
	 * @param {Song} song The song to be checked.
	 * @param {string} option The favorite list to be checked.
	 */
	likesSong(song, option) {
		if (option == 'recent') {
			return this.playerData.recentSongs.includes(song);
		} else if (option == 'all-time') {
			return this.playerData.allTimeSongs.includes(song);
		} else {
			console.error('Option inputted is incorrect.');
		}
	}

	/**
	 * Returns true if artist is on the player's given favorite list.
	 *
	 * @param {Artist} artist The artist to be checked.
	 * @param {string} option The favorite list to be checked.
	 */
	likesArtist(artist, option) {
		if (option == 'recent') {
			return this.playerData.recentArtists.includes(artist);
		} else if (option == 'all-time') {
			return this.playerData.allTimeArtists.includes(artist);
		} else {
			console.error('Option inputted is incorrect.');
		}
	}

	/**
	 * Returns player from player object;
	 */
	static getPlayer(player) {
		return new Player(player.socketId, player.playerData);
	}
}

class Song {
	constructor(song) {
		if (song.song) {
			this.song = song.song;
		} else {
			this.song = song;
		}
	}

	/**
	 * Returns the song name.
	 */
	get name() {
		return this.song.name;
	}

	/**
	 * Returns the preview url for the song.
	 */
	get previewUrl() {
		return this.song.preview_url;
	}

	/**
	 * Returns the artists for the song.
	 */
	get artist() {
		var artists = this.song.artists.map(artist => artist.name);
		return artists.join(', ')
	}

	/**
	 * Returns an image for the song.
	 */
	get image() {
		var images = this.song.album.images;
		return images[0].url;
	}

	/**
	 * Returns string representation for the song.
	 */
	toString() {
		return this.name + ' by ' + this.artist;
	}
}

class Artist {
	constructor(artist) {
		if (artist.artist) {
			this.artist = artist.artist;
		} else {
			this.artist = artist;
		}

		this.artist.topTracks = this.artist.topTracks.map(song => new Song(song));
	}

	/**
	 * Returns the artist's name.
	 */
	get name() {
		return this.artist.name;
	}

	/**
	 * Returns an image for the artist.
	 */
	get image() {
		var images = this.artist.images;
		return images[0].url;
	}

	/**
	 * Returns random song from artist.
	 */
	get randomSong() {
		var songs = this.artist.topTracks;
		var n = _randomInt(songs.length);
		return songs[n];
	}
}

class Question {
	constructor(question, choices, answers, song, image) {
		this.question = question;
		this.choices = choices;
		this.answers = answers;
		this.song = song;
		this.image = image;
	}

	correctAnswer(answer) {
		console.log(this);
		return this.answers.includes(answer);
	}

	static getQuestion(questionObj) {
		var question = questionObj.question;
		var choices = questionObj.choices;
		var answers = questionObj.answers;
		var song = new Song(questionObj.song);
		var image = questionObj.image;
		return new Question(question, choices, answers, song, image);
	}

	static randomQuestion(players) {
		var questions = [
			IdentifyPlayerFromSong,
			IdentifyPlayerFromArtist,
			IdentifyFavoriteSong,
			IdentifyFavoriteArtist
		];
		var question = questions[_randomInt(questions.length)];
		var option = ['recent', 'all-time'][_randomInt(2)];
		return new question(players, option);
	}
}

class IdentifyPlayerFromSong extends Question {
	constructor(players, option) {
		var songs;
		if (option == 'recent') {
			songs = players.map(player => player.randomRecentSong);
		} else if (option == 'all-time') {
			songs = players.map(player => player.randomAllTimeSong);
		} else {
			console.error('Option inputted is incorrect.');
		}

		var song = songs[_randomInt(songs.length)];
		var question = `Whose ${option} Top 10 favorite song is ${song.toString()}?`;
		var choices = players.map(player => player.name);
		var answers = players.filter(p => p.likesSong(song, option)).map(p => p.name);
		var image = song.image;
		super(question, choices, answers, song, image);
	}
}

class IdentifyPlayerFromArtist extends Question {
	constructor(players, option) {
		var artists;
		if (option =='recent') {
			artists = players.map(player => player.randomRecentArtist);
		} else if (option =='all-time') {
			artists = players.map(player => player.randomAllTimeArtist);
		} else {
			console.error('Option inputted is inccorect.');
		}

		var artist = artists[_randomInt(artists.length)];

		var question = `Whose ${option} Top 10 favorite artist is ${artist.name}?`;
		var choices = players.map(player => player.name);
		var answers = players.filter(p => p.likesArtist(artist, option)).map(p => p.name);
		var song = artist.randomSong;
		var image = artist.image;
		super(question, choices, answers, song, image);
	}
}

class IdentifyFavoriteSong extends Question {
	constructor(players, option) {
		var songs;
		if (option == 'recent') {
			songs = players.map(player => player.randomRecentSong);
		} else if (option == 'all-time') {
			songs = players.map(player => player.randomAllTimeSong);
		} else {
			console.error('Option inputted is incorrect.');
		}

		var n = _randomInt(songs.length);
		var player = players[n];

		var question = `What is one of ${player.name}'s ${option} Top 10 songs?`
		var choices = songs.map(song => song.toString());
		var answers = songs.filter(s => player.likesSong(s, option)).map(s => s.toString());
		var song = songs[_randomInt(songs.length)];
		var image = player.profileImage;
		super(question, choices, answers, song, image);
	}
}

class IdentifyFavoriteArtist extends Question {
	constructor(players, option) {
		var artists;
		if (option =='recent') {
			artists = players.map(player => player.randomRecentArtist);
		} else if (option =='all-time') {
			artists = players.map(player => player.randomAllTimeArtist);
		} else {
			console.error('Option inputted is inccorect.');
		}

		var n = _randomInt(artists.length);
		var player = players[n];

		var question = `What is one of ${player.name}'s ${option} Top 10 artists?`
		var choices = artists.map(artist => artist.name);
		var answers = artists.filter(a => player.likesArtist(a, option)).map(a => a.name);
		var song = artists[_randomInt(artists.length)].randomSong;
		var image = player.profileImage;
		super(question, choices, answers, song, image);
	}
}



function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

if (typeof exports === "object") {
	module.exports.Player = Player;
	module.exports.Song = Song;
	module.exports.Question = Question;
}