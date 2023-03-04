# ChatGPT Discord Bot

This is a simple Discord bot that uses OpenAI's GPT language model to chat with users. It is built with Node.js and the Discord.js library.

## Requirements

- Node.js (v14 or higher)
- A Discord bot token (get one [here](https://discord.com/developers/applications))

## Installation

1. Clone the repository or download the source code
2. Install dependencies with `npm install`
3. Create a `config.json` file based on the `config-example.json` file and add your Discord bot token and OpenAI API key
4. Start the bot with node chatgpt.js`

## Usage

The bot listens for the `/chat` command followed by a message from the user. It then sends the message to the OpenAI API and replies to the user with the response.

Example: `/chat How are you doing today?`

## Adding the Bot to Your Server

1. Go to your [Discord developer portal](https://discord.com/developers/applications) and select your application.
2. Select "OAuth2" from the sidebar.
3. Under "Scopes," select "bot."
4. Under "Bot Permissions," select all permissions that the bot requires. In this case, it requires the "Send Messages" permission under "Text Permissions."
5. Scroll back up and copy the generated OAuth2 URL.
6. Open the OAuth2 URL in your browser and select the server you want to add the bot to.
7. Follow the instructions to authorize the bot and add it to your server.

Note: Make sure you have the "Manage Server" permission on the server you're adding the bot to.
