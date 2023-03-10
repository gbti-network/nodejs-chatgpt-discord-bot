const interactionReply = require('./interactionReply');
const { ChannelType } = require('discord.js');

// Memory to hold previous interactions
let memory = [];

module.exports = (client) => {
    return async (interaction) => {
        if (!interaction.isCommand() || interaction.commandName !== 'chat') return;

        // Do not permit /chat inside a thread all ready
        if ( typeof interaction.channel.threads == 'undefined' ) {
            await interaction.reply(`You are already in a thread, please respond directly to continue the conversation.`);
            return;
        }

        let prompt = interaction.options.getString('prompt');
        const isPublic = prompt.includes('--public');
        prompt = prompt.replace('--public' , '' )

        console.log(isPublic)
        console.log(prompt)
        // building the username object since it does not appear avaiable in the interaction variable
        const message = {
            'author' : {
                'username' : interaction.user.username
            },
            'content' : prompt
        };

        console.log(message);
        //return;

        await interaction.deferReply();

        let chunks;
        try {
            chunks = await interactionReply(message);
        } catch (error) {
            //console.error(error);
            await interaction.editReply('There was an error processing your request.');
            return;
        }


        await interaction.editReply('@'+message.author.username + ' has created a new ' + (isPublic? 'public' : 'private') + ' ChatGPT thread : )');

        // Send response to Discord channel
        await interaction.channel.threads
            .create({
                name: prompt,
                autoArchiveDuration: 60,
                reason: prompt,
                type : (isPublic) ? ChannelType.PublicThread : ChannelType.PrivateThread
            })
            .then((thread) => {

                thread.members.add(interaction.user.id);

                chunks.forEach((chunk) => {
                    thread.send(chunk);
                });

            })
            .catch((error) => {
                console.error(error);
            });

    }
};
