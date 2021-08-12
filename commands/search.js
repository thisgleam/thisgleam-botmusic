const { MessageEmbed } = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const { YOUTUBE_API_KEY, LOCALE } = require("../util/Util");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const i18n = require("i18n");

i18n.setLocale(LOCALE);

module.exports = {
  name: "search",
  description: i18n.__("search.description"),
  async execute(message, args) {

    let usageReply = new MessageEmbed()
      .setDescription(i18n.__mf("search.usageReply", { prefix: message.client.prefix, name: module.exports.name }))
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();

    if (!args.length)
      return message
        .reply(usageReply)
        .catch(console.error);
    if (message.channel.activeCollector) return message.reply(i18n.__("search.errorAlreadyCollector"));

    let errorNotChannel = new MessageEmbed()
      .setDescription(i18n.__mf("search.errorNotChannel"))
      .setColor("#FF0000")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();

    if (!message.member.voice.channel)
      return message.reply(errorNotChannel).catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(i18n.__("search.resultEmbedTtile"))
      .setDescription(i18n.__mf("search.resultEmbedDesc", { search: search }))
      .setColor("#00BCFF")
      .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
      .setTimestamp();

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      let resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/;
        return pattern.test(msg.content);
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const reply = response.first().content;

      if (reply.includes(",")) {
        let songs = reply.split(",").map((str) => str.trim());

        for (let song of songs) {
          await message.client.commands
            .get("play")
            .execute(message, [resultsEmbed.fields[parseInt(song) - 1].name]);
        }
      } else {
        const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
        message.client.commands.get("play").execute(message, [choice]);
      }

      message.channel.activeCollector = false;
      resultsMessage.delete().catch(console.error);
      response.first().delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
      message.reply(error.message).catch(console.error);
    }
  }
};
