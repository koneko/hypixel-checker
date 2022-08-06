const Discord = require("discord.js");
const fs = require("fs");
//init client with intents
const client = new Discord.Client({ intents: ["GuildMessages", "Guilds", "GuildVoiceStates", "MessageContent"] });
const Hypixel = require("hypixel-api-reborn")
const configFile = require("./config.json");

const config = {}
config.prefix = configFile.prefix || "?";
config.token = process.env.token || configFile.token;
config.api = process.env.api || configFile.api;
client.config = config;
client.hypixel = new Hypixel.Client(config.api)
client.Discord = Discord;

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log('Loaded command ' + commandName + ".js")
        client.commands.set(commandName, props);
    });
});


client.login(config.token);