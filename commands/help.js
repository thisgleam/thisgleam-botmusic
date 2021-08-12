const { MessageEmbed } = require("discord.js");
const { LOCALE } = require("../util/Util");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "help",
  aliases: ["h"],
  description: 'List semua command dan fungsinya',
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle(i18n.__mf("help.embedTitle", { botname: message.author.tag }))
      .setDescription('List semua command')
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#00BCFF");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed).catch(console.error);
  }
};
