const fs = require("fs");
const text = require("./text");
const voice = require("./voice");
const spade = require("spade");
const Arrays = require("../utils/arrays");
const events = require("events");

class Playlist extends events.EventEmitter {
	
	/**
	* Creates a playlist
	*  
	* @param {string} id The playlist's unique identifier
	* @param {string} name The playlist's name
	* @param {any} albums The playlist's album URLs
	* @param {any} tracks The playlist's tracks
	*/
	constructor (id, name, albums, tracks) {
		
		super();

		this.id = id;
		this.name = name;
		this.albums = albums;
		this.tracks = tracks;
		
		this.volume = 1;
		this.playing = false;
		this.currentlyPlaying = 0;

	}
	
	getCurrentTrack () {

		return this.tracks[this.currentlyPlaying];

	}

	async play () {
		
		this.playing = true;

		while (this.playing && this.tracks[this.currentlyPlaying]) {
			
			if (this.currentlyPlaying % (parseInt(process.env.YL_FREQUENCY) - 1) === 0) {
				
				await voice.playYl();

				this.emit("yl");

			}

			if (!this.tracks[this.currentlyPlaying]) {

				break;

			}

			console.log(`Playing track ${this.currentlyPlaying}`);

			// console.log(this.tracks[this.currentlyPlaying]);

			text.playTrack(this.currentlyPlaying, this.tracks[this.currentlyPlaying]);
			await voice.cacheUrl(this.tracks[this.currentlyPlaying].file["mp3-128"]);
			if (this.tracks[this.currentlyPlaying + 1]) voice.cacheUrl(this.tracks[this.currentlyPlaying + 1].file["mp3-128"]);
			let p = voice.playUrl(this.tracks[this.currentlyPlaying].file["mp3-128"]);
			voice.getStream().setVolume(this.volume);
			await p;

			this.emit("track");

			console.log(`Next track ${this.currentlyPlaying + 1}...`);

			this.currentlyPlaying++;
			if (!this.playing) break;
			
		}
		
	}
	
	/**
	 * 
	 * @param {string|object} from Path to playlist file or playlist export object
	 */
	static async import (from) {

		if (typeof from === "string") {

			from = JSON.parse(fs.readFileSync(from).toString());

		}

		const albums = await Promise.all(from.albums.map(_ => spade.getAlbum(_)));

		return new Playlist(from.id, from.name, albums, from.tracks.map(_ => albums.find(__ => __.url === _.album).tracks[_.position]));

	}

	export (to) {

		let data = {

			id: this.id,
			name: this.name,

			albums: this.albums.map(_ => _.url),

			tracks: this.tracks.map(_ => {return {

				album: _.album.url,
				position: _.position

			}})

		}

		if (to) fs.writeFileSync(to, JSON.stringify(data));

		return data;

	}
	
}

module.exports = {
	
	Playlist,
	
	async generateNewAlbumPlaylist (albumCount = 50) {
	
		console.log("Creating new album playlist...");
		
		const albums = await spade.getRecentAlbums(albumCount);
	
		let tracks = [];
		let albumDataQueue = [];

		for (const album of albums) {
			
			albumDataQueue.push(spade.getAlbum(album.url));
			
		}

		albumDataQueue = await Promise.all(albumDataQueue);
		albumDataQueue.filter(_ => !!_).map(_ => tracks.push(..._.tracks));

		tracks = tracks.filter(_ => _.file && _.file["mp3-128"]);
		Arrays.shuffle(tracks);

		console.log(`Created new album playlist with ${tracks.length} tracks!`);

		return new Playlist(`new_albums_${Date.now()}`, `New Albums ${Date.now()}`, albums, tracks);
		
	}
	
}