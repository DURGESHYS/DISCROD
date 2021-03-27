//-------------REQUIREMENTS---------------
const Discord = require('discord.js');
const config = '../../botconfig.json';
const colors = require('../../colors.json');
const client = Discord.Client;
const emojify = require('discord-emoji-convert');
// npm install discord-emoji-convert
const { MessageEmbed } = require('discord.js');
const Color = `RANDOM`;

module.exports = {
	name: 'emojify',
	description: 'Use This Command To Show Text Emojies!',
	usage: `Emojify <Your Text>`,
	category: 'Fun',
	permissions: false,
	aliases: ['textemoji'],
	timeout: 60000,
	run: async (client, message, args) => {
		const server = message.guild;
		const arg = message.content
			.split(' ')
			.slice(1)
			.join(' ');
		const emojifyembed = new MessageEmbed()
			.setTitle(`\**${message.author.username}\**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(`${Color}`)
			.setFooter(`EMOJIFY`, client.user.displayAvatarURL());
		if (!arg)
			return message.author
				.send(
					emojifyembed.setDescription(
						` <a:ERROR:816671850804543509> Please Give Me Text For Emojify`
					)
				)
				.then(m => {
					m.delete({ timeout: 120000 });
				});
		let emojiefer = emojify.convert(arg);
		message.channel
			.send(emojifyembed.setDescription(`❥ ${emojiefer}`))
			.catch(console.error);
	}
};
