const { canModifyQueue, LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require("discord.js");

i18n.setLocale(LOCALE);

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: i18n.__("skip.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);

    let result = new MessageEmbed()

        .setTitle(i18n.__mf("skip.embedTitle", { botname: message.author.tag }))
        .setDescription(i18n.__("skip.result"))
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setColor("#FF0000");

        let errorNotQueue = new MessageEmbed()

        .setTitle(i18n.__mf("skip.embedTitle", { botname: message.author.tag }))
        .setDescription(i18n.__("skip.errorNotQueue"))
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setColor("#FF0000");

    if (!queue) return message.reply(errorNotQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    queue.playing = true;
    queue.connection.dispatcher.end();
    //queue.textChannel.send(i18n.__mf("skip.result", { author: message.author })).catch(console.error);
    queue.textChannel.send(result).catch(console.error);
  }
};
