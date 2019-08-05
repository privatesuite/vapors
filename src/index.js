require("dotenv").config();

const Discord = require("discord.js");
const commands = require("./commands");

const text = require("./radio/text");
const radio = require("./radio");
const voice = require("./radio/voice");
// const spade = require("spade");
const playlist = require("./radio/playlist");

const client = new Discord.Client();

client.on("ready", async () => {

	const authorizedGuilds = process.env.AUTHORIZED_GUILDS.split(",").map(_ => _.trim());

	for (const guild of client.guilds.array().filter(_ => authorizedGuilds.indexOf(_.id) !== -1)) {

		let textChannel = guild.channels.find(_ => _.name.toLowerCase() === "radio" && _.type === "text");
		let voiceChannel = guild.channels.find(_ => _.name.toLowerCase() === "radio" && _.type === "voice");

		if (textChannel) {

			await text(textChannel);

		}

		if (voiceChannel) {

			await voice(voiceChannel);

		}

	}

	voice.emptyCache();

	console.log("Radio ready, starting service.");

	// console.log((await spade.getRecentAlbums(15))[0].url)

	// var tracks = (await spade.getAlbum((await spade.getRecentAlbums(15))[0].url)).tracks;

	// radio.playTrack(tracks[0]);

	// radio.playPlaylist(await playlist.generateNewAlbumPlaylist(50));

});

client.on("message", message => {

	commands.parse(message);	

});

client.login(process.env.TOKEN);
