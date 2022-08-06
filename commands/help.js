const { EmbedBuilder } = require("discord.js");
exports.run = async (client, message, args) => {
    let embed = new EmbedBuilder()
    embed.setColor(0x00FF00)
    embed.setDescription("?games <username> [all/number]\n?status <username>")
    embed.setFooter({ text: "<> = required, [] = optional, number = number of games to show" })
    message.channel.send({ embeds: [embed] })
}