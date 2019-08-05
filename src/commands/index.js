const fs = require("fs");
// const path = require("path");
const Discord = require("discord.js");

function typeize (value) {

	if (value === "true") return true;
	if (value === "false") return false;
	if (/^[+-]?\d+(\.\d+)?$/.test(value)) return parseFloat(value);
	return value;

}

const commands = fs.readdirSync(__dirname).map(_ => {const __ = {}; __[_.replace(".js", "")] = require(`./${_}`); return __;}).filter(_ => Object.keys(_)[0] !== "index").reduce((_, __) => {return {..._, ...__}});

module.exports = {

	/**
	 * 
	 * @param {Discord.Message} message 
	 */
	parse (message) {

		if (message.content.startsWith(process.env.PREFIX)) {

			const args = message.content.trim().replace(process.env.PREFIX, "").split(" ");
			const command = args.shift();

			let hold = "";
			let state = "";
			const processed_args = [];

			for (const arg of args.filter(_ => !!_)) {

				if ((arg.startsWith("\"") || arg.startsWith("\"")) && !arg.endsWith("\"") && !arg.endsWith("\"")) {

					hold += arg.slice(1) + " ";
					state = "lstring";

					continue;

				}

				if (state === "lstring") {

					hold += arg + " ";
					
					if (arg.endsWith("\"") || arg.endsWith("\"")) {

						processed_args.push(typeize(hold.slice(0, hold.length - 2).trim()));

						hold = "";
						state = "";

					}

					continue;

				}

				processed_args.push(typeize(arg));

			}

			if (commands[command]) {

				return commands[command].run(message, processed_args);
				
			} else {

				return message.channel.send(`> **${command}** is not a valid command, sorry about that.`);

			}

		}

	}

}
