const { canModifyQueue, LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require("discord.js");

i18n.setLocale(LOCALE);

module.exports = {
  name: "pause",
  description: 'Jeda musik',
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    let errorNotQueue = new MessageEmbed()
      .setTitle(i18n.__mf("pause.embedTitle", { botname: message.author.tag }))
      .setDescription('Tidak ada musik')
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();
    if (!queue) return message.reply(errorNotQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      let result = new MessageEmbed()
      .setTitle(i18n.__mf("pause.embedTitle", { botname: message.author.tag }))
      .setDescription('⏸ Paused the music.')
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();
      return queue.textChannel
        .send(result)
        .catch(console.error);
    }
  }
};
