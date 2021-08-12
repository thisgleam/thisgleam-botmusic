const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

const { LOCALE } = require("../util/Util");
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  description: 'Tampilkan musik yang diputar',
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    let errorNotQueue = new MessageEmbed()
      .setTitle(i18n.__mf("nowplaying.embedTitle1", { botname: message.author.tag }))
      .setDescription('Tidak ada musik')
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();
    if (!queue) return message.reply(errorNotQueue).catch(console.error);

    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
      
      var video_id = song.url.split('v=')[1];
      var pembatasDan = video_id.indexOf('&');
      if(pembatasDan != -1) {
        video_id = video_id.substring(0, pembatasDan);
      }

    let nowPlaying = new MessageEmbed()
      .setTitle(i18n.__("nowplaying.embedTitle"))
      .setDescription(`${song.title}\n${song.url}`)
      .setImage(`https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`)
      .setColor("#00BCFF")
      .setTimestamp()
      //.setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setAuthor(message.client.user.username);

      if (song.duration > 0) {
        /*nowPlaying.addField(
          "\u200b",
          new Date(seek * 1000).toISOString().substr(11, 8) +
            "[" +
            createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
            "]" +
            (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
          false
        ); */
      nowPlaying.setFooter(
        i18n.__mf("nowplaying.timeRemaining", { time: new Date(left * 1000).toISOString().substr(11, 8) })
      );
    }

    return message.channel.send(nowPlaying);
  }
};
