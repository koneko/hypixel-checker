const { EmbedBuilder } = require("discord.js")
exports.run = async (client, message, args) => {
    try {
        function getStatus (uuid) {
            let headers = { "api-key": client.config.api }
            return fetch(`https://api.hypixel.net/status?uuid=${uuid}`, { headers }).then(data => data.json()).then(status => status)
        }
        if (!args[0]) return message.channel.send("Please provide a name.")
        let name = args[0]
        let uuid = await getId(name)
        uuid = uuid.toString()
        let Discord = client.Discord
        args.shift()
        getStatus(uuid).then(async status => {
            status = status.session
            let embed = new EmbedBuilder()
            if (!status) return message.channel.send("No status found.")
            // embed.setTitle("Viewing status for " + name)
            embed.setColor(0x00FF00)
            embed.setAuthor({ name: name, iconURL: "https://minotar.net/avatar/" + uuid + '.png', url: "https://minotar.net/avatar/" + uuid + '.png' })
            if (status.online) {
                embed.addFields({ name: "Status: ", value: "Online", inline: false })
            } else {
                embed.addFields({ name: "Status: ", value: "Offline", inline: false })
            }
            if (status.gameType) {
                let gameType = status.gameType.toLowerCase()
                gameType = gameType.charAt(0).toUpperCase() + gameType.slice(1)
                embed.setThumbnail(`https://hypixel.net/styles/hypixel-v2/images/game-icons/${gameType}-64.png`)
                embed.addFields({ name: "Type: ", value: gameType, inline: true })
                if (!status.mode) status.mode = "N/A"
                embed.addFields({ name: "Mode: ", value: status.mode, inline: true })
                if (!status.map) status.map = "N/A"
                embed.addFields({ name: "Map: ", value: status.map, inline: true })
            }
            //send embed
            message.channel.send({ embeds: [embed] })
        })
    } catch (e) {
        message.channel.send("An error has occured.")
    }
}


function getFirst (x, arr) {
    let i = 1;
    let returnArr = []
    arr.forEach(game => {
        if (i > x) return;
        returnArr.push(game)
        i++
    })
    return returnArr
}

function getId (playername) { return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`).then(data => data.json()).then(data => data.id) }