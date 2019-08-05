const time = require("../utils/time");
const Discord = require("discord.js");
const strings = require("../utils/strings");

/**
 * @type {Discord.TextChannel[]}
 */
let channels = [];

module.exports = channel => channels.push(channel);

module.exports.playTrack = track => {

	for (const channel of channels) {

		channel.send({

			embed: new Discord.RichEmbed({

				title: "Now Playing",

				fields: [{

					name: "Track",
					value: track.title,
					inline: true

				}, {

					name: "Artist",
					value: track.album.artist,
					inline: true

				}, {

					name: "Album",
					value: track.album.title,
					inline: true

				}, {

					name: "Release Date",
					value: track.album.release_date.toUTCString(),
					inline: true

				}, {

					name: "Duration",
					value: time.format(track.duration),
					inline: true

				}],

				timestamp: Date.now()

			})

		});

	}

}

module.exports.skip = demand => {

	for (const channel of channels) {

		channel.send({

			embed: new Discord.RichEmbed({

				title: "Skipping track",

				fields: [{

					name: "Demand",
					value: strings.percent(demand),
					inline: true

				}],

				timestamp: Date.now()

			})

		});

	}

}
