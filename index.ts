// Importing the sweet modules
import * as discord from "discord.js";
import fetch from 'node-fetch';

// All the data we need to run out bot
const prefix = "!";
const hypixelapikey = "INSERT YOUR HYPIXEL API KEY HERE";
const token = "INSERT YOUR DISCORD BOT TOKEN HERE";

// Initialziing the client
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });

// Client on ready event, which logs "Ready!" to the console
client.once('ready', () => console.log('Ready!'));

// On message event
client.on("messageCreate", async message => {
    // If the message doesnt start with our bot's prefix, return and do nothing
	if (!message.content.startsWith(prefix)) return;
    // If the message's author is the bot, return
    if (message.author.bot) return;
    
    // If message starts with "bw" or any alterations of cases, do the following
    const msg = message.content.toLowerCase()
    if (msg.startsWith(`${prefix}bw`)) {
        const player = (message.content).split(" ");

        // If the user didn't specify a player name, send a error embed and return
        if (player[1] == undefined) {
            let embed = new discord.MessageEmbed();
            embed.title = 'Invalid Command Usage!';
            embed.addField('Usage:', `${prefix}bw {IGN}`, false);
            embed.setThumbnail("https://media.discordapp.net/attachments/835071270117834773/856907114517626900/error.png");
            await message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
            return;
        }

        try {
            // Fetching data from the mojang api (the uuid)
            let mojang_data = await fetch(`https://api.mojang.com/users/profiles/minecraft/${player[1]}`);
            // Turning it into JSON
            mojang_data = await mojang_data.json();

            // Fetching the data from the Hypixel API
            let api = await fetch(`https://api.hypixel.net/player?key=${hypixelapikey}&uuid=${mojang_data.id}`);
            // Turning the Hypixel API data into JSON
            api = await api.json();

            // All the data we need from the Hypixel API
            const wins = api["player"]["stats"]["Bedwars"]["wins_bedwars"] || 0;
            const kills = api["player"]["stats"]["Bedwars"]["kills_bedwars"] || 0;
            const deaths = api["player"]["stats"]["Bedwars"]["deaths_bedwars"] || 0;
            const deathsVoid = api["player"]["stats"]["Bedwars"]["void_deaths_bedwars"] || 0;
            const killsVoid = api["player"]["stats"]["Bedwars"]["void_kills_bedwars"] || 0;
            const brokenBeds = api["player"]["stats"]["Bedwars"]["beds_broken_bedwars"] || 0;
            const lostBeds = api["player"]["stats"]["Bedwars"]["beds_lost_bedwars"] || 0;
            const losses = api["player"]["stats"]["Bedwars"]["losses_bedwars"] || 0;
            const stars = api["player"]["achievements"]["bedwars_level"] || 0;
            const finalDeaths = api["player"]["stats"]["Bedwars"]["final_deaths_bedwars"] || 0;
            const finalKills = api["player"]["stats"]["Bedwars"]["final_kills_bedwars"] || 0;
            const winstreak = api["player"]["stats"]["Bedwars"]["winstreak"] || 0;
            const fkdr = (finalKills / finalDeaths).toFixed(2);
            const wlr = (wins / losses).toFixed(2);
            const bblr = (brokenBeds / lostBeds).toFixed(2);
            const kdr = (kills / deaths).toFixed(2);
            const voidKDR = (killsVoid / deathsVoid).toFixed(2);
            const index = Math.round(stars * parseFloat(fkdr) * parseFloat(fkdr) / 10);

            // Making a new discord embed and formatting all the numbers into string and adding commas where necessary
            // to make it easier to read numbers
            let embed = new discord.MessageEmbed();
            embed.title = "Bedwars Stats";
            embed.description = `Overall | ${mojang_data.name} [${index}]`;
            embed.addField("Stars","`✫" + stars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Winstreak", "`" + winstreak.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("BBLR", "`" + bblr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Final Kills", "`" + finalKills.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Final Deaths", "`" + finalDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("FKDR", "`" + fkdr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Kills", "`" + kills.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Deaths", "`" + deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("KDR", "`" + kdr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Wins", "`" + wins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Losses", "`" + losses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("WLR", "`" + wlr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Void Kills", "`" + killsVoid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Void Deaths", "`" + deathsVoid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);
            embed.addField("Void KDR", "`" + voidKDR.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "`", true);

            // Sending the message
            await message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});

        } catch (err) {
            // If the used provided an invalid player name, do the following and do nothing else
            let embed = new discord.MessageEmbed();
            embed.title = 'An Error Occured';
            embed.addField('Invalid Player Specified!', `Please re-check the player name you have entered.`, false)
            embed.setThumbnail("https://media.discordapp.net/attachments/835071270117834773/856907114517626900/error.png")
            await message.reply({embeds: [embed], allowedMentions: { repliedUser: false }});
            return
        };
    };
});

client.login(token);