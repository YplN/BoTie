/* global client */

const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const RADIO_LIST = require('../radio_data');
const { MessageActionRow, MessageButton } = require('discord.js');

// TODO : help, youtube

function joinChannel(channelId, radio_pick, msg) {
	client.channels.fetch(channelId)
		.then(channel => {
			const VoiceConnection = joinVoiceChannel({
				channelId: channel.id,
				guildId: channel.guild.id,
				adapterCreator: channel.guild.voiceAdapterCreator,
			});
			if (radio_pick in RADIO_LIST) {
				const radio = RADIO_LIST[radio_pick];
				const stream = radio.stream;
				console.log(`Playing ${radio.name} on ${stream}`);
				const resource = createAudioResource(stream,
					{
						inlineVolume: true,
						inputType: StreamType.Arbitrary,
					});

				resource.volume.setVolume(0.3);
				const player = createAudioPlayer();
				VoiceConnection.subscribe(player);
				player.play(resource);

				if (msg) {
					msg.reply(`🎶 En cours de lecture : ${radio.name}\n${radio.url}`);
				}

				player.on('idle', () => {
					try {
						player.stop();
						VoiceConnection.destroy();
					}
					catch (e) {
						console.error(e);
					}
					joinChannel(channel.id);
				});
			}
			else if (radio_pick == 'stop' && VoiceConnection) {
				console.log('Stopping radio...');
				VoiceConnection.destroy();
			}
		})
		.catch(console.error);
}


async function CreateButtonsBar(msg, pick = null) {
	let i = 0; // nb of radios in the current row
	let j = 0; // nb of rows
	let n = 0; // nb of radios in total

	const rows = [];
	let row = new MessageActionRow();
	for (const radioKey of Object.keys(RADIO_LIST)) {
		if (i < 5) {
			const radio = RADIO_LIST[radioKey];
			let style = 'SECONDARY';
			let name = radio.name;

			if (pick === radioKey) {
				style = 'SUCCESS';
				name = '▷ ' + radio.name;
			}

			row.addComponents(
				new MessageButton()
					.setCustomId(radioKey)
					.setLabel(name)
					.setStyle(style),
			);

			i++;
			n++;
		}
		// 5 buttons at most per row
		if (i == 5 && j < 5) {
			rows.push(row);
			row = new MessageActionRow();
			i = 0;
			j++;
		}
		// 5 row at most per message
		else if (j >= 5) {
			rows.push(row);
		}
	}


	if (i == 5 && n < 25) {
		row = new MessageActionRow();
	}
	if (n < 25) {
		row.addComponents(
			new MessageButton()
				.setCustomId('stop')
				.setLabel('Stop')
				.setStyle('DANGER'),
		);
		rows.push(row);
	}

	if (!pick) {
		await msg.reply({ content: 'Sélectionne ta radio !', components: rows });
	}
	else {
		msg.update({ content: 'Sélectionne ta radio !', components: rows });
	}
}


module.exports = {
	RadioFromInteraction: async function (interaction) {
		const channelToConnect = interaction.member?.voice.channel;
		if (channelToConnect) {
			const radio_pick = interaction.customId;
			CreateButtonsBar(interaction, radio_pick);
			joinChannel(channelToConnect.id, radio_pick, null);
			await new Promise(res => setTimeout(() => res(2), 500));
			console.log('Connected!');
		}
		else {
			interaction.reply('Il faut d\'abord être dans un chan vocal!');
		}
	},
	radio: async function (key, message) {

		const channelToConnect = message.member?.voice.channel;
		if (channelToConnect) {
			const data = message.content.split(' ');
			if (data.length > 1) {
				const radio_pick = data[1].toLowerCase();
				joinChannel(channelToConnect.id, radio_pick, message);
				await new Promise(res => setTimeout(() => res(2), 500));
				console.log('Connected!');
			}
			else {
				CreateButtonsBar(message, null);
			}
		}
		else {
			message.reply('Il faut d\'abord être dans un chan vocal!');
		}

	},
};
