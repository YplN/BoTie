const helper = require('./../commands_help.json');


function newField(data) {
	const cmd = data['command'];
	let fields;
	if (data['comments'] != null) {
		fields = [{
			name: `\n\n__Commande "$${cmd}"__`,
			value: `*${data['desc']}*\nRemarque : ${data['comments']}`,
		}];
	}
	else {
		fields = [{
			name: `__Commande "$${cmd}"__`,
			value: `*${data['desc']}*`,
		}];
	}

	for (const args of data['args']) {
		fields.push({
			name: `Argument : "${args['key']}"`,
			value: `${args['doc']}\nExemple : \`${args['example']}\``,
			inline: true,
		});
	}

	return fields;
}

function Preambule(key = null) {
	if (key === null) {
		return {
			color: 0xff0033,
			title: 'Help Botie',
			author: {
				name: 'Botie',
				icon_url: 'https://i.imgur.com/ipp52s0.png',
			},
			description: 'Liste des différentes commandes utilisables avec Botie',
			// thumbnail: {
			// 	url: 'https://i.imgur.com/ipp52s0.png',
			// },
		};
	}
	else if (Object.keys(helper).includes(key.toLowerCase())) {
		const data = helper[key];
		const cmd = data['command'];


		if (data['comments'] != null) {
			return {
				color: 0xff0033,
				title: `Help Botie de la commande $${cmd}`,
				author: {
					name: 'Botie',
					icon_url: 'https://i.imgur.com/ipp52s0.png',
				},
				// description: `${data['desc']}\nRemarque : ${data['comments']}`,
			};
		}
		else {
			return {
				color: 0xff0033,
				title: `Help Botie de la commande $${cmd}`,
				author: {
					name: 'Botie',
					icon_url: 'https://i.imgur.com/ipp52s0.png',
				},
				// description: `${data['desc']}`,
			};
		}
	}
}


function Helper(key) {

	let helperEmbed;
	let fields = [];
	if (key.length > 1) {
		helperEmbed = Preambule(key[1]);
		fields = fields.concat(newField(helper[key[1]]));
	}
	else {
		helperEmbed = Preambule();
		for (const keys of Object.keys(helper)) {
			fields = fields.concat(newField(helper[keys]));
		}
	}


	helperEmbed.fields = fields;

	helperEmbed.image = {
		url: 'https://i.imgur.com/ipp52s0.png',
	};

	helperEmbed.footer = {
		text: 'Image copyright © 2021 Néokro',
	};

	return { embeds: [helperEmbed] };
}

module.exports = async function (key, message) {
	const helperEmbed = Helper(key);
	message.channel.send(helperEmbed)
		.then(() => console.log(`Replied to message "${message.content}"`))
		.catch(console.error);
};