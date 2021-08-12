const { canModifyQueue, LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require('discord.js')

i18n.setLocale(LOCALE);

const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;

module.exports = {
  name: "remove",
  aliases: ["rm"],
  description: 'Remove song from the queue',
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    let errorNotQueue = new MessageEmbed()
    .setTitle(`${message.author.tag} Remove`)
    .setDescription('Tidak ada musik')
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#FF0000");

    let usageReply = new MessageEmbed()
    .setTitle(`${message.author.tag} Remove`)
    .setDescription(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }))
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#FF0000");

    if (!queue) return message.channel.send(errorNotQueue).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");
    if (!args.length) return message.reply(usageReply);

    const arguments = args.join("");
    const songs = arguments.split(",").map((arg) => parseInt(arg));
    let removed = [];

    if (pattern.test(arguments)) {
      queue.songs = queue.songs.filter((item, index) => {
        if (songs.find((songIndex) => songIndex - 1 === index)) removed.push(item);
        else return true;
      });

      let result = new MessageEmbed()
    .setTitle(`${message.author.tag} Remove`)
    .setDescription(i18n.__mf("remove.result", {
      title: removed.map((song) => song.title).join("\n"),
      author: message.author.id
    }))
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#FF0000");

      queue.textChannel.send(
        result
      );
    } else if (!isNaN(args[0]) && args[0] >= 1 && args[0] <= queue.songs.length) {
      console.log("we got elsed!");
      let result2 = new MessageEmbed()
    .setTitle(`${message.author.tag} Remove`)
    .setDescription(i18n.__mf("remove.result", {
      title: queue.songs.splice(args[0] - 1, 1)[0].title,
      author: message.author.id
    }))
      return queue.textChannel.send(
        result2
      );
    } else {
      console.log("we got the last one");
      let usageReply = new MessageEmbed()
    .setTitle(`${message.author.tag} Remove`)
    .setDescription(i18n.__mf("remove.usageReply", { prefix: message.client.prefix }))
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setColor("#FF0000");
      return message.channel.send(usageReply);
    }
  }
};
