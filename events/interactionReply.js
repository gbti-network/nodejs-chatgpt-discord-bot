const axios = require('axios');
const config = require('../config.json');

// Memory to hold previous interactions
let memory = [];

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        // Build data to send to ChatGPT API
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a brilliant web developer who is talking to @' + message.author.username +'.',
                },
            ],
        };

        console.log(data);

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
            content: message.content,
        });

        // make sure we limit memory to 50
        if (memory.length >= 50) {
            memory.shift();
        }

        // Output data size to see how it grows
        const dataSize = JSON.stringify(data.messages).length;
        console.log(`Data size: ${dataSize} bytes`);

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

                const content = response.data.choices[0].message.content.trim();
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

                memory.push({
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
