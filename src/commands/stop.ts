import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and leaves the channel'),
    async execute(interaction: CommandInteraction) {
        try {
            const connection = getVoiceConnection(interaction.guildId);
            if (connection) {
                connection.destroy();
                interaction.reply('The music has been stopped and the bot has left the channel.');
            } else {
                interaction.reply({ content: 'No station is currently being played.', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to stop the music.', ephemeral: true });
        }
    },
};
