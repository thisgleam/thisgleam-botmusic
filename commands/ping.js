const { MessageEmbed } = require("discord.js");
const { LOCALE } = require("../util/Util");

const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports={
  name:'ping',
  description: "Cek Ping",
  execute(message, args){
    let pingEmbed = new MessageEmbed()
      .setTitle(`${message.author.tag} Ping`)
      .setDescription(`🏓Ping: ${Date.now() - message.createdTimestamp}ms`)
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#00BCFF");

      return message.channel.send(pingEmbed).catch(console.error);
  }
};