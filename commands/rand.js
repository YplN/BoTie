function RandomCommand(data) {
	let max = 101;
	if (data.length == 2) {
		const parsed = Number.parseInt(data[1]);
		if (!Number.isNaN(parsed)) {
			max = parsed + 1;
		}
	}
	return `Nombre aléatoire (0 - ${max - 1}) : ${Math.floor(max * Math.random())}`;
}


module.exports = function (key, message) {
	message.reply(RandomCommand(key))
		.then(() => console.log(`Replied to message "${message.content}"`))
		.catch(console.error);
};