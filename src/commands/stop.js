// const text = require("../radio/text");
const voice = require("../radio/voice");
const radio = require("../radio");
const Discord = require("discord.js");

module.exports = {

	/**
	 * Stop the currently playing playlist
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {

		if (message.member && message.member.hasPermission("MANAGE_GUILD")) {

			if (radio.getPlaylist()) {

				radio.getPlaylist().playing = false;
				message.channel.send(`Playlist **${radio.getPlaylist().name}** stopped.`);

			}
			
			voice.stop();

		}

	}

}
