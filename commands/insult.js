const INSULTS = ['Sale mange merde', 'Connard', 'Fils de chien', 'Fausse couche', 'T\'es moche', 'Suce balloches', 'OK Boomer', 'Va bien niquer tes grands morts'];

function InsultCommand(msg) {
	// const data = msg.content.split(' ');
	const data = {};
	let insult = INSULTS[Math.floor(INSULTS.length * Math.random())];
	for (const us of msg.mentions.members.keys()) {
		insult += ` <@${us}>`;
	}

	data.content = insult;
	data.tts = false;

	if (msg.content.split(' ').length > 2 && msg.content.split(' ')[1].toLowerCase() == 'tts') {
		data.tts = true;
	}
	return data;
}

module.exports = function (key, message) {
	message.channel.send(InsultCommand(message))
		.then(() => console.log(`Replied to message "${message.content}"`))
		.catch(console.error);
};