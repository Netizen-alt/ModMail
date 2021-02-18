const discord = require("discord.js");
const client = new discord.Client()
const { token, prefix, ServerID } = require("./config.json")
setTimeout
client.on("ready", () => {
console.log("I am ready to receive and Send Mails✔️")

//Developed by: NTKPRO & LYNN_#6590


//---> ค่าโปรไฟล์ บอทของท่าน
client.user.setActivity("Test version Modmail 💗 ")
})

//ฟังชั่น ลบแชลแนล ในเซิฟเวอร์
client.on("channelDelete", (channel) => {
    if(channel.parentID == channel.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if(!person) return;

        let yembed = new discord.MessageEmbed()
        .setAuthor("ลบอีเมลแล้ว", client.user.displayAvatarURL())
        .setColor('RED')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("อีเมลของคุณจะถูกลบโดยผู้ดูแลและหากคุณมีปัญหาใด ๆ เกินกว่าที่คุณจะสามารถเปิดเมลได้อีกครั้งโดยส่งข้อความที่นี่")
    return person.send(yembed)
    
    }


})

//ฟังชั่นเซ็คอัพระบบเมลและฟังชั่นทุกอย่างในนี้
client.on("message", async message => {
  if(message.author.bot) return;

  let args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();


  if(message.guild) {
      if(command == "setup") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("คุณต้องมีสิทธิ์ผู้ดูแลระบบเพื่อตั้งค่าระบบ modmail!")
          }

          if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("บอทต้องการสิทธิ์ผู้ดูแลระบบเพื่อตั้งค่าระบบ modmail!")
          }


          let role = message.guild.roles.cache.find((x) => x.name == "ผู้สนับสนุน")
          let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          if(!role) {
              role = await message.guild.roles.create({
                  data: {
                      name: "ผู้สนับสนุน",
                      color: '#00C5FF'
                  },
                  reason: "บทบาทที่จำเป็นสำหรับระบบ ModMail"
              })
          }

          await message.guild.channels.create("MODMAIL", {
              type: "category",
              topic: "จดหมายทั้งหมดจะอยู่ที่นี่ :D",
              permissionOverwrites: [
                  {
                      id: role.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }, 
                  {
                      id: everyone.id,
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }
              ]
          })


          return message.channel.send("การตั้งค่าเสร็จสมบูรณ์ <:check:807258228965900298> ")

      } else if(command == "close") {


        if(message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
            
            const person = message.guild.members.cache.get(message.channel.name)

            if(!person) {
                return message.channel.send("ฉันไม่สามารถปิดแชนเนลได้และเกิดข้อผิดพลาดนี้ขึ้นเนื่องจากมีการเปลี่ยนชื่อแชนเนลที่น่าจะเป็น")
            }

            await message.channel.delete()

            let yembed = new discord.MessageEmbed()
            .setAuthor("จดหมายปิด", client.user.displayAvatarURL())
            .setColor("RED")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("จดหมายถูกปิดโดย " + message.author.username)
            if(args[0]) yembed.setDescription(args.join(" "))

            return person.send(yembed)

        }
      } else if(command == "open") {
          const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

          if(!category) {
              return message.channel.send("<:xmark:807257246144004116> ไม่ได้ติดตั้งระบบการกลั่นกรองในเซิร์ฟเวอร์นี้ให้ใช้ " + prefix + "setup")
          }

          if(!message.member.roles.cache.find((x) => x.name == "ผู้สนับสนุน")) {
              return message.channel.send("<:xmark:807257246144004116> คุณต้องมีบทบาทผู้สนับสนุนเพื่อใช้คำสั่งนี้")
          }

          if(isNaN(args[0]) || !args.length) {
              return message.channel.send("<:xmark:807257246144004116> กรุณาให้รหัสของบุคคล")
          }

          const target = message.guild.members.cache.find((x) => x.id === args[0])

          if(!target) {
              return message.channel.send("<:xmark:807257246144004116> ไม่พบบุคคลนี้")
          }


          //ฟังชั่นเมื่อทำการ เปิด จากข้อความด้านบน  จะทำการสร้างรายละเอียด ของบุลคลนั้นมาทั้งหมด
          //
          const channel = await message.guild.channels.create(target.id, {
              type: "text",
            parent: category.id,
            topic: "อีเมลเปิดโดยตรงโดย **" + message.author.username + "** เพื่อติดต่อกับ " + message.author.tag
          })

          let nembed = new discord.MessageEmbed()
          .setAuthor("รายละเอียด", target.user.displayAvatarURL({dynamic: true}))
          .setColor('#17FF00')
          .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("ชื่อ", target.user.username)
          .addField("วันที่สร้างบัญชี", target.user.createdAt)
          .addField("ติดต่อโดยตรง", "ใช่ (หมายความว่าผู้สนับสนุนเปิดอีเมลนี้)");

          channel.send(nembed)

          let uembed = new discord.MessageEmbed()
          .setAuthor("เปิดจดหมายโดยตรง")
          .setColor('#FF5900')
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("คุณได้รับการติดต่อจาก ผู้สนับสนุนของ **" + message.guild.name + "**, โปรดรอจนกว่าเขาจะส่งข้อความถึงคุณอีกครั้ง!");
          
          
          target.send(uembed);

          //ฟังชั่น โชคการช่วยเหลือในคำสั่งที่เราต้องการ
          let newEmbed = new discord.MessageEmbed()
          .setDescription("เปิดจดหมาย: <#" + channel + ">")
          .setColor('#FBFF00')

          return message.channel.send(newEmbed);
      } else if(command == "help") {
          let embed = new discord.MessageEmbed()
          .setAuthor('Client Bot Commands List:', client.user.displayAvatarURL())
          .setColor('#7400FF')
          
        .setDescription("บอทนี้สร้างโดย ! A V I X I T Y คุณสามารถลบเครดิตได้ :D")
        .addField(prefix + "setup", "ตั้งค่าระบบ modmail (ไม่ใช่สำหรับเซิร์ฟเวอร์หลายเครื่อง)", true)
        .setImage("https://sickr.files.wordpress.com/2017/12/discord_logo.jpg?w=1200") //https://imgur.com/a/44dgcTI
  
        .addField(prefix + "open", 'ให้คุณเปิดเมลเพื่อติดต่อใครก็ได้ที่มี ID ของเขา', true)
        
        .setThumbnail(client.user.displayAvatarURL())
        .addField(prefix + "close", "ปิดเมลที่คุณใช้คำสั่งนี้", true)
        .addField("อัพเดพในเร็วๆนี้", '**ผู้ให้พัฒนากำลังทำการอัพเดพในขณะนี้**', true);
                    



                    return message.channel.send(embed)
          
      }
  } 
  
  
  
  
  
  
  
  if(message.channel.parentID) {

    const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")
    
    if(message.channel.parentID == category.id) {
        let member = message.guild.members.cache.get(message.channel.name)
    
        if(!member) return message.channel.send('ไม่สามารถส่งข้อความได้')
    
        let lembed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(message.content)
    
        return member.send(lembed)
    }
    
    
      } 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  if(!message.guild) {
      const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => {})
      if(!guild) return;
      const category = guild.channels.cache.find((x) => x.name == "MODMAIL")
      if(!category) return;
      const main = guild.channels.cache.find((x) => x.name == message.author.id)


      if(!main) {
          let mx = await guild.channels.create(message.author.id, {
              type: "text",
              parent: category.id,
              topic: "เมลนี้สร้างขึ้นเพื่อช่วยเหลือ  **" + message.author.tag + " **"
          })

          let sembed = new discord.MessageEmbed()
          .setAuthor("เปิดแล้ว")
          .setColor("RED")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("การสนทนาเริ่มต้นแล้วคุณจะได้รับการติดต่อจากผู้สนับสนุนเร็ว ๆ นี้ :D")

          message.author.send(sembed)


          let eembed = new discord.MessageEmbed()
          .setAuthor("รายละเอียด", message.author.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("ชื่อ", message.author.username)
          .addField("วันที่สร้างบัญชี", message.author.createdAt)
          .addField("ติดต่อโดยตรง", "ไม่ (หมายความว่าอีเมลนี้เปิดโดยบุคคลที่ไม่ใช่ผู้สนับสนุน)")


        return mx.send(eembed)
      }

      let xembed = new discord.MessageEmbed()
      .setColor("YELLOW")
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(message.content)


      main.send(xembed)

  } 
  
  

 
})


client.login(token)