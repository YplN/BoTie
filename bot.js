/* eslint-disable space-before-blocks */
// Require the necessary discord.js classes
const {
	Client,
	Intents,
} = require('discord.js');
const {
	token,
} = require('./config.json');
const {
	Player,
} = require('discord-music-player');

const commandHandler = require('./commands');

const interactionHandler = require('./interactions');

/* TODO
	- youtube
*/

// const settings = {
// 	prefix: '$',
// };

// Create a new client instance
const client = new Client({
	shards: 'auto',
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});


const player = new Player(client, {
	leaveOnEmpty: false, // This options are optional.
});

// You can define the Player as *client.player* to easly access it.
client.player = player;


client.once('ready', () => {
	console.log('🤖 ❤');
	console.log(`Logged in as ${client.user.tag}! (id: ${client.user.id})`);
	// console.log('Ready', client);
});


client.on('messageCreate', commandHandler);


client.on('interactionCreate', interactionHandler);


client.on('voiceStateUpdate', async (oldState, newState) => {
	if (newState.channelId && newState.channel.type === 'GUILD_STAGE_VOICE' && newState.guild.me.voice.suppress) {
		try {
			await newState.guild.me.voice.setSuppressed(false);
		} catch (e) {
			console.error(e);
		}
	}
});


client.login(token);


global.client = client;


// client.on('interactionCreate', async interaction => {
// 	if (!interaction.isCommand()) return;

// 	const { commandName } = interaction;


// 	if (commandName === 'ping') {
// 		await interaction.reply('Pong!');
// 	}
// 	else if (commandName === 'server') {
// 		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
// 	}
// 	else if (commandName === 'user') {
// 		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
// 	}


// });


// const job = new CronJob(
// 	'01 04 01,17 * * *',
// 	function() {
// 		console.log('You will see this message every second');
// 	},
// 	null,
// 	true,
// );
// job.start();