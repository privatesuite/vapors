const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
// const spade = require("spade");
const Arrays = require("../utils/arrays");
const Discord = require("discord.js");

/**
 * @type {Discord.StreamDispatcher}
 */
let stream;

/**
 * @type {Discord.VoiceBroadcast}
 */
let broadcast;

/**
 * @type {Discord.VoiceChannel[]}
 */
let channels = [];

function nsh (url) {

	let b64 = Buffer.from(url).toString("base64");
	return b64.slice(b64.length - 16, b64.length).toLowerCase() + ".mp3";

}

module.exports =

/**
 * 
 * @param {Discord.VoiceChannel} channel 
 */
async function (channel) {

	const connection = await channel.join();

	if (!broadcast) broadcast = channel.client.createVoiceBroadcast();

	channels.push(channel);

	connection.playBroadcast(broadcast);

}

module.exports.getChannels = () => channels;

module.exports.cacheUrl = async url => {

	console.log(`Caching ${nsh(url)}...`);

	if (fs.existsSync(module.exports.cachedUrl(url))) return;

	// return new Promise(async (resolve, reject) => {

	fs.writeFileSync(module.exports.cachedUrl(url), (await axios.get(url, {

		responseType: "arraybuffer"

	})).data);

	// });

}

module.exports.emptyCache = () => {

	const root = path.join(__dirname, "..", "..", "temp");
	const files = fs.readdirSync(root);

	for (const file of files) {
		
		fs.unlinkSync(path.join(root, file));

	}

}
module.exports.cachedUrl = url => path.join(__dirname, "..", "..", "temp", nsh(url));
module.exports.uncacheUrl = url => fs.existsSync(module.exports.cachedUrl(url)) ? fs.unlinkSync(module.exports.cachedUrl(url)) : "";

module.exports.playFile = async file => {

	return new Promise(resolve => {

		stream = broadcast.playFile(file);

		stream.once("end", () => {

			// stream.removeAllListeners();
		
			setTimeout(() => {

				resolve();

			}, 1000);
			
		});

	});

}

module.exports.playUrl = async url => {

	return new Promise(resolve => {

		stream = broadcast.playFile(module.exports.cachedUrl(url));

		stream.once("end", () => {

			// stream.removeAllListeners();

			console.log(`Deleting "${module.exports.cachedUrl(url)}"...`);
			
			setTimeout(() => {

				module.exports.uncacheUrl(url)
				resolve();

			}, 1000);

		});

	});

}

module.exports.stop = () => {

	if (stream) {
		
		// stream.
		stream.end();
		stream.emit("end");
		stream = undefined;

	}

}

const ylp = path.join(__dirname, "..", "..", "audio", "yl");
const yls = fs.readdirSync(ylp);

/**
 * You're listening...
 */
module.exports.playYl = () => {

	return module.exports.playFile(path.join(ylp, Arrays.random(yls)));

}
