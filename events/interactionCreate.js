const interactionReply = require('./interactionReply');

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

        const prompt = interaction.options.getString('prompt');

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


        await interaction.editReply('New thread created.');

        // Send response to Discord channel
        await interaction.channel.threads
            .create({
                name: prompt,
                autoArchiveDuration: 60,
                reason: prompt,
                locked: true
            })
            .then((thread) => {

                thread.members.add(interaction.user.id);
                thread.members.add(client.user.id);

                chunks.forEach((chunk) => {
                    thread.send(chunk);
                });

            })
            .catch((error) => {
                console.error(error);
            });

    }
};
