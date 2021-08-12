const { canModifyQueue, LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require("discord.js");

i18n.setLocale(LOCALE);

module.exports = {
  name: "shuffle",
  description: i18n.__('shuffle.description'),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    let errorNotQueue = new MessageEmbed()
      .setTitle(`${message.author.tag} Shuffle`)
      .setDescription(i18n.__("shuffle.errorNotQueue"))
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();

    if (!queue) return message.channel.send(errorNotQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);

    let result = new MessageEmbed()
      .setTitle(`${message.author.tag} Shuffle`)
      .setDescription(i18n.__("shuffle.result"))
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();

    queue.textChannel.send(result).catch(console.error);
  }
};
