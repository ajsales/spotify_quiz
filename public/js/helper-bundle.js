(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.helper = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Song = require('./song');

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
	 * Returns random song from artist or false.
	 */
	get randomSong() {
		var songs = this.artist.topTracks;
		var n = _randomInt(songs.length);
		return songs[n];
	}
}

function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = Artist;
},{"./song":4}],2:[function(require,module,exports){
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
		return [...result];
	}
}

function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = Player;
},{"./artist":1,"./song":4}],3:[function(require,module,exports){
const Player = require('./player');
const Song = require('./song');
const Artist = require('./artist');

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
		var questions;
		if (players.length < 4) {
			questions = [
				IdentifyFavoriteSong,
				IdentifyFavoriteArtist
			];
		} else {
			questions = [
				IdentifyPlayerFromSong,
				IdentifyPlayerFromArtist,
				IdentifyFavoriteSong,
				IdentifyFavoriteArtist
			];
		}
		var question = questions[_randomInt(questions.length)];
		var option = ['recent', 'all-time'][_randomInt(2)];
		return new question(players, option);
	}

	static setExtraSongs(songs) {
		this.extraSongs = songs.map(song => new Song(song));
	}

	static setExtraArtists(artists) {
		this.extraArtists = artists.map(artist => new Artist(artist));
	}
}

class IdentifyPlayerFromSong extends Question {
	constructor(players, option) {
		var songs = Player.getRandomSongs(players, option);

		var song = songs[_randomInt(songs.length)];
		while (!song.previewUrl) {
			song = songs[_randomInt(songs.length)];
		}

		var question = `Whose ${option} Top 10 favorite song is ${song.toString()}?`;
		var answers = players.filter(p => p.likesSong(song, option)).map(p => p.name);
		var choices = Player.getRandomPlayers(players, answers[_randomInt(answers.length)]);
		var image = song.image;
		super(question, choices, answers, song, image);
	}
}

class IdentifyPlayerFromArtist extends Question {
	constructor(players, option) {
		var artists = Player.getRandomArtists(players, option);
		var artist = artists[_randomInt(artists.length)];

		var question = `Whose ${option} Top 10 favorite artist is ${artist.name}?`;
		var answers = players.filter(p => p.likesArtist(artist, option)).map(p => p.name);
		var choices = Player.getRandomPlayers(players, answers[_randomInt(answers.length)]);
		var song = artist.randomSong;
		while (!song.previewUrl) {
			song = artist.randomSong;
		}
		var image = artist.image;
		super(question, choices, answers, song, image);
	}
}

class IdentifyFavoriteSong extends Question {
	constructor(players, option) {
		var songs = Player.getRandomSongs(players, option);

		var song = songs[_randomInt(songs.length)];
		while (!song.previewUrl) {
			song = songs[_randomInt(songs.length)];
		}

		while (songs.length < 4) {
			var randomSong = Question.extraSongs[_randomInt(Question.extraSongs.length)];
			if (!songs.includes(randomSong)) {
				songs.push(randomSong);
			}
		}
		songs = _shuffle(songs);

		var player = players.filter(p => p.likesSong(song, option))[0];

		var question = `What is one of ${player.name}'s ${option} Top 10 songs?`
		var choices = songs.map(song => song.toString());
		var answers = songs.filter(s => player.likesSong(s, option)).map(s => s.toString());
		song = songs[_randomInt(songs.length)];
		var image = player.profileImage;
		super(question, choices, answers, song, image);
	}
}

class IdentifyFavoriteArtist extends Question {
	constructor(players, option) {
		var artists = Player.getRandomArtists(players, option);
		var artist = artists[_randomInt(artists.length)];
		var player = players.filter(p => p.likesArtist(artist, option))[0];

		while (artists.length < 4) {
			var randomArtist = Question.extraArtists[_randomInt(Question.extraArtists.length)];
			if (!artists.includes(randomArtist)) {
				artists.push(randomArtist);
			}
		}
		artists = _shuffle(artists);

		var question = `What is one of ${player.name}'s ${option} Top 10 artists?`
		var choices = artists.map(artist => artist.name);
		var answers = artists.filter(a => player.likesArtist(a, option)).map(a => a.name);
		var song = artists[_randomInt(artists.length)].randomSong;
		while (!song || !song.previewUrl) {
			song = artists[_randomInt(artists.length)].randomSong;
		}
		var image = player.profileImage;
		super(question, choices, answers, song, image);
	}
}

function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

function _shuffle(array) {
  	var currentIndex = array.length, temporaryValue, randomIndex;

  	// While there remain elements to shuffle...
  	while (0 !== currentIndex) {

   		// Pick a remaining element...
   	 	randomIndex = Math.floor(Math.random() * currentIndex);
   	 	currentIndex -= 1;

   	 	// And swap it with the current element.
   	 	temporaryValue = array[currentIndex];
   	 	array[currentIndex] = array[randomIndex];
   	 	array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = Question;
},{"./artist":1,"./player":2,"./song":4}],4:[function(require,module,exports){
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
		artists = artists.filter(artist => !this.song.name.includes(artist));
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

module.exports = Song;
},{}],5:[function(require,module,exports){
module.exports.Player = require('./classes/player');
module.exports.Song = require('./classes/song');
module.exports.Artist = require('./classes/artist');
module.exports.Question = require('./classes/question');
},{"./classes/artist":1,"./classes/player":2,"./classes/question":3,"./classes/song":4}]},{},[5])(5)
});
