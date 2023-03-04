const Discord = require('discord.js');
const axios = require('axios');
const config = require('./config.json');

const interationCreate = require('./events/interactionCreate')
const ready = require('./events/ready')
const messageCreate = require('./events/messageCreate')

// Set up Discord bot client
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.Guilds,
    ],
});

// Memory to hold previous interactions
let memory = [];

// When the client is ready, register the "/chat" command
client.on('ready', ready);

// When a user types a command, handle it
client.on('interactionCreate', interationCreate);

// Listen for messages and send an error message if they are not in a thread
client.on('messageCreate', messageCreate);

// Log in to Discord bot client
client.login(config.discord.botToken);
