const config = require("../config.json");
const Canvas = require("canvas");
const Discord = require("discord.js");

module.exports = function (client) {
    //fires every time when someone joins the server
    client.on("guildMemberAdd", async member => {
      // //If not in a guild return
      // if(!member.guild) return;
      //create a new Canvas
      const canvas = Canvas.createCanvas(1772, 633);
      //make it "2D"
      const ctx = canvas.getContext('2d');
      //set the Background to the welcome.png
      const background = await Canvas.loadImage(`./welcome.png`);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#f2f2f2';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      //set the first text string 
      var textString3 = `${member.user.username}`;
      //if the text is too big then smaller the text
      if (textString3.length >= 12) {
        ctx.font = 'bold 125px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2.1 + 20);
      }
      //else dont do it
      else {
        ctx.font = 'bold 150px Genta';
        ctx.fillStyle = '#f2f2f2';
        ctx.fillText(textString3, 720, canvas.height / 2 + 20);
      }
      //define the Discriminator Tag
      var textString2 = `#${member.user.discriminator}`;
      ctx.font = 'bold 40px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString2, 730, canvas.height / 2 + 58);
      //define the Member count
      var textString4 = `Member #${member.guild.memberCount}`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 750, canvas.height / 2 + 125);
      //get the Guild Name
      var textString4 = `Welcome to the server`;
      ctx.font = 'bold 60px Genta';
      ctx.fillStyle = '#f2f2f2';
      ctx.fillText(textString4, 700, canvas.height / 2 - 150);
      //create a circular "mask"
      ctx.beginPath();
      ctx.arc(315, canvas.height / 2, 250, 0, Math.PI * 2, true);//position of img
      ctx.closePath();
      ctx.clip();
      //define the user avatar
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
      //draw the avatar
      ctx.drawImage(avatar, 65, canvas.height / 2 - 250, 500, 500);
      //get it as a discord attachment
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
      //define the welcome embed
      const welcomeembed = new Discord.MessageEmbed()
        .setColor("#00BCFF")
        .setTimestamp()
        .setFooter('Design : thisgleam', 'https://cdn.discordapp.com/avatars/849261647859417118/bc4c4ddf312dd058c1d2e5bd826f69b4.png?size=2048')
        .setDescription(`Hey <@${member.id}>, welcome to **${member.guild.name}**!

        <a:welcome1:770105054065328148><a:welcome2:770105140144635934>
    
        •••••••|Information|••••••••
        <a:blobchain:751069096321351681><a:blobchain:751069096321351681><a:blobchain:751069096321351681> 
        lihat rules and roles nya dulu <:PepeRotKing:751064180886470777> di ${member.guild.channels.cache.find(ch => ch.name === '📜rules-and-roles')}
        <a:blobchain:751069096321351681><a:blobchain:751069096321351681><a:blobchain:751069096321351681> 
    
        •••••••|Information|••••••••
        <a:kNezuko:751070691176218684><a:kNezuko:751070691176218684><a:kNezuko:751070691176218684>
        Tempat Game-game gratis diupload <:Phappypeepo:751064390517915648>
        <a:kNezuko:751070691176218684><a:kNezuko:751070691176218684><a:kNezuko:751070691176218684>
    
        Enjoy The Server <a:Pepeapudancer:751068867467542600> `)
        .setImage("attachment://welcome-image.png")
        .attachFiles(attachment);
      //define the welcome channel
      const channel = member.guild.channels.cache.find(ch => ch.id === config.CHANNEL_WELCOME);
      //send the welcome embed to there
      channel.send(welcomeembed);
      //member roles add on welcome every single role
      let roles = config.ROLES_WELCOME;
      for(let i = 0; i < roles.length; i++ )
      member.roles.add(roles[i]);
    })
}