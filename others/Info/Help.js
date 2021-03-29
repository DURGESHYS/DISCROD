const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const db = require('quick.db');
const config = require('../../botconfig.json');
const default_prefix = config.DEFAULT_PREFIX;
const roleColor = `RANDOM`;

module.exports = {
	name: 'help',
	description: 'Use This Command To Get Command info!',
	usage: `Help <Command Name>`,
	category: 'Info',
	permissions: false,
	aliases: ['h'],
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
		//        const roleColor =
		//      message.guild.me.displayHexColor === "#000000"
		//        ? "#ffffff"
		//        : message.guild.me.displayHexColor;

		if (!args[0]) {
			let categories = [];
			//    categories emojies
			const emocat = {};
			//    hidden categories
			const hidcat = [];
			readdirSync('./commands/').forEach(dir => {
				if (hidcat.includes(dir)) return;
				const ename = `${emocat[dir]} ${dir.toUpperCase()}`;
				const commands = readdirSync(`./commands/${dir}/`).filter(file =>
					file.endsWith('.js')
				);

				const cmds = commands
					.filter(command => {
						let file = require(`../../commands/${dir}/${command}`);
						return !file.hidden;
					})
					.map(command => {
						let file = require(`../../commands/${dir}/${command}`);

						if (!file.name) return 'No command name.';

						let name = file.name.replace('.js', '');

						return `\`${name}\``;
					});

				let data = new Object();

				data = {
					name: ename,
					value: cmds.length === 0 ? 'In progress.' : cmds.join(' ')
				};

				categories.push(data);
			});
			let prefix = db.get(`prefix_${message.guild.id}`);
			if (prefix === null) {
				prefix = default_prefix;
			}
			const embed = new MessageEmbed()
				.setTitle('🏖️ Need help? Here are all of my commands!')
				.addFields(categories)
				.setDescription(
					`Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help prefix\`.`
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor(roleColor);
			return message.author.send(embed).then(m => {
				m.delete({ timeout: 120000 });
			});
		} else {
			const command =
				client.commands.get(args[0].toLowerCase()) ||
				client.commands.find(
					c => c.aliases && c.aliases.includes(args[0].toLowerCase())
				);

			if (!command) {
				let prefix = db.get(`prefix_${message.guild.id}`);
				if (prefix === null) {
					prefix = default_prefix;
				}
				const embed = new MessageEmbed()
					.setTitle(
						`<a:ERROR:816671850804543509>Invalid command! Use \`${prefix}help\` for all of my commands!`
					)
					.setColor('FF0000');
				return message.author.send(embed).then(m => {
					m.delete({ timeout: 120000 });
				});
			}
			let prefix = db.get(`prefix_${message.guild.id}`);
			if (prefix === null) {
				prefix = default_prefix;
			}
			const embed = new MessageEmbed()
				.setTitle('Command Details:')
				.addField('PREFIX:', `\`${prefix}\``)
				.addField(
					'COMMAND:',
					command.name ? `\`${command.name}\`` : 'No name for this command.'
				)
				.addField(
					'PERMISSIONS:',

					command.permissions
						? `\`${command.permissions.join('`, `')}\``
						: 'No Permissions for this command.'
				)
				.addField(
					'ALIASES:',
					command.aliases
						? `\`${command.aliases.join('`, `')}\``
						: 'No aliases for this command.'
				)
				.addField(
					'USAGE:',
					command.usage
						? `\`${prefix} ${command.usage}\``
						: `\`${prefix}${command.name}\``
				)
				.addField(
					'DESCRIPTION:',
					command.description
						? command.description
						: 'No description for this command.'
				)
				.setFooter(
					`Requested by ${message.author.tag}`,
					message.author.displayAvatarURL({ dynamic: true })
				)
				.setTimestamp()
				.setColor(roleColor);
			return message.author.send(embed).then(m => {
				m.delete({ timeout: 120000 });
			});
		}
	}
};
