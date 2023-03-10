const axios = require('axios');
const config = require('../config.json');

// Memory to hold previous interactions for each user
const memory = {};

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        const username = message.author.username;

        // Initialize memory for the user if it doesn't exist
        if (!memory[username]) {
            memory[username] = [];
        }

        // Build data to send to ChatGPT API
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a brilliant coder, developer, and designer who is talking to @${username}.`,
                },
            ],
        };

        // Add previous messages to data
        for (let i = 0; i < memory[username].length; i++) {
            data.messages.push({
                role: memory[username][i].role,
                content: memory[username][i].content,
            });
        }

        // Add user's prompt to data
        data.messages.push({
            role: 'user',
            content: message.content,
        });

        // Limit memory to 50 for each user
        if (memory[username].length >= 50) {
            memory[username].shift();
        }

        // Output data size to see how it grows
        const dataSize = JSON.stringify(data.messages).length;
        console.log(`Data size: ${dataSize} bytes`);
        //console.log(data);

        // Send data to ChatGPT API
        axios
            .post(
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
            )
            .then((response) => {

                const content = response.data.choices[0].message.content

                const contentLength = content.length;
                const maxLength = 2000;
                const numChunks = Math.ceil(contentLength / maxLength);
                const chunks = [];

                if (contentLength <= maxLength) {
                    // If the content is shorter than or equal to the max length, just add it to the chunks array
                    chunks.push(content);
                } else {
                    // If the content is longer than the max length, break it into chunks
                    for (let i = 0; i < numChunks; i++) {
                        const start = i * maxLength;
                        const end = start + maxLength;
                        chunks.push(content.substring(start, end));
                    }
                }


                memory[username].push({
                    role: 'assistant',
                    content: content,
                });

                resolve(chunks);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
};
