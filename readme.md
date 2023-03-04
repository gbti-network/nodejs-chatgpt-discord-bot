# ChatGPT Discord Bot

This is a simple Discord bot that uses OpenAI's GPT language model to chat with users. It is built with Node.js and the Discord.js library.

## Requirements

- Node.js (v14 or higher)
- A Discord bot token (get one [here](https://discord.com/developers/applications))

## Installation

1. Clone the repository or download the source code
2. Install dependencies with `npm install`
3. Create a `config.json` file based on the `config-example.json` file and add your Discord bot token and OpenAI API key
4. Start the bot with `npm start`

## Usage

The bot listens for the `/chat` command followed by a message from the user. It then sends the message to the OpenAI API and replies to the user with the response.

Example: `/chat How are you doing today?`
