module.exports = {

	safe (string) {

		return string.replace(/\n/g, "\\n");

	},

	percent (value) {
	
		return `${(value * 100).toFixed(2).toString()}%`;

	},

	/**
	 * Divide a string into `length` segments.
	 * 
	 * @param {string} string The target string
	 * @param {number} length The length of every segment
	 * @param {string} last_char Safe last character for division
	 */
	divide (string, length, last_char) {

		let i = 0;
		const max = 1000;

		const segments = [];
		while (string.trim() !== "") {
	
			let segment = string.slice(0, length);

			if (last_char) segment = segment.slice(0, segment.lastIndexOf(last_char));

			segments.push(segment);
			string = string.slice(segment.length);

			i++;

			if (i > max) throw new Error(`Incomplete Slice with remaining: "${string}`);
		
		}

		return segments;

	}

}
