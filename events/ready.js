const Discord = require('discord.js');

module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.application.commands.create({
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
    }).then((command) => {
        console.log(`Registered command ${command.name}`);
    }).catch((error) => {
        console.error(error);
    });
};
