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