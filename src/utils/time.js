module.exports = {

	format: seconds => `${(Math.floor(seconds / 60) + "").padStart(2, "0")}:${("" + Math.round(seconds % 60)).padStart(2, "0")}`

}
