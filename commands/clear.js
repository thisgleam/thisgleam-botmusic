const { MessageEmbed } = require("discord.js");
const { LOCALE } = require("../util/Util");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
	name: 'clear',
	aliases: ["c"],
	description: 'Hapus pesan hingga 999 pesan',
	execute(message, args) {

		let clearerror = new MessageEmbed()
		.setTitle(i18n.__mf("clear.embedTitle", { botname: message.author.tag }))
		.setDescription('hayo ngapain wkwkw')
		.setTimestamp()
		.setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
		.setColor("#FF0000");

		if(!message.member.hasPermission(
			'ADMINISTRATOR')) return message.channel.send(clearerror);
		const amount = parseInt(args[0]) + 1;
		
		if (isNaN(amount)) {

		let tidakvalid = new MessageEmbed()
		.setTitle(i18n.__mf("clear.embedTitle", { botname: message.author.tag }))
		.setTimestamp()
		.setDescription('Nomor tidak valid')
		.setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
		.setColor("#FF0000");

		return message.channel.send(tidakvalid);
		
		} else if (amount <= 1 || amount > 100) {
			
		let masukinnomor = new MessageEmbed()
		.setTitle(i18n.__mf("clear.embedTitle", { botname: message.author.tag }))
		.setTimestamp()
		.setDescription('Masukan Nomor 1 sampai 99')
		.setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
		.setColor("#FF0000");

		return message.channel.send(masukinnomor);
		}

		let errorclear = new MessageEmbed()
		.setTitle(i18n.__mf("clear.embedTitle", { botname: message.author.tag }))
		.setDescription('error nih bos')
		.setTimestamp()
		.setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
		.setColor("#FF0000")

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			return message.channel.send(errorclear);
		});
	},
};