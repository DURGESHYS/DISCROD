//-------------REQUIREMENTS---------------
const db = require('quick.db');
const Discord = require('discord.js');
const config = require('./../../botconfig.json');
const client = Discord.Client;
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'embed',
	hidden: false,
	description: '',
	usage: '',
	category: 'Mod',
	permissions: ['MANAGE_MESSAGES' || 'EMBED_LINKS' || 'ADMINISTRATOR'],
	aliases: [''],
	timeout: false,
	run: async (client, message, args, prefix, colour, erroremoji, sucessemoji, nickname, command) => {

	  const commandname = command.name.toUpperCase();
		const messembed = new MessageEmbed()
			.setTitle(`\**${nickname}\**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(`${colour}`)
			.setFooter(
				`${commandname}┊${client.user.username}`,
				client.user.displayAvatarURL()
			);
		if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
			const PermEmbed = new MessageEmbed()
				.setTitle(`\**${message.author.username}\**`)
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(`${colour}`)
				.setDescription(
					`<a:ERROR:${erroremoji}> REQUIRE START PERMISSIONS: **ADMINISTRATOR**`
				)
				.setFooter(
					`STARTPERMISSION┊${client.user.username}`,
					client.user.displayAvatarURL()
				);
			return message.author.send(PermEmbed).then(m => {
				m.delete({ timeout: 60000 }).catch(() => undefined);
			});
		}
		if (args[0] === 'title') {
			let title = args.slice(1).join(' ');
			if (!title) {
				return message.channel
					.send(
						messembed.setDescription(
							`<a:ERROR:${erroremoji}>┊Title Required:\nUsage: \` ${prefix}Embed title <your title>\`\nTitle Limit: 256 characters.`
						)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if (title.length >= 257) {
				return message.channel
					.send(
						messembed.setDescription(
							`<a:ERROR:${erroremoji}>┊Max Limit of Title 256`
						)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
			if(title.length <=256){
			  message.channel.send(
						messembed.setDescription(
							`<a:SUCESS:${sucessemoji}>┊Title sucessfully set.\n<a:ARROW|>┊**${title}**`
						)
					)
					.then(m => {
						m.delete({ timeout: 60000 }).catch(() => undefined);
					});
			}
		}
	}
};
