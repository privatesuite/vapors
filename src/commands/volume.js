// const text = require("../radio/text");
const voice = require("../radio/voice");
const radio = require("../radio");
const Discord = require("discord.js");

module.exports = {

	/**
	 * Volumize the currently playing playlist
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {

		if (message.member && message.member.hasPermission("MANAGE_GUILD")) {

			if (typeof args[0] === "number") {
				
				voice.getStream().setVolume(args[0] / 100);

				if (radio.getPlaylist()) radio.getPlaylist().volume = args[0] / 100;

				message.channel.send(`Track volume set to ${args[0]}%.`);

			}

		}

	}

}
