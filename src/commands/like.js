const radio = require("../radio");
const Discord = require("discord.js");

module.exports = {

	/**
	 * Like the currently playing radio track
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {

		if (radio.getPlaylist()) {

			const track = radio.getPlaylist().getCurrentTrack();

			message.author.send(`You liked **${track.title}** in **${track.album.artist}**'s album **${track.album.title}**.`);

		}

	}

}
