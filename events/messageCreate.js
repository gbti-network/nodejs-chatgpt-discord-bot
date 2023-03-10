const interactionReply = require("./interactionReply");

module.exports = (client) => {
    let thinkingMessages = [];

    return async (message) => {
        // Ignore messages from the bot itself
        if (message.author.bot) return;
        //console.log(message);
        //console.log(message.reference);
        // Check if message is arriving within a thread
        if (!message.position) {
            // If not, send a message prompting users to use the /chat command within a thread
            await message.channel.send('Welcome to the #ChatGPT channel!\n\nTo chat, use the `/chat` command followed by your message.');
        } else {

            // Call interactionReply to get the response from ChatGPT API
            let chunks;
            const interval = setInterval(async () => {
                const thinkingMessage = await message.channel.send('thinking...');
                thinkingMessages.push(thinkingMessage);
            }, 8000);

            try {
                chunks = await interactionReply(message);

                clearInterval(interval);

            } catch (error) {
                clearInterval(interval);
                console.error(error);
                return;
            }

            // Delete all "thinking..." messages from the channel and the thinkingMessages array
            thinkingMessages.forEach((msg) => {
                msg.delete().catch(error => {
                    // If the message has already been deleted or doesn't exist, log an error message
                    console.error(`Error deleting thinking message: ${error.message}`);
                });
            });

            // Output the contents of the chunks to Discord
            chunks.forEach((chunk) => {
                message.channel.send(chunk);
            });

        }
    }
}
