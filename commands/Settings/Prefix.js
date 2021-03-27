const Discord = require('discord.js');
const db = require('quick.db');
const config = '../../botconfig.json';
const default_prefix = config.DEFAULT_PREFIX;
const colors = require('../../colors.json');
const client = Discord.Client;
const { MessageEmbed } = require('discord.js');
const Color = `RANDOM`;
module.exports = {
	name: 'prefix',
	description: 'Use This Command To Change Guild Prefix!',
	usage: `Prefix <New Prefix>`,
	category: 'Settings',
	permissions: ['MANAGE_GUILD' || 'ADMINISTRATOR'],
	aliases: ['setprefix'],
	timeout: 10000,
	run: async (client, message, args) => {
		const prefixembed = new MessageEmbed()
			.setTitle(`\**${message.author.username}\**`)
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(`${Color}`)
			.setFooter(`PREFIX`, client.user.displayAvatarURL());
		const noPrefix = prefixembed.setDescription(
			` <a:ERROR:816671850804543509> Please Give The Prefix That You Want To Set!`
		);
		if (!args[0]) {
			return message.author.send(noPrefix).then(m => {
				m.delete({ timeout: 30000 });
			});
		}
		if (args[1]) {
			const doublePrefix = prefixembed.setDescription(
				` <a:ERROR:816671850804543509> You Cannot Set Prefix More Than 1 Argument!`
			);
			return message.author.send(doublePrefix).then(m => {
				m.delete({ timeout: 30000 });
			});
		}
		if (args[0].length > 3) {
			const nomorech = prefixembed.setDescription(
				` <a:ERROR:816671850804543509> You Cannot Set Prefix More Than 3 Characters!`
			);
			return message.author.send(nomorech).then(m => {
				m.delete({ timeout: 30000 });
			});
		}
		if (args[0] === db.get(`prefix_${message.guild.id}`) || default_prefix) {
			const nosamePrefix = prefixembed.setDescription(
				` <a:ERROR:816671850804543509> You Cannot Set Current Prefix As New Prefix!`
			);
			return message.author.send(nosamePrefix).then(m => {
				m.delete({ timeout: 30000 });
			});
		}
		db.delete(`prefix_${message.guild.id}`);
		db.set(`prefix_${message.guild.id}`, args[0]);
		const sucPreset = prefixembed.setDescription(`<a:SUCCESSFULL:818750047318573066> Sucessfully Set To New Prefix
<a:ARROW:816671896259133451> Now Your Prefix Is \**${args[0]}\**`);
		await message.author.send(sucPreset).then(m => {
			m.delete({ timeout: 30000 });
		});
	}
};
