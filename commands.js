const PREFIX = '$';
const COMMANDS = ['rand', 'insult', 'remind', 'gif', 'radio', 'help', 'phasmo', 'play', 'test '];
const PLAY_COMMANDS = ['play', 'skip', 'removeLoop', 'toggleLoop', 'toggleQueueLoop', 'setVolume', 'seek', 'clearQueue', 'nowPlaying', 'shuffle', 'getQueue', 'getVolume', 'pause', 'resume', 'remove', 'createProgressBar'];

const rand = require('./commands/rand');
const insult = require('./commands/insult');
const remind = require('./commands/remind');
const gif = require('./commands/gif');
const help = require('./commands/help');
const {
	radio,
} = require('./commands/radio');
const {
	phasmo,
} = require('./commands/phasmo');
const play = require('./commands/play');
const test = require('./commands/test');

const commands = {
	rand,
	insult,
	remind,
	gif,
	radio,
	help,
	phasmo,
	play,
	test,
};

module.exports = async function (message) {
	if (message.author.id != '888784501084409866') {
		if (message.content.startsWith(PREFIX)) {
			const command = message.content.substring(1);
			const key = command.split(' ');
			console.log(key);

			if (PLAY_COMMANDS.includes(key[0])) {
				play(null, message);
			} else if (COMMANDS.includes(key[0])) {
				commands[key[0]](key, message);
			}
			// if (key[0] === RANDOM_COMMAND) {
			// }
			// else if (key[0] === INSULT_COMMAND) {
			// 	commands[key[0]](key, message);
			// }
			// else if (key[0] === REMINDER_COMMAND) {
			// 	commands[key[0]](key, message);
			// }
			// else if (key[0] === GIF_COMMAND) {
			// 	commands[key[0]](key, message);
			// }
			// else if (key[0] === RADIO_COMMAND) {
			// 	commands[key[0]](key, message);
			// }
			else {
				message.reply('Commande inconnue, oups!')
					.then(() => console.log(`Replied to message "${message.content}"`))
					.catch(console.error);
			}
		}
	}
};