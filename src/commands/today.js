// const axios = require("axios");
const spade = require("spade");
// const a = require("indefinite");
const consts = require("../consts");
const Discord = require("discord.js");

function capitalizeFirstLetter (string) {

	return string.charAt(0).toUpperCase() + string.slice(1);

}

module.exports = {

	/**
	 * Gets today's daily dose of Vaporwave
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {
		
		let i = 0;
		let album;
		const albums = (await spade.getRecentAlbums(40)).sort((a, b) => b.release_date - a.release_date);

		album = albums[0];
		while (["US Golf 95"].indexOf(albums[i].artist) !== -1 || album.artist.length > 20) album = albums[++i];

		const channel = args[0] ? message.guild.channels.find(_ => _.name.toLowerCase().replace("#", "") === args[0].toLowerCase().replace("#", "") || `<#${_.id}>` === args[0]) : message.channel;

		if (channel) {

			// console.log(album)

			await channel.send({embed: new Discord.RichEmbed({

				color: consts.colors.gray,

				// title: "Today's Album",

				// description: `> ** Today's Album **\n\n**${album.title}** by **${album.artist}** (Location: ${album.location}) is ${a(album.genre)} album`,

				description: "> ** Today's Album **",

				thumbnail: {

					url: album.album_cover(4)

				},

				fields: [{

					name: "URL",
					value: album.url,
					inline: false

				}, {

					name: "Title",
					value: album.title,
					inline: true

				}, {

					name: "Artist",
					value: album.artist,
					inline: true

				}, {

					name: "Location",
					value: album.location,
					inline: false

				}, {

					name: "Release Date",
					value: album.release_date.toUTCString(),
					inline: true

				}, {

					name: "Genre",
					value: album.genre,
					inline: true

				}, {

					name: "Featured Track",
					value: album.featured_track.title,
					inline: true

				}],

				footer: {

					text: "The content shown above is independently created and is not affiliated in any way with Private Suite Media. We support small creators, and you should too by visiting the album page and - if you want - donating!",
					icon_url: "https://avatars0.githubusercontent.com/u/49312853?s=200&v=4"

				},

				timestamp: Date.now()

			})});

			// await channel.send((await axios.get(album.featured_track.file["mp3-128"])).data, `${album.featured_track.title}.mp3`);

			// var m = await channel.send(`> **Getting featured track audio preview (${album.featured_track.title}.mp3)...**`);
			// await channel.send(new Discord.Attachment(album.featured_track.file["mp3-128"], `preview.mp3`));
			// await m.delete();

			message.channel.send(`> **Today's album sent in ${channel}.**`);

		} else {

			message.channel.send(`> **Error** Discord channel not found.`);

		}

	}

}
