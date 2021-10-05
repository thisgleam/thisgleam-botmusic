const ytdl = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader").default;
const { canModifyQueue, STAY_TIME, LOCALE } = require("../util/Util");
const i18n = require("i18n");
i18n.setLocale(LOCALE);
const { MessageEmbed } = require("discord.js");

module.exports = {
  async play(song, message) {
    const { SOUNDCLOUD_CLIENT_ID } = require("../util/Util");

    let config;

    try {
      config = require("../config.json");
    } catch (error) {
      config = null;
    }

    const PRUNING = config ? config.PRUNING : process.env.PRUNING;

    const queue = message.client.queue.get(message.guild.id);

    let queueEnded = new MessageEmbed()
      .setDescription(i18n.__("play.queueEnded"))
      .setTimestamp()
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000");

      let leaveChannel = new MessageEmbed()
      .setDescription(i18n.__("play.leaveChannel"))
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();

    if (!song) {
      setTimeout(function () {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
        queue.channel.leave();
        queue.textChannel.send(leaveChannel).catch(console.error);
      }, STAY_TIME * 1000);
      return message.client.queue.delete(message.guild.id)
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(
        i18n.__mf("play.queueError", { error: error.message ? error.message : error })
      );
    }

    if (queue.connection._events.disconnect.length < 2) {
      queue.connection.on("disconnect", async () => {
        try {
          if (collector && !collector.ended) await collector.stop();
        } catch (error) {
          console.log(error);
        }
        return await message.client.queue.delete(message.guild.id)
      });
    }
    //queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
    try {
      var video_id = song.url.split('v=')[1];
      var pembatasDan = video_id.indexOf('&');
      if(pembatasDan != -1) {
        video_id = video_id.substring(0, pembatasDan);
      }

      let startedPlaying = new MessageEmbed()
      .setAuthor(`${song.title}`, 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048', `${song.url}`)
      //.setDescription(i18n.__mf("play.startedPlaying", { title: song.title, url: song.url }))
      .setImage(`https://i.ytimg.com/vi/${video_id}/hqdefault.jpg`)
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#00BCFF")
      .setTimestamp();
      var playingMessage = await queue.textChannel.send(
        startedPlaying
        //i18n.__mf("play.startedPlaying", { title: song.title, url: song.url })
      );
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      //await playingMessage.react("🔇");
      //await playingMessage.react("🔉");
      //await playingMessage.react("🔊");
      //await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          let skipSong = new MessageEmbed()
        .setTitle(i18n.__mf("play.skipSong"))
        .setDescription(`${user} Skipped Music`)
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setColor("#FF0000");
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          queue.connection.dispatcher.end();
          queue.textChannel.send(skipSong).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          let pauseSong = new MessageEmbed()
          .setTitle(i18n.__mf("play.pauseSong"))
          .setDescription(`${user} Paused Music`)
          .setTimestamp()
          .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
          .setColor("#FF0000");

          let resumeSong = new MessageEmbed()
          .setTitle(i18n.__mf("play.resumeSong"))
          .setDescription(`${user} Resumed Music`)
          .setTimestamp()
          .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
          .setColor("#00BCFF");
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(pauseSong).catch(console.error);
          } else {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(resumeSong).catch(console.error);
          }
          break;

          /*
        case "🔇":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          if (queue.volume <= 0) {
            queue.volume = 100;
            queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
            queue.textChannel.send(i18n.__mf("play.unmutedSong", { author: user })).catch(console.error);
          } else {
            queue.volume = 0;
            queue.connection.dispatcher.setVolumeLogarithmic(0);
            queue.textChannel.send(i18n.__mf("play.mutedSong", { author: user })).catch(console.error);
          }
          break;

        case "🔉":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 0) return;
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          if (queue.volume - 10 <= 0) queue.volume = 0;
          else queue.volume = queue.volume - 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(i18n.__mf("play.decreasedVolume", { author: user, volume: queue.volume }))
            .catch(console.error);
          break;

        case "🔊":
          reaction.users.remove(user).catch(console.error);
          if (queue.volume == 100) return;
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          if (queue.volume + 10 >= 100) queue.volume = 100;
          else queue.volume = queue.volume + 10;
          queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
          queue.textChannel
            .send(i18n.__mf("play.increasedVolume", { author: user, volume: queue.volume }))
            .catch(console.error);
          break;
          

        case "🔁":
          let loopSong = new MessageEmbed()
        .setAuthor(`${user} Looped Music`)
        .setDescription(i18n.__mf("loop.result", { loop: queue.loop ? i18n.__("common.on") : i18n.__("common.off") }))
        //.setDescription(`${user} Looped Music`)
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setColor("#00BCFF");
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          queue.loop = !queue.loop;
          queue.textChannel
            .send(loopSong)
            .catch(console.error);
          break;
          */

        case "⏹":
        let stopSong = new MessageEmbed()
        .setTitle(i18n.__("play.stopSong"))
        .setDescription(`${user} Stopped Music`)
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setColor("#FF0000");
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return i18n.__("common.errorNotChannel");
          queue.songs = [];
          queue.textChannel.send(stopSong).catch(console.error);
          //queue.textChannel.send(i18n.__mf("play.stopSong", { author: user })).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};
