const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({
	disableEveryone: true
});
const colors = require('./colors.json');

const Color = `RANDOM`;
//------------REQUIRE FROM BOTCONFIGFILE--------
const config = require('./botconfig.json');
//------------END------------//
///////////////////////////////
const nitrosymbl = config.BOTNITROSYMBOL;
client.setMaxListeners(0);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync('./commands/');
client.queue = new Map();

['command', 'event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

//=============NITRO START===============

client.on('message', async message => {
	const server = message.guild;
	if (message.author.bot || message.channel.type === 'dm') return;
	let substringArray = get_substrings_between(
		message.content,
		nitrosymbl,
		nitrosymbl
	);
	let msg = message.content;
	if (!substringArray.length) return;

	substringArray.forEach(m => {
		let emoji = client.emojis.cache.find(x => x.name === m);
		var replace = `${nitrosymbl}${m}${nitrosymbl}`;
		var rexreplace = new RegExp(replace, 'g');

		if (
			emoji &&
			!msg.split(' ').find(x => x === emoji.toString()) &&
			!msg.includes(`<a${replace}${emoji.id}>`)
		)
			msg = msg.replace(rexreplace, emoji.toString());
	});

	if (msg === message.content) return;

	//======MEMBER PERMISSION FOR NITRO=======
	const MemberNitroPermission = ['USE_EXTERNAL_EMOJIS'];
	if (MemberNitroPermission.length) {
		let NitroInvalidPer = [];
		for (const NitroPerm of MemberNitroPermission) {
			if (!MemberNitroPermission.includes(NitroPerm)) {
				return console.log(`Invalid Permissions ${NitroInvalidPer}`);
			}
			if (!message.member.hasPermission(NitroPerm)) {
				NitroInvalidPer.push(NitroPerm);
			}
		}
		if (NitroInvalidPer.length) {
			if (
				message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
			) {
				message.delete().catch(console.error);
			}
			const MNitroPermEmbed = new MessageEmbed()
				.setTitle(`\**${message.author.username}\**`)
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(`${Color}`)
				.setDescription(
					`<a:ERROR:816671850804543509>REQUIRE PERMISSIONS FOR NITRO USE: \**${NitroInvalidPer}\** <a:NOPERMISSION:816664072858763284>`
				)
				.setFooter(`NITROPERMISSION`, client.user.displayAvatarURL());
			return message.author.send(MNitroPermEmbed).then(m => {
				m.delete({ timeout: 120000 });
			});
		}
	}
	//========MEMBER NITRO PERMISSION END=============

	//=========BOT NITRO PERMISSIONS STARTS=========
	const NitroPermission = ['ADMINISTRATOR'];
	//=========BOT NITRO PERMISSIONS========
	if (NitroPermission.length) {
		let NitroInvalidPer = [];
		for (const NitroPerm of NitroPermission) {
			if (!NitroPermission.includes(NitroPerm)) {
				return console.log(`Invalid Permissions ${NitroInvalidPer}`);
			}
			if (!message.guild.me.hasPermission(NitroPerm)) {
				NitroInvalidPer.push(NitroPerm);
			}
		}
		if (NitroInvalidPer.length) {
			if (
				message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
			) {
				message.delete().catch(console.error);
			}
			const NitroPermEmbed = new MessageEmbed()
				.setTitle(`\**${message.author.username}\**`)
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(`${Color}`)
				.setDescription(
					`<a:ERROR:816671850804543509>REQUIRE BOT PERMISSIONS FOR NITRO USE: \**${NitroInvalidPer}\** <a:NOPERMISSION:816664072858763284>`
				)
				.setFooter(`NITROPERMISSION`, client.user.displayAvatarURL());
			return message.author.send(NitroPermEmbed).then(m => {
				m.delete({ timeout: 120000 });
			});
		}
	}
	//======NITRO PERMISSION END======

	let webhook = await message.channel.fetchWebhooks();
	webhook = webhook.find(x => x.name === 'OFFICIAL');

	if (!webhook) {
		webhook = await message.channel.createWebhook(`OFFICIAL`, {
			avatar: client.user.displayAvatarURL({ dynamic: true })
		});
	}

	await webhook.edit({
		name: message.member.nickname
			? message.member.nickname
			: message.author.username,
		avatar: message.author.displayAvatarURL({ dynamic: true })
	});

	message.delete().catch(m => {});

	webhook.send(msg).catch(m => {});

	await webhook.edit({
		name: `OFFICIAL`,
		avatar: client.user.displayAvatarURL({ dynamic: true })
	});
});

//=============NITRO END===============
//=============NO MORE LINK============
client.on('message', async message => {
	if (
		message.author.bot ||
		message.channel.type === 'dm' ||
		!message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
	)
		return;

	if (
		!message.member.hasPermission(
			'ADMINISTRATOR' || 'MANAGE_GUILD' || 'EMBED_LINKS'
		)
	) {
		if (is_url(message.content) === true) {
			if (
				message.guild.me.hasPermission('MANAGE_MESSAGES' || 'ADMINISTRATOR')
			) {
				message.delete().catch(console.error);
			}
			const NoPermEmbed = new MessageEmbed()
				.setTitle(`\**${message.author.username}\**`)
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(`${Color}`)
				.setDescription(
					`<a:ERROR:816671850804543509> You Were Tring To Send Links In \**${
						message.guild.name
					}\** Server! <a:NO:818833698421342238>`
				)
				.setFooter(`NOLINKS`, client.user.displayAvatarURL());
			return message.author.send(NoPermEmbed).then(m => {
				m.delete({ timeout: 120000 });
			});
		}
	}
});
//==========NO END LINK=================
//----------------BOT LOGIN TOKEN-----------------

client.login(process.env.TOKEN);

//=============NITRO FUNCTION START=================

function get_substrings_between(str, startDelimiter, endDelimiter) {
	var contents = [];
	var startDelimiterLength = startDelimiter.length;
	var endDelimiterLength = endDelimiter.length;
	var startFrom = (contentStart = contentEnd = 0);

	while (false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
		contentStart += startDelimiterLength;
		contentEnd = strpos(str, endDelimiter, contentStart);
		if (false === contentEnd) {
			break;
		}
		contents.push(str.substr(contentStart, contentEnd - contentStart));
		startFrom = contentEnd + endDelimiterLength;
	}

	return contents;
}

function strpos(haystack, needle, offset) {
	var i = (haystack + '').indexOf(needle, offset || 0);
	return i === -1 ? false : i;
}
//===========NITRO FUNCTION END============

//==========FUNCTION============
function is_url(str) {
	let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
	if (regexp.test(str)) {
		return true;
	} else {
		return false;
	}
}
//============NO LINK FUNCTION END===========
