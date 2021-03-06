const { play } = require("../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const scdl = require("soundcloud-downloader").default
const https = require("https");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID, LOCALE, DEFAULT_VOLUME, SPOTIFY_CLIENT_ID, SPOTIFY_SECRET_ID } = require("../util/Util");
const spotifyURI = require('spotify-uri');
const Spotify = require('node-spotify-api');
const i18n = require("i18n");
const { MessageEmbed } = require("discord.js");

const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const spotify = new Spotify({
  id: SPOTIFY_CLIENT_ID,
  secret: SPOTIFY_SECRET_ID
});

i18n.setLocale(LOCALE);

module.exports = {
  name: "play",
  cooldown: 1,
  aliases: ["p"],
  description: 'Mainkan musik dari Youtube, Soundcloud dan Spotify',
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    let errorNotChannel = new MessageEmbed()
      .setTitle(`${message.author.tag} Play`)
      .setDescription('Kamu harus berada di Voice Channel')
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();
    if (!channel) return message.reply(errorNotChannel).catch(console.error);
    let errorNotInSameChannel = new MessageEmbed()
      .setTitle(`${message.author.tag} Play`)
      .setDescription(i18n.__mf("play.errorNotInSameChannel", { user: message.client.user }))
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message
        .reply(errorNotInSameChannel)
        .catch(console.error);

      let playError = new MessageEmbed()
      .setTitle(`${message.author.tag} Play`)
      .setDescription(i18n.__mf("play.usageReply", { prefix: message.client.prefix }))
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#FF0000")
      .setTimestamp();

    if (!args.length)
    return message.channel.send(playError).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT")) return message.reply(i18n.__("play.missingPermissionConnect"));
    if (!permissions.has("SPEAK")) return message.reply(i18n.__("play.missingPermissionSpeak"));

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
    const spotifyPattern = /^.*(https:\/\/open\.spotify\.com\/track)([^#\&\?]*).*/gi;
    const spotifyValid = spotifyPattern.test(args[0]);
    const spotifyPlaylistPattern = /^.*(https:\/\/open\.spotify\.com\/playlist)([^#\&\?]*).*/gi;
    const spotifyPlaylistValid = spotifyPlaylistPattern.test(args[0])
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (scdl.isValidUrl(url) && url.includes("/sets/")) {
      return message.client.commands.get("playlist").execute(message, args);
    } else if (spotifyPlaylistValid) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    if (mobileScRegex.test(url)) {
      try {
        https.get(url, function (res) {
          if (res.statusCode == "302") {
            return message.client.commands.get("play").execute(message, [res.headers.location]);
          } else {
            return message.reply("No content could be found at that url.").catch(console.error);
          }
        });
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
      return message.reply("Following url redirection...").catch(console.error);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: DEFAULT_VOLUME || 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (spotifyValid) {
      let spotifyTitle, spotifyArtist;
      const spotifyTrackID = spotifyURI.parse(url).id
      const spotifyInfo = await spotify.request(`https://api.spotify.com/v1/tracks/${spotifyTrackID}`).catch(err => {
        return message.channel.send(`Oops... \n` + err)
      })
      spotifyTitle = spotifyInfo.name
      spotifyArtist = spotifyInfo.artists[0].name

      try {
        const final = await youtube.searchVideos(`${spotifyTitle} - ${spotifyArtist}`, 1, { part: 'snippet' });
        songInfo = await ytdl.getInfo(final[0].url)
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        }
      } catch (err) {
        console.log(err)
        return message.channel.send(`Oops.. There was an error! \n ` + err)
      }

    } else if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: Math.ceil(trackInfo.duration / 1000)
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1, { part: "snippet" });
        // PATCH 1 : avoid cases when there are nothing on the search results.
        if (results.length <= 0) {
          // No video results.
          message.reply(i18n.__mf("play.songNotFound")).catch(console.error);
          return;
        }
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      let queueAdded = new MessageEmbed()
      .setTitle(`${song.title}`)
	    .setURL(`${song.url}`)
      // .setAuthor(`${song.title}`, message.client.user.displayAvatarURL(), `${song.url}`)
      // .setTitle(`${message.author.tag} Play`)
      .setDescription(i18n.__mf("play.queueAdded", { title: song.title, author: message.author }))
      .setFooter(`Added by ${message.author.tag}`, message.author.displayAvatarURL())
      // .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setColor("#00BCFF")
      .setTimestamp();
      return serverQueue.textChannel
        .send(queueAdded)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      await queueConstruct.connection.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(error);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(i18n.__('play.cantJoinChannel', {error: error})).catch(console.error);
    }
  }
};
