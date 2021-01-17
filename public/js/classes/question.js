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
		var songs = Player.getRandomSongs(players, option);

		var song = songs[_randomInt(songs.length)];
		while (!song.previewUrl) {
			song = songs[_randomInt(songs.length)];
		}
		var question = `Whose ${option} Top 10 favorite song is ${song.toString()}?`;
		var choices = players.map(player => player.name);
		var answers = players.filter(p => p.likesSong(song, option)).map(p => p.name);
		var image = song.image;
		super(question, choices, answers, song, image);
	}
}

class IdentifyPlayerFromArtist extends Question {
	constructor(players, option) {
		var artists = Player.getRandomArtists(players, option);
		var artist = artists[_randomInt(artists.length)];

		var question = `Whose ${option} Top 10 favorite artist is ${artist.name}?`;
		var choices = players.map(player => player.name);
		var answers = players.filter(p => p.likesArtist(artist, option)).map(p => p.name);
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

		var question = `What is one of ${player.name}'s ${option} Top 10 artists?`
		var choices = artists.map(artist => artist.name);
		var answers = artists.filter(a => player.likesArtist(a, option)).map(a => a.name);
		var song = artists[_randomInt(artists.length)].randomSong;
		while (!song.previewUrl) {
			song = artists[_randomInt(artists.length)].randomSong;
		}
		var image = player.profileImage;
		super(question, choices, answers, song, image);
	}
}

function _randomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = Question;