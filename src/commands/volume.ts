import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { player, playerStatus } from '../shared/state';
import { AudioPlayerStatus } from '@discordjs/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the bot')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-100)')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        try {
            const volumeOption = interaction.options.get('level');
            const volumeLevel = volumeOption && volumeOption.value ? volumeOption.value as number : null;

            if (volumeLevel === null || volumeLevel < 0 || volumeLevel > 100) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('Volume level must be between 0 and 100.')
                    .setColor(0xFF0000); // Red color
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (playerStatus === null || playerStatus !== AudioPlayerStatus.Playing) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No station is currently being played.')
                    .setColor(0xFF0000); // Red color
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (player && player.state.status === AudioPlayerStatus.Playing) {
                const audioResource = player.state.resource as any; // Casting to any to access resource
                if (audioResource && audioResource.volume) {
                    audioResource.volume.setVolume(volumeLevel / 100);
                    const embed = new EmbedBuilder()
                        .setTitle('Success')
                        .setDescription(`Volume has been set to ${volumeLevel}%.`)
                        .setColor(0x00FF00); // Green color
                    await interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('Failed to set volume. No audio resource or volume control found.')
                        .setColor(0xFF0000); // Red color
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                }
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('No station is currently being played.')
                    .setColor(0xFF0000); // Red color
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while trying to set the volume.')
                .setColor(0xFF0000); // Red color
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
