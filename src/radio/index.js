const fs = require("fs");
const text = require("./text");
const voice = require("./voice");
const playlist = require("./playlist");

const Playlist = playlist.Playlist;

/**
 * @type {Playlist}
 */
let currentPlaylist;

module.exports = {

	getPlaylist: () => currentPlaylist,

	async playTrack (track) {

		if (!fs.existsSync(voice.cachedUrl(track.file["mp3-128"]))) await voice.cacheUrl(track.file["mp3-128"]);
		
		await text.playTrack(track);
		return voice.playUrl(track.file["mp3-128"]);

	},

	async playPlaylist (playlist) {

		voice.stop();

		if (currentPlaylist) {

			currentPlaylist.playing = false;

		}

		console.log(`Playing playlist "${playlist.name}"...`);

		currentPlaylist = playlist;
		currentPlaylist.play();

	}

}
