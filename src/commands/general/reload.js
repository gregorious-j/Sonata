const { prefix } = require("../../../config.json")
const Discord = require("discord.js")

module.exports = {
    name: 'reload',
    description: `Reloads a command. (permissions lvl 5)`,
    usage: `reload <command>`,
    permissionRequired: 5,
    args: true,
    category: 'general',
    async execute(message, data) {
        if (!data.args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`)
        const commandName = data.args[0].toLowerCase()
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`)

        delete require.cache[require.resolve(`./${command.name}.js`)]

        try {
            const newCommand = require(`./${command.name}.js`)
            message.client.commands.set(newCommand.name, newCommand)
        } catch (error) {
            console.log(error)
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
        }
    }
}