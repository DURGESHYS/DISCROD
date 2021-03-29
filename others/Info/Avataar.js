//-------------REQUIREMENTS---------------

const Discord = require('discord.js');

const config = '../../botconfig.json';

const colors = require('../../colors.json');

const client = Discord.Client;

const { MessageEmbed } = require('discord.js');

const Color = `RANDOM`;

module.exports = {
	name: 'avataar',

	description: 'Use This Command To Get Server Members Avataar!',

	usage: `Avataar <@user>`,

	category: 'Info',

	permissions: false,

	aliases: ['pfp', 'icon', 'profilepic'],

	timeout: false,

	run: async (client, message, args) => {
		const proemb = new MessageEmbed()

			.setColor(`${Color}`)

			.setFooter(`AVTAAR`, client.user.displayAvatarURL());

		if (!message.mentions.users.size) {
			return message.author.send(
				proemb
					.setTitle(`\**${message.author.username}\**`)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(
						`**DOWNLOAD:** [CLICK HERE](${message.author.displayAvatarURL({
							size: 2048,
							dynamic: true
						})})`
					)
			);
		}

		if (message.mentions.users.size > 10) {
			return message.author.send(
				proemb
					.setTitle(`\**${message.author.username}\**`)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(
						`<a:ERROR:816671850804543509> Please Mention Only 10 Users!`
					)
			);
		}

		const avatar_list = message.mentions.users.map(user => {
			return `**${user.username}** [CLICK HERE](${user.displayAvatarURL({
				size: 2048,
				dynamic: true
			})})`;
		});

		message.author.send(proemb.setDescription(avatar_list));
	}
};
