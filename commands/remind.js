/* global client */

const REMINDER_MEMBERS = [];

// const client = require('./../bot');

const CronJob = require('cron').CronJob;
const job = new CronJob(
	'* * * * * *',
	function () {
		// eslint-disable-next-line prefer-const
		for (let user of REMINDER_MEMBERS) {
			client.users.cache.get(user).send('Hey')
				.then(() => console.log(`Reminder sent to ${user}`))
				.catch(console.error);
		}
	},
	null,
	true,
);
job.start();

// const cron = require('cron');

// function test() {
// 	console.log('Action executed.');
// }


// const job1 = new cron.CronJob('01 55 01,16 * * *', test);
// // fires every day, at 01:05:01 and 13:05:01

function RemindCommand(msg) {
	const data = msg.content.split(' ');
	let print = 'Erreur avec la syntaxe.';

	if (data.length >= 2) {
		const idx = REMINDER_MEMBERS.indexOf(msg.author.id);
		if (data[1] === 'add' && idx == -1) {
			REMINDER_MEMBERS.push(msg.author.id);
			print = `Ajouté à la liste : ${msg.author.username}.`;
		}
		else if (data[1] === 'remove' && idx != -1) {
			REMINDER_MEMBERS.splice(idx);
			print = `Retiré de la liste : ${msg.author.username}.`;
		}
	}
	return print;
}

module.exports = function (key, message) {
	console.log('export', client);
	message.reply(RemindCommand(message))
		.then(() => console.log(`Replied to message "${message.content}"`))
		.catch(console.error);
};