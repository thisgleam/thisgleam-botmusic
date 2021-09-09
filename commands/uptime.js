const { LOCALE } = require("../util/Util");
const { MessageEmbed } = require("discord.js");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "uptime",
  aliases: ["u"],
  description: i18n.__('uptime.description'),
  execute(message) {
    let seconds = Math.floor(message.client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    let uptimeEmbed = new MessageEmbed()
    .setTitle(`${message.author.tag} Uptime`)
    .setURL(`https://stats.uptimerobot.com/rqOqLir0G4`)
    // .setDescription(`**Uptime**: ${days} day(s), ${hours} hours, ${minutes} minutes, ${seconds} seconds`)
    // .setDescription(`**Uptime**: ${days} days, ${hours} hours`)
    .setDescription('**Uptime**: `' + days + ' days ' + hours  + ' hours`')
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setTimestamp()
    .setColor("#00BCFF");

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    return message
      // .reply(i18n.__mf('uptime.result', {days: days, hours: hours, minutes: minutes, seconds: seconds}))
      .reply(uptimeEmbed)
      .catch(console.error);
  }
};
