const { MessageEmbed } = require("discord.js");

module.exports={
  name: "avatar",
  aliases: ["a"],
  description: "Get Avatar/Profile Picture",
  execute(message){
    const target = message.mentions.members.first() || message.guild.members.cache.get(arguments[0]) || message.member;
    const AvatarEmbed = new MessageEmbed()
      .setColor('#00BCFF')
	  .setTitle('Direct Link')
	  .setURL(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }))
      .setAuthor(target.user.tag)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
      .setImage(target.user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));

      return message.channel.send(AvatarEmbed).catch(console.error);
  }
};