const { MessageActionRow, MessageButton } = require('discord.js');
const PHASMO_DATA = require('../phasmo_data.json');

const UNTOUCHED = 'PRIMARY';
const OPTIN = 'SUCCESS';
const OPTOUT = 'DANGER';
const DISABLED = 'SECONDARY';


function getGhostsFromEvidence(evidences) {
	const ghosts = JSON.parse(JSON.stringify(PHASMO_DATA['ghosts']));

	for (const e of evidences) {
		for (const g of Object.keys(PHASMO_DATA['ghosts'])) {
			if (e.positive && !PHASMO_DATA['ghosts'][g]['evidence'].includes(e.name)) {
				delete ghosts[g];
			}
			if (!e.positive && PHASMO_DATA['ghosts'][g]['evidence'].includes(e.name)) {
				delete ghosts[g];
			}
		}
	}
	return ghosts;
}

function getAvailableEvidences(ghosts) {
	let evidence = [];
	for (const g of Object.keys(ghosts)) {
		// console.log(ghosts[g]['evidence']);
		evidence = [...new Set([...evidence, ...ghosts[g]['evidence']])];
	}
	// console.log(evidence);
	return evidence;
}


function getContentFromGhosts(ghosts) {
	let contentFULL = '';
	let contentMID = '';
	let contentSHORT = '';

	for (const g of Object.keys(ghosts)) {
		contentFULL += `**__${ghosts[g]['name'].toUpperCase()}__**\n`;
		contentMID += `**__${ghosts[g]['name'].toUpperCase()}__**\n`;
		contentSHORT += `**__${ghosts[g]['name'].toUpperCase()}__**\n`;

		for (const e of ghosts[g]['evidence']) {
			contentFULL += `\t- ${e}\n`;
			contentMID += `\t- ${e}\n`;
		}

		contentFULL += `**+ Force** : *${ghosts[g]['strength']}*\n**- Faiblesse** : *${ghosts[g]['weakness']}*\n\n`;
		contentMID += '\n';
	}
	contentFULL += '\n**Récoltez les indices !**';
	contentMID += '\n**Récoltez les indices !**';
	contentSHORT += '\n**Récoltez les indices !**';

	if (contentFULL.length > 2000 && contentMID > 2000) {
		return contentSHORT;
	}
	else if (contentFULL.length > 2000) {
		return contentMID;
	}
	return contentFULL;
}

async function CreatePhasmoEvidenceBar(msg, reset) {
	let i = 0; // nb of radios in the current row
	let j = 0; // nb of rows

	const rows = [];
	let row = new MessageActionRow();
	for (const evidence of Object.keys(PHASMO_DATA['evidences'])) {
		if (i < 4) {
			row.addComponents(
				new MessageButton()
					.setCustomId(evidence)
					.setLabel(PHASMO_DATA['evidences'][evidence]['emoji'] + ' ' + evidence)
					.setStyle(UNTOUCHED),
			);

			i++;
		}
		// 5 buttons at most per row
		if (i == 4 && j < 5) {
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

	rows.push(row);
	row = new MessageActionRow();
	row.addComponents(
		new MessageButton()
			.setCustomId('phasmo_reset')
			.setLabel('Reinitialiser')
			.setStyle('DANGER'),
	);
	row.addComponents(
		new MessageButton()
			.setCustomId('phasmo_stop')
			.setLabel('Stop')
			.setStyle('DANGER'),
	);
	rows.push(row);

	if (reset == null) {
		await msg.update({
			content: getContentFromGhosts(getGhostsFromEvidence([])).substr(0, 2000), components: rows,
		});
	}
	else {
		await msg.reply({
			content: getContentFromGhosts(getGhostsFromEvidence([])).substr(0, 2000), components: rows,
		});
	}

}

module.exports = {
	phasmo: async function (reset, message) {
		await CreatePhasmoEvidenceBar(message, reset);
	},

	// updateEvidenceFromInteraction: async function (interaction) {
	// 	// console.log(interaction.message.components[0].components);
	// },
	getEvidencesFromInteraction: function (interaction) {
		const evidences = [];
		const pick = interaction.customId;

		for (const rows of interaction.message.components) {
			// console.log(rows);
			for (const button of rows.components) {
				if (button.customId != pick) {
					if (button.style === OPTIN) {
						evidences.push({ name: button.customId, positive: true });
					}
					else if (button.style === OPTOUT && button.customId != 'phasmo_reset') {
						evidences.push({ name: button.customId, positive: false });
					}
				}
				else {
					// eslint-disable-next-line no-lonely-if
					if (button.style === OPTIN) {
						evidences.push({ name: button.customId, positive: false });
					}
					else if (button.style === UNTOUCHED) {
						evidences.push({ name: button.customId, positive: true });
					}
				}
			}
		}
		// console.log(evidences);
		return evidences;
	},
	UpdatePhasmoEvidenceBar: async function (msg, evidences) {
		let i = 0; // nb of radios in the current row
		let j = 0; // nb of rows

		const availableEvidences = getAvailableEvidences(getGhostsFromEvidence(evidences));

		const rows = [];
		let row = new MessageActionRow();
		for (const evidence of Object.keys(PHASMO_DATA['evidences'])) {
			if (i < 4) {
				let disable = false;
				let style = UNTOUCHED;
				let optout = false;
				for (const e of evidences) {
					if (e.name === evidence) {
						if (e.positive === true) {
							style = OPTIN;
							break;
						}
						else {
							style = OPTOUT;
							optout = true;
							break;
						}
					}
				}
				if (!availableEvidences.includes(evidence) && !optout) {
					style = DISABLED;
					disable = true;
				}

				row.addComponents(
					new MessageButton()
						.setCustomId(evidence)
						.setLabel(PHASMO_DATA['evidences'][evidence]['emoji'] + ' ' + evidence)
						.setStyle(style)
						.setDisabled(disable),
				);

				i++;
			}
			// 5 buttons at most per row
			if (i == 4 && j < 5) {
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

		rows.push(row);
		row = new MessageActionRow();
		row.addComponents(
			new MessageButton()
				.setCustomId('phasmo_reset')
				.setLabel('Reinitialiser')
				.setStyle('DANGER'),
		);
		row.addComponents(
			new MessageButton()
				.setCustomId('phasmo_stop')
				.setLabel('Stop')
				.setStyle('DANGER'),
		);
		rows.push(row);

		// console.log('JUSTE', evidences);
		await msg.update({ content: getContentFromGhosts(getGhostsFromEvidence(evidences)).substr(0, 2000), components: rows });
	},
};