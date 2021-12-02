/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX, LOCALE, MONGODB_URI } = require("./util/Util");
const welcome = require("./commands/welcome");
const leave = require("./commands/leave");
const path = require("path");
const i18n = require("i18n");
const mongoDB = require('mongoose');
const config = require("./config.json");

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

welcome(client);
leave(client)

client.snipes = new Collection();

client.on("messageDelete", message => {
  client.snipes.set(message.channel.id, {
    content: message.content,
    author: message.author,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  });
});

const mainCategory = config.CATEGORYVOICE;
const mainChannel = config.CHANNELVOICE;
const temporaryChannels = new Set();

client.on('voiceStateUpdate', async (oldVoiceState, newVoiceState) => {
    try {
        const {channelID: oldChannelId, channel: oldChannel} = oldVoiceState;
        const {channelID: newChannelId, guild, member} = newVoiceState;

        // Create the temporary channel
        if (newChannelId === mainChannel) {
            // Create the temporary voice channel.
            // Note that you can set the parent of the channel in the
            // createChannel call, without having to set the parent in a
            // separate request to Discord's API.
            const channel = await guild.channels.create(
                `💬 ${member.user.username}`,
                {type: 'voice', parent: mainCategory}
            );
            // message.channel.send(VoiceEmbed).catch(console.error);
            // Add the channel id to the array of temporary channel ids.
            temporaryChannels.add(channel.id);
            // Move the member to the new channel.
            await newVoiceState.setChannel(channel);
            const VoiceEmbed = new MessageEmbed()
            .setColor('#00FF00')
            .setDescription('✅ <@'+ member.user.id + '> has just created a new voice channel (`💬 '+ member.user.username +'`)')
            .setAuthor(member.user.username, member.user.avatarURL())
            .setTimestamp()
            client.channels.cache.get('859646271571361802').send(VoiceEmbed);
        }

        // Remove empty temporary channels
        if (
            // Is the channel empty? (thanks to Rakshith B S for pointing this out)
            !oldChannel.members.size &&
            // Did the user come from a temporary channel?
            temporaryChannels.has(oldChannelId) &&
            // Did the user change channels or leave the temporary channel?
            oldChannelId !== newChannelId
        ) {
            // Delete the channel
            await oldChannel.delete();
            // Remove the channel id from the temporary channels set
            temporaryChannels.delete(oldChannelId);
            const VoiceDelete = new MessageEmbed()
            .setColor('#FF0000')
            .setDescription('❌ Voice channel (`💬 '+ oldChannelId +'`) got deleted.')
            .setAuthor(member.user.username, member.user.avatarURL())
            .setTimestamp()
            client.channels.cache.get('859646271571361802').send(VoiceDelete);
        }
    } catch (error) {
        // Handle any errors
        console.error(error);
    }
});



client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

i18n.configure({
  locales: ["ar", "de", "en", "es", "fr", "it", "ko", "nl", "pl", "pt_br", "ru", "sv", "tr", "zh_cn", "zh_tw"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  objectNotation: true,
  register: global,

  logWarnFn: function (msg) {
    console.log("warn", msg);
  },

  logErrorFn: function (msg) {
    console.log("error", msg);
  },

  missingKeyFn: function (locale, value) {
    return value;
  },

  mustacheConfig: {
    tags: ["{{", "}}"],
    disable: false
  }
});

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
  //client.user.setActivity(`Sedang Maintenance`, { type: "PLAYING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**

*/
const status = [
   `${PREFIX}help and ${PREFIX}play`,
   'Created By: thisgleam#1214',
 ];
 setInterval(() => {
   client.user.setActivity(status[Math.floor(Math.random() * status.length)], { type : 'WATCHING' });
 }, 10000);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommend")).catch(console.error);
  }
});
