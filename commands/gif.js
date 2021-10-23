const extractMentionsData = require('./../utils');
const { token } = require('./../config.json');
const fetch = require('node-fetch');

async function GifCommand(msg) {
	const data = msg.content.split(' ').slice(1);
	let gif = '';
	let keyword = '';
	let mentions = '';

	// const regex = /<@.(\d{17,19})>/g;
	// for (let s of data) {
	// 	console.log(s);
	// 	if (!regex.test(s)) {
	// 		keyword.push(s);
	// 	}
	// 	else {
	// 		mentions += s + ' ';
	// 	}
	// }

	const extractedData = extractMentionsData(data);

	if (extractedData.keyword.length >= 1) {
		keyword = extractedData.keyword.toString().replaceAll(',', '%20');
		mentions = extractedData.mentions.toString().replaceAll(',', ' ');
		console.log(keyword, mentions);
	}
	else {
		keyword = 'dog%20love';
		mentions = '';
		gif = 'Requiert un ou plusieurs mot clef(s) pour la recherche, par exemple `$gif chien love`.\nMais comme tu es gentil, voilà un petit gif pour toi ❤ !\n';
	}

	const url = `https://g.tenor.com/v1/search?q=${keyword}&key=${token.tenorToken}&limit=15`;
	const response = await fetch(url);
	const json = await response.json();
	gif += json.results[Math.floor(json.results.length * Math.random())].url;
	return mentions + '\n' + gif;


}

module.exports = async function (key, message) {
	const gif = await GifCommand(message);
	message.channel.send(gif)
		.then(() => console.log(`Replied to message "${message.content}"`))
		.catch(console.error);
};