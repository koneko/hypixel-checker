module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    //set status
    client.user.setPresence({ activities: [{ name: `${client.config.prefix}help` }], status: 'dnd' });
}