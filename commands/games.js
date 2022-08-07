const { EmbedBuilder } = require("discord.js")
require("isomorphic-fetch")
exports.run = async (client, message, args) => {
    try {
        function getGames (uuid) {
            let headers = { "api-key": client.config.api }
            return fetch(`https://api.hypixel.net/recentgames?uuid=${uuid}`, { headers }).then(data => data.json()).then(games => games)
        }
        if (!args[0]) return message.channel.send("Please provide a name.")
        let name = args[0]
        let uuid = await getId(name)
        uuid = uuid.toString()
        let Discord = client.Discord
        args.shift()
        getGames(uuid).then(async games => {
            // return first 50 games
            if (!games.games.length) return message.channel.send("No games found.")
            games = getFirst(25, games.games)
            let embed = new EmbedBuilder()
            console.log(games.length)
            if (games.length == 0) return message.channel.send("No recent games found.")
            if (!args[0]) {
                //get first game
                let game = games[0];
                let ongoing = game.ended ? false : true
                let gameType = game.gameType.toLowerCase()
                gameType = gameType.charAt(0).toUpperCase() + gameType.slice(1)
                if (!game.map) game.map = "N/A"
                console.log(games)
                embed.setTitle(`Viewing a ${gameType} game from ${name}`)
                embed.setColor(0x000000)
                embed.setAuthor({ name: name, iconURL: "https://minotar.net/avatar/" + uuid + '.png', url: "https://minotar.net/avatar/" + uuid + '.png' })
                embed.setThumbnail(`https://hypixel.net/styles/hypixel-v2/images/game-icons/${gameType}-64.png`)
                embed.setDescription(`Ongoing: ${ongoing} | Map: ${game.map} | Type: ${game.gameType} | Mode: ${game.mode}`)
                

                let startTime = new Date(game.date)
                let endTime = game.ended || new Date()  // if the game not yet finished, use current time
                let diff = endTime - startTime
                let seconds = diff / 1000
                let minutes = seconds / 60
                let hours = minutes / 60
                minutes = Math.floor(minutes)
                
                let duration = `~${minutes} minutes`  // approximate
                embed.addFields({ name: "Started At: ", value: startTime, inline: false })
                embed.addFields({ name: "Duration:", value: duration, inline: false })
                embed.addFields({ name: "Ended At:", value: ongoing ? "N/A" : endTime, inline: false})

                //send embed
                message.channel.send({ embeds: [embed] })
                return
            }
            if (args[0] == "all") {
                let embed = new EmbedBuilder()
                embed.setTitle(`Viewing ${games.length} recent games from ${name}`)
                embed.setColor(0x0011FF)
                embed.setAuthor({ name: name, iconURL: `https://minotar.net/avatar/${uuid}.png`, url: `https://minotar.net/avatar/${uuid}.png` })
                let i = 0
                games.forEach(game => {
                    i++
                    if (!game.map) game.map = "N/A"
                    embed.addFields({ name: `Game ${i}: ${game.gameType}/${game.mode}`, value: `Map: ${game.map}`, inline: false })
                });
                message.channel.send({ embeds: [embed] })
            } else {
                //check if args[0] is a number
                if (isNaN(+args[0])) return
                let game = games[args[0] - 1]
                let ongoing = game.ended ? false : true
                if (game.ended) ongoing = false
                else ongoing = true
                let gameType = game.gameType.toLowerCase()
                gameType = gameType.charAt(0).toUpperCase() + gameType.slice(1)
                if (!game.map) game.map = "N/A"
                let embed = new EmbedBuilder()
                embed.setTitle(`Viewing a ${gameType} (${args[0]}) game from ${name}`)
                embed.setColor(0x000000)
                embed.setAuthor({ name: name, iconURL: "https://minotar.net/avatar/" + uuid + '.png', url: "https://minotar.net/avatar/" + uuid + '.png' })
                embed.setThumbnail(`https://hypixel.net/styles/hypixel-v2/images/game-icons/${gameType}-64.png`)
                embed.setDescription(`Ongoing: ${ongoing} | Map: ${game.map} | Type: ${game.gameType} | Mode: ${game.mode}`)
                
                let startTime = new Date(game.date)
                let endTime = game.ended || new Date()
                let diff = endTime - startTime
                let seconds = diff / 1000
                let minutes = seconds / 60
                let hours = minutes / 60
                minutes = Math.floor(minutes)
                let duration = `~${minutes} minutes`



                embed.addFields({ name: "Started At: ", value: startTime, inline: false })
                embed.addFields({ name: "Duration: ", value: duration, inline: false })
                embed.addFields({ name: "Ended At:", value: ongoing ? "N/A" : endTime, inline: false })
                
                //send embed
                message.channel.send({ embeds: [embed] })
            }
        })
    } catch (e) {
        message.channel.send("An error has occured. Please try again.")
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

function getId (playername) {
    return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
        .then(data => data.json())
        .then(player => player.id);
}

// RecentGame {
//     game: 'duels',
//     id: 61,
//     code: 'DUELS',
//     name: 'Duels',
//     found: true,
//     dateTimestamp: 1659531488579,
//     date: 2022-08-03T12:58:08.579Z,
//     mode: 'DUELS_SW_DUEL',
//     map: 'Foundation',
//     ongoing: false,
//     endedAt: 2022-08-03T12:58:37.779Z,
//     endedTimestamp: 1659531517779
//   }