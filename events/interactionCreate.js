const axios = require('axios');
const config = require('../config.json');

// Memory to hold previous interactions
let memory = [];

module.exports = async (interaction) => {
    if (!interaction.isCommand() || interaction.commandName !== 'chat') return;

    const prompt = interaction.options.getString('prompt');

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
            max_tokens: 100,
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

    // Store previous messages in memory
    if (memory.length >= 10) {
        memory.shift();
    }
    memory.push({
        role: 'user',
        content: prompt,
    });
    memory.push({
        role: 'ai',
        content: response.data.choices[0].text,
    });

    // Send response to Discord channel
    //console.log(response.data.choices);
    await interaction.reply(response.data.choices[0].message.content.trim());
};
