import { Interaction, Client } from 'discord.js';
import path from 'path';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction, client: Client) {
        if (!interaction.isCommand()) return;

        const commandPath = path.join(__dirname, '..', 'commands', `${interaction.commandName}.ts`);
        try {
            const command = require(commandPath);
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while executing this command.',
                ephemeral: true
            });
        }
    }
};
