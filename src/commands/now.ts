import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { playerStatus, currentStationName } from '../shared/state';
import { AudioPlayerStatus } from '@discordjs/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now')
        .setDescription('Display the currently playing station'),
    async execute(interaction: CommandInteraction) {
        try {
            if (playerStatus === AudioPlayerStatus.Playing) {
                const embed = new EmbedBuilder()
                    .setTitle('Now Playing')
                    .setDescription(`The current station being streamed is **${currentStationName}**.`)
                    .setColor(0x00FF00) // Green color
                    .setThumbnail('https://raiseradio.com/Logo.png');
                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Not Playing')
                    .setDescription('No station is currently being played.')
                    .setColor(0xFF0000) // Red color
                    .setThumbnail('https://raiseradio.com/Logo.png');
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while fetching the currently playing station.')
                .setColor(0xFF0000) // Red color
                .setThumbnail('https://raiseradio.com/Logo.png');
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
