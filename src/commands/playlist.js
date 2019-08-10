const fs = require("fs");
const path = require("path");
const radio = require("../radio");
const Discord = require("discord.js");
const strings = require("../utils/strings");
const playlist = require("../radio/playlist");

const playlists_path = path.join(__dirname, "..", "..", "playlists");

module.exports = {

	/**
	 * Like the currently playing radio track
	 * 
	 * @param {Discord.Message} message 
	 * @param {(boolean|number|string)[]} args
	 */
	async run (message, args) {

		if (args[0] && !message.member) {

			message.reply("Please run this command on a compatible server.");
			return;

		} 

		if (message.member.hasPermission("MANAGE_GUILD")) {

			if (args[0] === "list") {

				message.channel.send("**Playlists**\n\n" + fs.readdirSync(playlists_path).map(_ => `- ${_.replace(".json", "")}\n`));

			} else if (args[0] === "play" && args[1]) {

				const ppath = path.join(playlists_path, `${args[1]}.json`);

				if (!fs.existsSync(ppath)) {

					message.channel.send(`Could not find playlist **${args[1]}**.`);
					return;
					
				}

				message.channel.send(`Loading playlist **${args[1]}**...`);

				const _playlist = await playlist.Playlist.import(ppath);

				if (typeof args[2] === "number" && _playlist.tracks[args[2] - 1]) _playlist.currentlyPlaying = args[2] - 1;

				message.channel.send(`Playing playlist **${args[1]}**...`);

				radio.playPlaylist(_playlist);

				return;

			} else if (args[0] === "generate" && args[1]) {

				if (args[1] === "new_albums" && typeof args[2] === "number") {

					message.channel.send(`Fetching **${args[2]}** newest albums and creating playlist...`);

					const naPlaylist = await playlist.generateNewAlbumPlaylist(args[2]);
					naPlaylist.export(path.join(playlists_path, `${naPlaylist.id}.json`));

					message.channel.send(`Created playlist with id **${naPlaylist.id}** and name **${naPlaylist.name}** that contains **${naPlaylist.tracks.length}** tracks.`);

				} else {

					message.channel.send(`Could not generate playlist of type **${args[1]}**.`);

				}

				return;

			}

		}

		if (radio.getPlaylist()) {

			// const track = radio.getPlaylist().getCurrentTrack();

			// message.author.send(`You liked **${track.title}** in **${track.album.artist}**'s album **${track.album.title}**.`);

			let tracks = `Playlist **${radio.getPlaylist().name}**\n\n`;

			let i = 0;
			for (const track of radio.getPlaylist().tracks) {
				
				tracks += `${("" + (i + 1)).padStart(4, "0")}) **${strings.safe(track.album.artist)}** | **${strings.safe(track.album.title)}** | **${strings.safe(track.title)}**`;
				if (i === radio.getPlaylist().currentlyPlaying) tracks += ` (currently playing)`;
				tracks += "\n";

				i++;

			}

			i++;

			for (const string of strings.divide(tracks, 2000, "\n")) {

				// console.log(string.length);

				await message.author.send(string);

			}

			// message.author.send({

			// 	embed: new Discord.RichEmbed({
					
			// 		title: `Playlist **${radio.getPlaylist().name}**`,

			// 		description: `> Tracks\n\n${tracks}`

			// 	})

			// });

		}

	}

}
