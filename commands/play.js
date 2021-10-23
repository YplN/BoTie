/* global client */
const {
	RepeatMode,
} = require('discord-music-player');


module.exports = async function (key, message) {
	// let queue = client.player.createQueue(message.guild.id);
	// await queue.join(message.member.voice.channel);
	// let song = await queue.play(key.join(' ')).catch(_ => {
	// 	if (!guildQueue) {
	// 		queue.stop();
	// 	}
	// });

	const args = message.content.slice(1).trim().split(/ +/g);
	const command = args.shift();
	let guildQueue = client.player.getQueue(message.guild.id);

	if (command === 'play') {
		let queue = client.player.createQueue(message.guild.id);
		await queue.join(message.member.voice.channel);
		let song = await queue.play(args.join(' ')).catch(_ => {
			if (!guildQueue) {
				queue.stop();
			}
		});
	}

	if (command === 'playlist') {
		let queue = client.player.createQueue(message.guild.id);
		await queue.join(message.member.voice.channel);
		let song = await queue.playlist(args.join(' ')).catch(_ => {
			if (!guildQueue) {
				queue.stop();
			}
		});
	}

	if (command === 'skip') {
		guildQueue.skip();
	}

	if (command === 'stop') {
		guildQueue.stop();
	}

	if (command === 'removeLoop') {
		guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
	}

	if (command === 'toggleLoop') {
		guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
	}

	if (command === 'toggleQueueLoop') {
		guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
	}

	if (command === 'setVolume') {
		guildQueue.setVolume(parseInt(args[0]));
	}

	if (command === 'seek') {
		guildQueue.seek(parseInt(args[0]) * 1000);
	}

	if (command === 'clearQueue') {
		guildQueue.clearQueue();
	}

	if (command === 'shuffle') {
		guildQueue.shuffle();
	}

	if (command === 'getQueue') {
		console.log(guildQueue);
	}

	if (command === 'getVolume') {
		console.log(guildQueue.volume);
	}

	if (command === 'nowPlaying') {
		console.log(`Now playing: ${guildQueue.nowPlaying}`);
	}

	if (command === 'pause') {
		guildQueue.setPaused(true);
	}

	if (command === 'resume') {
		guildQueue.setPaused(false);
	}

	if (command === 'remove') {
		guildQueue.remove(parseInt(args[0]));
	}

	if (command === 'createProgressBar') {
		const ProgressBar = guildQueue.createProgressBar();

		// [======>              ][00:35/2:20]
		console.log(ProgressBar.prettier);
	}
};