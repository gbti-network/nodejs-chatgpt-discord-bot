const Discord = require('discord.js');

module.exports = async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    try {
        const command = await client.application.commands.create({
            name: 'chat',
            description: 'Talk to ChatGPT',
            options: [
                {
                    name: 'prompt',
                    description: 'The prompt to send to ChatGPT',
                    type: 3,
                    required: true,
                },
            ]
        });
        console.log(`Registered command ${command.name}`);
    } catch (error) {
        console.error(error);
    }
}
