const Song = require('./song');
const Artist = require('./artist');

class Player {
	constructor(socketId, playerData) {
		this.socketId = socketId;

		playerData.recentSongs = playerData.recentSongs.map(song => new Song(song));
		playerData.allTimeSongs = playerData.allTimeSongs.map(song => new Song(song));
		playerData.recentArtists = playerData.recentArtists.map(artist => new Artist(artist));
		playerData.allTimeArtists = playerData.allTimeArtists.map(artist => new Artist(artist));
		
		this.playerData = playerData;
		this.points = 0;
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
		var songs;
		if (option == 'recent') {
			songs = this.playerData.recentSongs.map(s => s.toString());
		} else if (option == 'all-time') {
			songs = this.playerData.allTimeSongs.map(s => s.toString());
		} else if (option == 'both') {
			songs = this.playerData.recentSongs.map(s => s.toString());
			songs = songs.concat(this.playerData.allTimeSongs.map(s => s.toString()));
		} else {
			console.error('Option inputted is incorrect.');
		}

		if (typeof song == 'string') {
			return songs.includes(song);
		} else {
			return songs.includes(song.toString());
		}
	}

	/**
	 * Returns true if artist is on the player's given favorite list.
	 *
	 * @param {Artist} artist The artist to be checked.
	 * @param {string} option The favorite list to be checked.
	 */
	likesArtist(artist, option) {
		var artists;
		if (option == 'recent') {
			artists = this.playerData.recentArtists.map(a => a.name);
		} else if (option == 'all-time') {
			artists = this.playerData.allTimeArtists.map(a => a.name);
		} else if (option == 'both') {
			artists = this.playerData.recentArtists.map(a => a.name);
			artists = artists.concat(this.playerData.allTimeArtists.map(a => a.name));
		} else {
			console.error('Option inputted is incorrect.');
		}

		if (typeof artist == 'string') {
			return artists.includes(artist);
		} else {
			return artists.includes(artist.name);
		}
	}

	/**
	 * Adds points to player's score.
	 *
	 * @param {int} time The amount of time the player had left
	 * @param {string} answer The answer the player gave
	 */
	addPoints(time, answer) {
		var score = time;
		if (!(this.likesSong(answer, 'both') ||
			this.likesArtist(answer, 'both') ||
			answer == this.name)) {
			score *= 1.5;
		}
		this.points += score;
		return score;
	}

	/**
	 * Returns player from player object.
	 *
	 * @param {Player} playerObj
	 */
	static getPlayer(playerObj) {
		var player = new Player(playerObj.socketId, playerObj.playerData);
		player.points = playerObj.points;
		return player;
	}

	/**
	 * Returns random songs from array of players.
	 *
	 * @param {Player[]} players
	 * @param {string} option The list from which to pick songs.
	 */
	static getRandomSongs(players, option) {
		var songs = new Set();
		while (songs.size < Math.min(players.length, 4)) {
			var player = players[_randomInt(players.length)];
			songs.add(player.pickRandomSong(option));
		}
		return [...songs];
	}

	/**
	 * Returns random artists from array of players.
	 *
	 * @param {Player[]} players
	 * @param {string} option The list from which to pick artists.
	 */
	static getRandomArtists(players, option) {
		var artists = new Set();
		while (artists.size < Math.min(players.length, 4)) {
			var player = players[_randomInt(players.length)];
			artists.add(player.pickRandomArtist(option));
		}
		return [...artists];
	}

	/**
	 * Returns random 4 players from set.
	 *
	 * @param {Player[]} players
	 * @param {string} included Player to include (i.e. the answer).
	 */
	static getRandomPlayers(players, included) {
		var result = new Set([included]);
		while (result.size < 4) {
			var player = players[_randomInt(players.length)];
			result.add(player.name);
		}
		return [...players];
	}
}

function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = Player;