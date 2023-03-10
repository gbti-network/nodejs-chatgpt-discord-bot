const axios = require('axios');
const config = require('../config.json');

// Memory to hold previous interactions
let memory = [];

module.exports = (client) => {
    return async (interaction) => {
        if (!interaction.isCommand() || interaction.commandName !== 'chat') return;

        // Do not permit /chat inside a thread all ready
        if ( typeof interaction.channel.threads == 'undefined' ) {
            await interaction.deferReply();
            await interaction.editReply('You are already in a thread, please respond directly to continue the conversation.');
            return;
        }
        const prompt = interaction.options.getString('prompt');

        // Acknowledge the interaction
        await interaction.deferReply();

        // Build data to send to ChatGPT API
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a brilliant web developer.',
                },
            ],
        };

        // Add previous messages to data
        for (let i = 0; i < memory.length; i++) {
            data.messages.push({
                role: memory[i].role,
                content: memory[i].content,
            });
        }

        // Add user's prompt to data
        data.messages.push({
            role: 'user',
            content: prompt,
        });

        // Send data to ChatGPT API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                max_tokens: 2048,
                n: 1,
                temperature: 0.7,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
                model: 'gpt-3.5-turbo',
                ...data,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${config.openAI.apiKey}`,
                },
            }
        );

        memory.push({
            role: 'user',
            content: prompt,
        });
        memory.push({
            role: 'assistant',
            content: response.data.choices[0].text,
        });

        // Store previous messages in memory
        if (memory.length >= 50) {
            memory.shift();
        }

        await interaction.editReply('New thread created.');

        // Send response to Discord channel
        //console.log(response.data.choices);
        await interaction.channel.threads
            .create({
                name: prompt,
                autoArchiveDuration: 60,
                reason: prompt,
            })
            .then((thread) => {
                thread.members.add(interaction.user.id);
                thread.send(response.data.choices[0].message.content.trim());
            })
            .catch((error) => {
                console.error(error);
            });

    }
};
