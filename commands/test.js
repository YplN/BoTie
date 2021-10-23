const { MessageActionRow, MessageButton } = require('discord.js');
const RADIO_LIST = require('./../radio_data');

module.exports = async function (key, msg) {
	let i = 0;
	let j = 0;
	const rows = [];
	let row = new MessageActionRow();
	for (const radioKey of Object.keys(RADIO_LIST)) {
		if (i < 5) {
			const radio = RADIO_LIST[radioKey];
			row.addComponents(
				new MessageButton()
					.setCustomId(radioKey)
					.setLabel(radio.name)
					.setStyle('PRIMARY'),
			);
			i++;
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
	await msg.reply({ content: 'Sélectionne ta radio !', components: rows });
};
