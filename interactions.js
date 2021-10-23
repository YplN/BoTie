const radio = require('./commands/radio');
const phasmo = require('./commands/phasmo');
const RADIO_LIST = require('./radio_data.json');
const PHASMO_DATA = require('./phasmo_data.json');

module.exports = async function (interaction) {
	if (Object.keys(RADIO_LIST).includes(interaction.customId)) {
		await radio.RadioFromInteraction(interaction);
	}
	else if (interaction.customId == 'stop') {
		await radio.RadioFromInteraction(interaction);
		interaction.message.delete();
	}
	else if (Object.keys(PHASMO_DATA['evidences']).includes(interaction.customId)) {
		// console.log(interaction.customId);
		const evidences = phasmo.getEvidencesFromInteraction(interaction);
		phasmo.UpdatePhasmoEvidenceBar(interaction, evidences);
		// phasmo.updateEvidenceFromInteraction(interaction);
	}
	else if (interaction.customId === 'phasmo_reset') {
		phasmo.phasmo(null, interaction);
	}

	else if (interaction.customId === 'phasmo_stop') {
		interaction.message.delete();
	}

};