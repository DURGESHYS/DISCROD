//-------------REQUIREMENTS---------------
const Discord = require('discord.js');
const config = '../../botconfig.json';
const colors = require('../../colors.json');
const client = Discord.Client;
const { parse } = require('twemoji-parser');
const { MessageEmbed } = require('discord.js');
const Color = `RANDOM`;

module.exports = {
	name: 'addemoji',
	description: 'Use This Command To Add Emoji In Your Server!',
	usage: `Addmoji <Your Emoji> <Add As Emoji New Name>`,
	category: 'Manage Server',
	permissions: ['MANAGE_EMOJIS' || 'ADMINISTRATOR'],
	aliases: ['emojiadd'],
	timeout: 10000,
	guildOnly: true,
	run: async (client, message, args) => {
		const server = message.guild;
		const emoji = args[0];
		//      const regex = emote.replace(/^<a?:\w+:(\d+)>$/, '$1');
		//-------------EMBED FUNCTION-----------
		const emojisembed = new MessageEmbed()
			.setTitle(`\**${message.author.username}\**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(`${Color}`)
			.setFooter(`ADDEMOJI`, client.user.displayAvatarURL());
		const noemojiadd = emojisembed.setDescription(
			` <a:ERROR:816671850804543509> Please Give Me A Emoji To Add!`
		);
		if (!emoji)
			return message.author.send(noemojiadd).then(m => {
				m.delete({ timeout: 30000 });
			});
		if (emoji.startsWith(':'))
			return message.author
				.send(
					emojisembed.setDescription(
						`<a:ERROR:816671850804543509>Please Give Me A Valid Emoji To Add!`
					)
				)
				.then(m => {
					m.delete({ timeout: 30000 });
				});
		if (emoji.endsWith(':'))
			return message.author
				.send(
					emojisembed.setDescription(
						`<a:ERROR:816671850804543509>Please Give Me A Valid Emoji To Add!`
					)
				)
				.then(m => {
					m.delete({ timeout: 30000 });
				});

		let customemoji = Discord.Util.parseEmoji(emoji);

		if (customemoji.id) {
			const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
				customemoji.animated ? 'gif' : 'png'
			}`;
			const name = args.slice(1).join(' ');
			if (name.includes(':'))
				return message.author
					.send(
						emojisembed.setDescription(
							`<a:ERROR:816671850804543509>Please Give Me A Valid EmojiName To Add!`
						)
					)
					.then(m => {
						m.delete({ timeout: 30000 });
					});
			message.guild.emojis
				.create(`${Link}`, `${name || `${customemoji.name}`}`)
				.catch(error => {
					console.log(error);
				});
			const Added = new MessageEmbed()
				.setTitle(`\**${message.author.username}\**`)
				.setThumbnail(`${Link}`)
				.setColor(`${Color}`)
				.setDescription(
					`<a:TICK:816671988964786176>**Emoji Has Been Added \`${
						server.name
					}\` Server! **
<a:ARROW:816671896259133451>**NAME:** **\`${name || `${customemoji.name}`}\`**
<a:ARROW:816671896259133451>**DOWNLOAD:** [CLICK HERE](${Link})`
				)
				.setFooter(`ADDEMOJI`, client.user.displayAvatarURL());
			return message.author.send(Added).then(m => {
				m.delete({ timeout: 86400000 });
			});
		} else {
			let CheckEmoji = parse(emoji, {
				assetType: 'png'
			});
			if (!CheckEmoji[0])
				return message.author
					.send(
						emojisembed.setDescription(
							`<a:ERROR:816671850804543509>Please Give Me A Valid Emoji To Add!`
						)
					)
					.then(m => {
						m.delete({ timeout: 30000 });
					});
			message.author
				.send(
					emojisembed.setDescription(
						`<a:ERROR:816671850804543509>You Can't Add This Type of Emojies!`
					)
				)
				.then(m => {
					m.delete({ timeout: 30000 });
				});
		}
	}
};
