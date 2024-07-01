import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Replies with Hello!'),
    async execute(interaction: CommandInteraction) {
        try {
            await interaction.reply(`Hello, ${interaction.user.username}! Your data has been saved.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error saving your data.');
        }
    },
};
