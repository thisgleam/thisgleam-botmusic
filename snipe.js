const { MessageEmbed } = require("discord.js");
 
module.exports={
  name: "snipe",
  description: "Snipe Chat",
  execute(message, args){
    const client = message.client
    const msg = client.snipes.get(message.channel.id);
    if(!msg) return message.channel.send({embed: { description: `No messages are deleted on the channel #${message.channel.name}`, color: "RED"}})
  
    const SnipeEmbed = new MessageEmbed()
    .setAuthor(msg.author.tag)
    .setDescription(msg.content)
    .setColor('#00BCFF')
    .setTimestamp()
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
    // .setImage(msg.image);

    if (msg.image) SnipeEmbed.setImage(msg.image)

      return message.channel.send(SnipeEmbed).catch(console.error);
  }
};