import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with the bot\'s commands'),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setColor(0x00FF00) // Green color
            .setDescription('Here are the available commands for this bot:')
            .addFields(
                { name: '/play', value: 'Choose your preferred station and start playing.', inline: false },
                { name: '/stop', value: 'Stops the music and leaves the channel.', inline: false },
                { name: '/volume', value: 'Adjust the volume of the bot (0-100).', inline: false },
                { name: '/now', value: 'Displays the currently playing station.', inline: false },
                { name: '/help', value: 'Provides information and usage examples for all available commands.', inline: false },
            )
            .setFooter({ text: 'Use / before each command to interact with the bot.' });

        await interaction.reply({ embeds: [embed] });
    },
};
