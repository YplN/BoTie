function isMention(s) {
	const regex = /<@.(\d{17,19})>/g;
	return regex.test(s);
}


module.exports = function extractMentionsData(data) {
	const keys = [];
	const mentions = [];

	for (const s of data) {
		if (!isMention(s)) {
			keys.push(s);
		}
		else {
			mentions.push(s);
		}
	}

	return { keyword:keys, mentions:mentions };
};