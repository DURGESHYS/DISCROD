//-------------REQUIREMENTS---------------

const Discord = require('discord.js');

const config = '../../botconfig.json';
const colors = require('../../colors.json');
const client = Discord.Client;
const { MessageEmbed } = require('discord.js');
const Color = `RANDOM`;

module.exports = {
	name: 'purge',
	hidden: false,
	description: 'Use This Command To Purge or Clean Message From Channel!',
	usage: 'Purge <amount>',
	category: 'Mod',
	permissions: ['MANAGE_MESSAGES' || 'ADMINISTRATOR'],
	aliases: ['clean', 'clear'],
	timeout: false,
	run: async (client, message, args) => {
		const messembed = new MessageEmbed()
			.setTitle(`\**${message.author.username}\**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(`${Color}`)
			.setFooter(`PURGE`, client.user.displayAvatarURL());
		const amount = parseInt(args) ? parseInt(args[0]) : parseInt(args[1]);
		const user = message.mentions.users.first();
		const fetchMessages = message.channel.messages.fetch({ limit: amount });
		let fetched;
		async function clear() {
			if (user) {
				fetched = (await fetchMessages).filter(m => m.author.id === user.id);
				return message.channel
					.send(
						messembed.setDescription(
							`<a:TICK:816671988964786176>Deleted **${amount}** messages of ${user}.`
						)
					)
					.then(m => {
						m.delete({ timeout: 5000 }).catch(() => undefined);
					});
			} else {
				fetched = await fetchMessages;
				message.channel
					.send(
						messembed.setDescription(
							`<a:TICK:816671988964786176>Deleted **${amount}** messages.`
						)
					)
					.then(m => {
						m.delete({ timeout: 5000 }).catch(() => undefined);
					});
			}
			try {
				await message.channel.bulkDelete(fetched, true);
			} catch (err) {
				return message.channel
					.send(
						messembed.setDescription(
							`<a:ERROR:816671850804543509>Here is an error in executing the command.`
						)
					)

					.then(m => {
						m.delete({ timeout: 5000 }).catch(() => undefined);
					});
			}
		}
		clear();
	}
};
