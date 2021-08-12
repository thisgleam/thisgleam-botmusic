const { canModifyQueue, LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require('discord.js')

i18n.setLocale(LOCALE);

module.exports = {
  name: "loop",
  aliases: ["l"],
  description: "Nyalakan loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    let errorNotQueue = new MessageEmbed()
    .setTitle(i18n.__mf("loop.embedTitle", { botname: message.author.tag }))
    .setDescription('Tidak ada musik')
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#FF0000");

    if (!queue) return message.reply(errorNotQueue).catch(console.error);

    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    let result = new MessageEmbed()
    .setTitle(i18n.__mf("loop.embedTitle", { botname: message.author.tag }))
    .setDescription(i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }))
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#00BCFF");
    return queue.textChannel
      .send(result)
      .catch(console.error);
  }
};
