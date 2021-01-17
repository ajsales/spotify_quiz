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
	 * Returns random song from artist.
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