const Discord = require('discord.js');

const { MessageEmbed } = require('discord.js');
const mainguild = process.env.MAINGUILD;
module.exports = {
	name: 'embed',

	description: 'Use This Command To Create Embeds!',

	usage: `Embed <#Channel> <Your Title> <Colour> (hex code or a basic color in all caps) <Your Description>`,

	category: 'Mod',

	permissions: ['EMBED_LINKS' || 'MANAGE_GUILD' || 'ADMINISTRATOR'],

	aliases: ['mesemb', 'emb'],

	timeout: false,

	run: async (client, message, args) => {
		if (!message.guild.me.hasPermission('ADMINISTRATOR')) {
			const NitroPermEmbed = new MessageEmbed()

				.setTitle(`\**${message.author.username}\**`)

				.setThumbnail(message.author.displayAvatarURL())

				.setColor(`RANDOM`)

				.setDescription(
					`<a:ERROR:816671850804543509>REQUIRE START PERMISSIONS: **ADMINISTRATOR** <a:NOPERMISSION:816664072858763284>`
				)

				.setFooter(`STARTPERMISSION`, client.user.displayAvatarURL());

			return message.author.send(NitroPermEmbed).then(m => {
				m.delete({ timeout: 120000 });
			});
		}
		let title = args[1]; // args[0] is the first word or number after the command name

		let color = args[2];

		let description = args.slice(3).join(' '); // args.slice(2).join(" ") means we're taking all the arguments including and after the second argument. An argument is just a word or number.

		const error = new MessageEmbed()

			.setTitle(`\**${message.author.username}\**`)

			.setThumbnail(message.author.displayAvatarURL())

			.setColor(`RANDOM`)

			.setFooter(`EMBED`, client.user.displayAvatarURL());

		const channel = message.mentions.channels.first();

		if (!channel) {
			let tit = args[0];

			let colour = args[1];

			let descriptionnc = args.slice(2).join(' ');

			if (!tit)
				return message.author
					.send(
						error.setDescription(`<a:ERROR:816671850804543509>Title Required`)
					)
					.then(m => {
						m.delete({ timeout: 120000 });
					});

			if (!colour)
				return message.author
					.send(
						error.setDescription(`<a:ERROR:816671850804543509>Colour Required`)
					)
					.then(m => {
						m.delete({ timeout: 120000 });
					});

			if (!descriptionnc)
				return message.author
					.send(
						error.setDescription(
							`<a:ERROR:816671850804543509>Description Required`
						)
					)
					.then(m => {
						m.delete({ timeout: 120000 });
					});

			const embednc = new MessageEmbed()

				.setTitle(`**${tit}**`)

				.setColor(colour)

				.setDescription(descriptionnc)

				.setFooter(`Created By ${message.author.username}`);

			return message.channel.send(embednc);
		}

		if (!title)
			return message.author
				.send(
					error.setDescription(`<a:ERROR:816671850804543509>Title Required`)
				)
				.then(m => {
					m.delete({ timeout: 120000 });
				});

		if (!color)
			return message.author
				.send(
					error.setDescription(`<a:ERROR:816671850804543509>Colour Required`)
				)
				.then(m => {
					m.delete({ timeout: 120000 });
				});

		if (!description)
			return message.author
				.send(
					error.setDescription(
						`<a:ERROR:816671850804543509>Description Required`
					)
				)
				.then(m => {
					m.delete({ timeout: 120000 });
				});

		const embed = new MessageEmbed()

			.setTitle(`**${title}**`)

			.setColor(color)

			.setDescription(description)

			.setFooter(`Created By ${message.author.username}`);

		channel.send(embed);
	}
};
