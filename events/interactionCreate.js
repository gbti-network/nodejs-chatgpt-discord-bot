const interactionReply = require('./interactionReply');
const { ChannelType } = require('discord.js');

module.exports = (client) => {
    return async (interaction) => {
        if (!interaction.isCommand() || interaction.commandName !== 'chat') return;

        // Check if the command is called within a thread
        if (typeof interaction.channel.threads === 'undefined') {
            await interaction.reply('You cannot use the `/chat` command inside a thread. Please comment normally to progress the conversation.');
            return;
        }

        await interaction.deferReply()

        // Extract the prompt from the command
        let prompt = interaction.options.getString('prompt');
        const isPublic = prompt.includes('--public');
        prompt = prompt.replace('--public', '');

        // Create a new thread with the prompt as the thread name
        const threadName = prompt;
        const threadOptions = {
            name: prompt,
            autoArchiveDuration: 60,
            reason: threadName,
            type: isPublic ? ChannelType.PublicThread : ChannelType.PrivateThread,
        };
        const thread = await interaction.channel.threads.create(threadOptions);

        // Building the message object to pass to interactionReply
        const message = {
            author: {
                username: interaction.user.username,
            },
            content: prompt,
            channel: {
                id: thread.id,
            },
        };

        // Call interactionReply to get the response from ChatGPT API
        let chunks;
        try {
            chunks = await interactionReply(message);
        } catch (error) {
            await interaction.editReply('There was an error processing your request.');
            return;
        }

        // Add user to thread
        thread.members.add(interaction.user.id)

        // Send response to Discord thread
        chunks.forEach((chunk) => {
            thread.send(chunk);
        });

        // Edit initial reply to show that thread was created
        await interaction.editReply(`@${message.author.username} has created a new ${isPublic ? 'public' : 'private'} ChatGPT thread.`);
    };
};
