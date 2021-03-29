const Discord = require('discord.js');
const Timeout = new Set();
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const config = require('../../botconfig.json');
const colors = require('../../colors.json');

const ms = require('ms');
const client = Discord.Client;
const default_prefix = config.DEFAULT_PREFIX;
const owner = process.env.BOTOWNER;
const Color = config.DEFAULT_COLOUR;
const erroremo = config.ERROREMOJI;
const sucessemo = config.SUCESSEMOJI;

module.exports = async (bot, message) => {
	if (message.author.bot || message.channel.type === 'dm') return;
	let prefix = db.get(`prefix_${message.guild.id}`);
	if (prefix === null) {
		prefix = default_prefix;
	}
	let colour = db.get(`colour_${message.guild.id}`);

	if (colour === null) {
		colour = Color;
	}
	let erroremoji = db.get(`erroremoji_${message.guild.id}`);
	if (erroremoji === null) {
		erroremoji = erroremo;
	}
	let sucessemoji = db.get(`sucessemoji_${message.guild.id}`);

	if (sucessemoji === null) {
		sucessemoji = sucessemo;
	}
	let member = message.guild.member(message.author);
	let nickname = member ? member.displayName : message.author.username;

	if (message.content === `<@${bot.user.id}>`) {
		if (message.guild.me.hasPermission('MANAGE_MESSAGES')) {
			message.delete().catch(console.error);
		}
		return message.author
			.send(
				new Discord.MessageEmbed()
					.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
					.setColor(`${Color}`)
					.setDescription(`My Prefix Is \**${prefix}\**`)
					.setTitle(`\**${message.author.username}\**`)
					.setFooter(`MYPREFIX`, bot.user.displayAvatarURL())
			)
			.then(m => {
				m.delete({ timeout: 45000 });
			});
	}
	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const prefixRegex = new RegExp(
		`^(<@!?${bot.user.id}>|${escapeRegex(prefix)})\\s*`
	);

	if (!prefixRegex.test(message.content)) return;

	const [, matchedPrefix] = message.content.match(prefixRegex);
	const server = message.guild;
	const args = message.content
		.slice(matchedPrefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	const command =
		bot.commands.get(cmd) ||
		bot.commands.find(a => a.aliases && a.aliases.includes(cmd));

	//    If cooldowns map doesn't have a command.name key then create one.
	if (command) {
		if (command.timeout) {
			// Permission handler start from here
			const validPermissions = [
				'CREATE_INSTANT_INVITE',
				'KICK_MEMBERS',
				'BAN_MEMBERS',
				'ADMINISTRATOR',
				'MANAGE_CHANNELS',
				'MANAGE_GUILD',
				'ADD_REACTIONS',
				'VIEW_AUDIT_LOG',
				'PRIORITY_SPEAKER',
				'STREAM',
				'VIEW_CHANNEL',
				'SEND_MESSAGES',
				'SEND_TTS_MESSAGES',
				'MANAGE_MESSAGES',
				'EMBED_LINKS',
				'ATTACH_FILES',
				'READ_MESSAGE_HISTORY',
				'MENTION_EVERYONE',
				'USE_EXTERNAL_EMOJIS',
				'VIEW_GUILD_INSIGHTS',
				'CONNECT',
				'SPEAK',
				'MUTE_MEMBERS',
				'DEAFEN_MEMBERS',
				'MOVE_MEMBERS',
				'USE_VAD',
				'CHANGE_NICKNAME',
				'MANAGE_NICKNAMES',
				'MANAGE_ROLES',
				'MANAGE_WEBHOOKS',
				'MANAGE_EMOJIS'
			];
			//--------------------BOT MEMBER PERMISSION START---------------------

			if (command.permissions.length) {
				let invalidPerms = [];
				for (const perm of command.permissions) {
					if (!validPermissions.includes(perm)) {
						return console.log(`Invalid Permissions ${perm}`);
					}
					if (!message.member.hasPermission(perm)) {
						invalidPerms.push(perm);
					}
				}
				if (invalidPerms.length) {
					if (
						message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
					) {
						message.delete().catch(console.error);
					}
					const embedpeeed = new MessageEmbed()
						.setTitle(`\**${message.author.username}\**`)
						.setThumbnail(message.author.displayAvatarURL())
						.setColor(`${Color}`)
						.setDescription(
							`<a:ERROR:816671850804543509>REQUIRE PERMISSIONS: \**${invalidPerms}\** <a:NOPERMISSION:816664072858763284>`
						)
						.setFooter(`PERMISSION`, bot.user.displayAvatarURL());
					return message.author.send(embedpeeed).then(m => {
						m.delete({ timeout: 120000 });
					});
				}
			}

			//------------BOT STARTS PERMISSION-----------
			const botstartpermision = ['ADMINISTRATOR'];
			if (botstartpermision.length) {
				let invalidPerms = [];
				for (const perm of botstartpermision) {
					if (!botstartpermision.includes(perm)) {
						return console.log(`Invalid Permissions ${perm}`);
					}
					if (!message.guild.me.hasPermission(perm)) {
						invalidPerms.push(perm);
					}
				}
				if (invalidPerms.length) {
					if (
						message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
					) {
						message.delete().catch(console.error);
					}
					const embedpeed = new MessageEmbed()
						.setTitle(`\**${message.author.username}\**`)
						.setThumbnail(message.author.displayAvatarURL())
						.setColor(`${Color}`)
						.setDescription(
							`<a:ERROR:816671850804543509>REQUIRE START PERMISSIONS: \**${invalidPerms}\** <a:NOPERMISSION:816664072858763284>`
						)
						.setFooter(`STARTPERMISSION`, bot.user.displayAvatarURL());
					return message.author.send(embedpeed).then(m => {
						m.delete({ timeout: 120000 });
					});
				}
			}
			//-----------------BOT MEMBER PERMISSION END--------------

			//Permission handler end here
			//Cooldown start here
			if (Timeout.has(`${message.author.id}${command.name}`)) {
				if (
					message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
				) {
					message.delete().catch(console.error);
				}
				const embedtime = new MessageEmbed()
					.setColor(`${Color}`)
					.setTitle(`\**${message.author.username}\**`)
					.setThumbnail(message.author.displayAvatarURL())
					.setDescription(
						`<a:ERROR:816671850804543509>You can only use this command every **${ms(
							command.timeout
						)}!** <a:COOLDOWN:816664555575967764>`
					)
					.setFooter(`COOLDOWN`, bot.user.displayAvatarURL());
				return message.author.send(embedtime).then(m => {
					m.delete({ timeout: 120000 });
				});
			} else {
				if (
					message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
				) {
					message.delete().catch(console.error);
				}
				command.run(
					bot,
					message,
					args,
					prefix,
					colour,
					erroremoji,
					sucessemoji,
					nickname,
					command
				);
				Timeout.add(`${message.author.id}${command.name}`);
				setTimeout(() => {
					Timeout.delete(`${message.author.id}${command.name}`);
				}, command.timeout);
			}
		} else {
			if (
				message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
			) {
				message.delete().catch(console.error);
			}
			command.run(
				bot,
				message,
				args,
				prefix,
				colour,
				sucessemoji,
				erroremoji,
				nickname,
				command
			);
		}
	}
};
