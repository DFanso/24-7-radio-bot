import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and leaves the channel'),
    async execute(interaction: CommandInteraction) {
        try {
            if (!interaction.guildId) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('This command can only be used in a guild.')
                    .setColor(0xFF0000); // Red color
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const connection = getVoiceConnection(interaction.guildId);
            if (connection) {
                connection.destroy();
                const embed = new EmbedBuilder()
                    .setTitle('Stopped')
                    .setDescription('The music has been stopped and the bot has left the channel.')
                    .setColor(0x00FF00); // Green color
                interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No station is currently being played.')
                    .setColor(0xFF0000); // Red color
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while trying to stop the music.')
                .setColor(0xFF0000); // Red color
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
