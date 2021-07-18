const Discord = require("discord.js");
const tokenfile = require("./tokenfile.json");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({disableEveryone: true});
var weather = require('weather-js');

const fs = require("fs");
const money = require("./money.json");
const ms = require("ms");
const { error } = require("console");


bot.on("guildMemberAdd", (member) => {
    const rulesChannel = "751479313836277891"
    const channelID = "796361369787695135"

    if(!channelID) return;
    if(!rulesChannel) return;
 
    const message = `Üdv a Gettóban <@${member.id}>! Olvasd el a szabályzatot: ${member.guild.channels.cache.get(rulesChannel).toString()}`

    const channel = member.guild.channels.cache.get(channelID);
    channel.send(message)

})

bot.on("guildMemberRemove", (member) => {
    const channelID = "836208401741643847"

    if(!channelID) return;
 
    const message = `Távozott <@${member.id}> a Getto-ból.`

    const channel = member.guild.channels.cache.get(channelID);
    channel.send(message)

})


let botname = "Getto-Harcosok"

bot.on('ready', () => {
    console.log('A bot aktiv!');
    bot.user.setActivity('Prefix: *', { type: 'WATCHING'}).catch(console.error);

});

bot.on("message", async message => {
    let MessageArray = message.content.split(" ");
    let cmd = MessageArray[0];
    let args = MessageArray.slice(1);
    let prefix = botconfig.prefix;

    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    if(!money[message.author.id]) {
        money[message.author.id] = {
            money: 100

        };
    }
    fs.writeFile("./money.json", JSON.stringify(money), (err) => {
        if(err) console.log(err)
    });
    let selfMoney = money[message.author.id].money; 

    if(cmd === `${prefix}money`){
        let profilkep = message.author.displayAvatarURL();

        let MoneyEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setColor("RANDOM")
        .addField("Egyenleg:", `${selfMoney}Ft`)
        .setThumbnail(profilkep)
        .setFooter(botname)

        message.channel.send(MoneyEmbed)
    }

    if(cmd === `${prefix}freemoney`){
        message.channel.send("600Ft ot kaptal!")
        money[message.author.id] = {
            money: selfMoney + 600
        }
    }

    if(message.guild){
        let drop_money = Math.floor(Math.random()*50 + 1 )
        let random_money = Math.floor(Math.random()*900 + 1)

        if(drop_money === 2){
            let üzenetek = ["Kiraboltál egy csövest.", "Elloptál egy biciklot!", "Kiraboltál egy boltot!"]
            let random_üzenet_szam = Math.floor(Math.random()*üzenetek.length)
            
            let DropMoneyEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username)
            .addField("Szerencséd volt!", `${üzenetek[random_üzenet_szam]} Ezért kaptál: ${random_money}Ft-ot!`)
            .setColor("RANDOM")
            .setThumbnail(message.author.displayAvatarURL())

            message.channel.send(DropMoneyEmbed);

            money[message.author.id] = {
                money: selfMoney + random_money
            }
        }
    }
    

    if(cmd === `${prefix}shop`){
        let ShopEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)        
        .setDescription(`${prefix}vasarol-epic (Ár: 500Ft)`)
        .setColor("RANDOM")
        .setThumbnail(bot.user.displayAvatarURL())

        message.channel.send(ShopEmbed);

    }

    if(cmd === `${prefix}slot`){
        let min_money = 50;
        if(selfMoney < min_money) return message.reply(`Túl kevés pénzed van! (Minimum ${min_money}FT-nak kell lennie a számládon!) Egyenleged: ${selfMoney}.`)

        let tét = Math.round(args[0] *100)/100
        if(isNaN(tét)) return message.reply("Kérlek adj meg egy összeget! (Pl: 5)")
        if(tét > selfMoney) return message.reply("az egyenlegeednél több pénzt nem rakhatsz fel a slotra!")

        let slots = ["🍌", "🍎", "🍍", "🥒", "🍇"]
        let result1 = Math.floor(Math.random() * slots.length)
        let result2 = Math.floor(Math.random() * slots.length)
        let result3 = Math.floor(Math.random() * slots.length)

        if(slots[result1] === slots[result2] && slots[result3]){
            let wEmbed = new Discord.MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Nyertél! Ennyit kaptál: ${tét*1.6}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(botname)
            message.channel.send(wEmbed)

            money[message.author.id] = {
                money: selfMoney + tét*1.6,
                user_id: message.author.id
            }
        } else {
            let wEmbed = new Discord.MessageEmbed()
            .setTitle('🎉 Szerencse játék | slot machine 🎉')
            .addField(message.author.username, `Vesztettél! Ennyit buktál: ${tét}ft.`)
            .addField("Eredmény:", slots[result1] + slots[result2] + slots[result3])
            .setColor("RANDOM")
            .setTimestamp(message.createdAt)
            .setFooter(botname)
            message.channel.send(wEmbed)

            money[message.author.id] = {
                money: selfMoney - tét,
                user_id: message.author.id
            }
        }
    
    }

    if(cmd === `${prefix}lb`){
        let toplist = Object.entries(money)
        .map(v => `${v[1].money}FT <@${v[1].user_id}>`)
        .sort((a, b) => b.split("FT")[0] - a.split("FT")[0])
        .slice(0, 10)

        let LbEmbed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("RANDOM")
        .addField("Pénz top lista | TOP10", toplist, true)
        .setTimestamp(message.createdAt)
        .setFooter(botname)

        message.channel.send(LbEmbed)
    }

    if(cmd === `${prefix}vasarol-epic`){
        let epicrang_id = "801208547236249621"

        let price = "500"; 
        if(message.member.roles.cache.has(epicrang_id)) return message.reply("*Ezt a rangot mar megvetted!*");
        if(selfMoney < price) return message.reply(`Erre a rangra nincs pénzed! Egyenleged: ${selfMoney}`)

        money[message.author.id] = {
            money: selfMoney - parseInt(price)
        }
        
        message.guild.member(message.author.id).roles.add(epicrang_id);

        message.reply("*Köszönöm a vásárlást! További szép napot!*")
    }


    if(cmd === `${prefix}hello`){
        message.channel.send("Szia");    
    }


     if(cmd === `${prefix}ghbot`){
        let ghbotEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.author.username)
        .setTitle("Botos Dolgok:")
        .addField("Mit tud a bot:", "Prefix:*\n Parancsok: *slot (szerencse játék)\n *lb (ranglista)\n *money (pénz egyenleged)\n *weather ... (idojaras)\n *ghbot (GH bot info)\n ")
        .setThumbnail(message.author.displayAvatarURL())
        .setImage(message.guild.iconURL())
        .setFooter(`${message.createdAt}`)

        message.channel.send(ghbotEmbed)
    }    

    if(cmd === `${prefix}uzenet`){
        let uzenet = args.join(" ")
    
        if(uzenet) {
            let uzenetEmbed = new Discord.MessageEmbed()       
        .setColor("RANDOM")
        .setAuthor(message.author.username)
        .addField("Uzenet:", uzenet)
        .setFooter(`${message.createdAt}`)

        message.channel.send(uzenetEmbed)
        } else {
            message.reply("irj szoveget!")
        }
    }
    
    if(cmd === `${prefix}kick`){
        let kick_user = message.mentions.members.first();
        if(args[0] && kick_user){

            if(args[1]){
         
                let KickEmbed = new Discord.MessageEmbed()
                .setTitle("KICK")
                .setColor("RED")
                .setDescription(`**Kickelte:** ${message.author.tag}\n**Kickelve lett:** ${kick_user.user.tag}\n**Kick indoka:** ${args.slice(1).join(" ")}`)
                    
            message.channel.send(KickEmbed);
           
                kick_user.kick(args.slice(1).join(" "))

            } else {
            let parancsEmbed = new Discord.MessageEmbed()
                .setTitle("Parancs használata:")
                .addField(`\`${prefix}kick <@név> [indok]\``, "^-^")
                .setColor("RANDOM")
                .setDescription("HIBA: Kérlek emlits meg egy indokot!")
    
                message.channel.send(parancsEmbed);
            }

        } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}kick <@név> [indok]\``, "^-^")
            .setColor("RANDOM")
            .setDescription("HIBA: Kérlek emlits meg egy embert!")

            message.channel.send(parancsEmbed);

        }
    }

    if(cmd === `${prefix}ban`){
        let ban_user = message.mentions.members.first();
        if(args[0] && ban_user){

            if(args[1]){
         
                let BanEmbed = new Discord.MessageEmbed()
                .setTitle("BAN")
                .setColor("RED")
                .setDescription(`**Bannolta:** ${message.author.tag}\n**Bannolta lett:** ${ban_user.user.tag}\n**Ban indoka:** ${args.slice(1).join(" ")}`)
                    
            message.channel.send(BanEmbed);
           
                ban_user.ban(args.slice(1).join(" "))

            } else {
            let parancsEmbed = new Discord.MessageEmbed()
                .setTitle("Parancs használata:")
                .addField(`\`${prefix}ban <@név> [indok]\``, "^-^")
                .setColor("RANDOM")
                .setDescription("HIBA: Kérlek emlits meg egy indokot!")
    
                message.channel.send(parancsEmbed);
            }

        } else {
            let parancsEmbed = new Discord.MessageEmbed()
            .setTitle("Parancs használata:")
            .addField(`\`${prefix}ban <@név> [indok]\``, "^-^")
            .setColor("RANDOM")
            .setDescription("HIBA: Kérlek emlits meg egy embert!")

            message.channel.send(parancsEmbed);

        }
    }
    
    bot.on("message", message => {
        if (message.author.bot) return;
        if (message.author.id === "ember ID-ja, akinek nem érzékeli") return;
        if (message.author.id === "ember ID-ja, akinek nem érzékeli") return ;
    
        let szavak = ["discord.gg/", "szar a szerver", "kurva anyád", "Nightfall", "Halmaj", "halmaj", "WLS", "https://discord.gg/", "RolePlay"]
        let talalt = false;
    
        for (var a in szavak) {
            if (message.content.toLowerCase().includes(szavak[a].toLowerCase())) talalt = true;
        }
        if (talalt) {
            message.delete();
            message.author.send("Ne hirdess szervert! /Nem irhatsz ilyet a chatbe!");
        }
    })

    if(cmd === `${prefix}weather`){
        if(args[0]){
            weather.find({search: args.join(" "), degreeType: "C"}, function(err, result ) {
                if (err) message.reply(err);

                if(result.length === 0){
                    message.reply("Kérlek adj meg egy település nevet!")
                } 
                
                let current = result[0].current;
                let location = result[0].location;

                let WeatherEmbed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Időjárás itt: ${current.observationpoint}`)
                .setThumbnail(current.imageURL)
                .setColor("GREEN")
                .addField("Időzóna:", `UTC${location.timezone}`, true)
                .addField("Fokozat tipusa", `${location.degreetype}`, true)
                .addField("Hőfok", `${current.temperature}°C`, true)
                .addField("Hőérzet", `${current.feelslike}°C`, true)
                .addField("Szél",`${current.winddisplay}`, true )
                .addField("Páratartalom", `${current.humidity}%`, true)

                message.channel.send(WeatherEmbed)
            })
               
        } else {
            message.reply("Kérlek adj meg egy település nevet!")                
        }
    }

    if(cmd === `${prefix}createrole`){
        if(message.guild.member(bot.user).hasPermission("ADMINISTRATOR")){
            if(message.member.hasPermission("MANAGE_ROLES")){
                if(args[0]){
                     message.guild.roles.create({
                        data: {
                            "name": args[0],
                        }
                     }).then(message.reply(`${message.author.tag} létrehozta: ${args[0]} nevű rangot!`)                  

                     )

                } else message.reply(`Használat: ${prefix}createrole <rang neve>`)

            } else message.reply("Ehhez a parancshoz nincs jogod! A következő jog kell hozzá: manage_roles")
        } else message.reply("A botnak nincsen administrator joga! Kérlek adj neki admint!")
    }

    if(cdm === `${prefix}embedsay`){
        if(message.member.hasPermission("KICK_MEMBERS")){
            if(args[0]){
                let say_embed = new Discord.MessageEmbed()
                .setDescription(arfs.join(" "))
                .setColor("RANDOM")
                .setTimestamp(message.createdAt)
                .setFooter(bot.user.username)

                message.channel.send(say_embed);
            } else {
                message.reply(`Használat: ${prefix}embedsay <üzenet>`)
            }
        } else message.reply("Ehhez nincs jogod! (KICK_MEMBER jogot igényel!)")
   
    }

    if(cmd === `${prefix}clear`){
        if(message.member.hasPermission("KICK_MEMBERS")){
            if(message.guild.member(bot.user).hasPermission("ADMINISTRATOR")){

                if(args[0] && isNaN(args[0]) && args[0] <= 100 || 0 < args[0] && args[0] < 101){

                    message.channel.send(`${Math.round(args[0])}`)
                    message.channel.bulkDelete(Math.round(args[0]))

                } else {
                    message.reply(`Használat: ${prefix}clear <1-100>`)
                }    
            
            } else message.reply("A botnak adminnak kell lennie a szerverem, hogy működjön ez a parancs!)")

        } else message.reply("Ehhez a parancshoz nincs jogod!")
    }


})

fs.writeFile("./money.json", JSON.stringify(money), (err) => {
    if(err) console.log(err);
});

bot.login(tokenfile.token);
