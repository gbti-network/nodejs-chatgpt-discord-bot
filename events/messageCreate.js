const axios = require("axios");
const config = require("../config.json");

module.exports = async (message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // If message is not a command, check if it is a thread
    if (!message.reference) {
        message.channel.send(
            'All responses in this channel must be inside a thread, or a new thread prompt using the `/chat` command'
        );
    }
}
