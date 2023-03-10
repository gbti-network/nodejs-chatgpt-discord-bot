const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

// Set up Discord bot client
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
    ],
});


const interationCreate = require('./events/interactionCreate')(client)
const ready = require('./events/ready')
const messageCreate = require('./events/messageCreate')(client)


// Memory to hold previous interactions
let memory = [];

// When the client is ready, register the "/chat" command
client.on('ready', () => ready(client));

// When a user types a command, handle it
client.on('interactionCreate', interationCreate);

// Listen for messages and send an error message if they are not in a thread
client.on('messageCreate', messageCreate);

// Log in to Discord bot client
client.login(config.discord.botToken);
