const { LOCALE } = require("../util/Util");
const i18n = require("i18n");
const { MessageEmbed } = require('discord.js')

i18n.setLocale(LOCALE);

module.exports = {
  name: "invite",
  aliases: ["i"],
  description: "Invite Link",
  execute(message) {
    const invite = new MessageEmbed()
    .setColor("#00BCFF")
    .setTitle('LINK INVITE')
    //.setImage('https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
    .setURL(`https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&permissions=70282305&scope=bot`)
    .setTimestamp()
    .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048');
    return message.member
      .send(invite)
      .catch(console.error);
  }
};
