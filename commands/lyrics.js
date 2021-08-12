const { MessageEmbed } = require("discord.js");
const genius = require('genius-lyrics-api');
const { GENIUS_TOKEN } = require('../util/Util')
const { LOCALE } = require("../util/Util");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "lyrics",
  aliases: ["ly"],
  description: 'Dapatkan lirik',
  async execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    let errorNotQueue = new MessageEmbed()
      .setTitle(i18n.__mf("lyrics.embedtitle1", { botname: message.author.tag }))
      .setDescription('Tidak ada musik')
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();
    if (!queue) return message.channel.send(errorNotQueue).catch(console.error);

    let lyrics = null;

    const title = queue.songs[0].title;

    const options = {
      apiKey: GENIUS_TOKEN,
      title: title,
      artist: "",
      optimizeQuery: true
    };

    try {
      lyrics = await genius.getLyrics(options);
      if (!lyrics) lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    } catch (error) {
      lyrics = i18n.__mf("lyrics.lyricsNotFound", { title: title });
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(i18n.__mf("lyrics.embedTitle", { title: title }))
      .setDescription(lyrics)
      .setColor("#00BCFF")
      .setFooter(`Requested by ${message.author.tag}`, 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();

    if (lyricsEmbed.description.length >= 4096)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 4093)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error);
  }
};
