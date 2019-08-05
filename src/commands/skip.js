const text = require("../radio/text");
const voice = require("../radio/voice");
const radio = require("../radio");
const Discord = require("discord.js");
const strings = require("../utils/strings");

let votes = new Set();

function getListeners () {

	return new Set(...voice.getChannels().map(_ => _.members.filter(_ => !_.user.bot).map(_ => _.id)));

}

function getListenerAmount () {

	return getListeners().size;

}

module.exports = {

	/**
	 * Skip the currently playing radio track
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {

		if (!getListeners().has(message.author.id)) return;

		if (votes.size === 0) {

			radio.getPlaylist().once("track", () => {

				console.log("Skip votes reset.");

				votes = new Set();

			});

		}

		votes.add(message.author);

		message.channel.send(`${strings.percent(votes.size / getListenerAmount())} of listeners want to skip this track (${process.env.SKIP_PERCENTAGE}% required)`);

		if ((votes.size / getListenerAmount() * 100) >= parseFloat(process.env.SKIP_PERCENTAGE)) {

			text.skip(votes.size / getListenerAmount());

			console.log("Skipping track...");
			voice.stop();

		}

	}

}
