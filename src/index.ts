import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import sodium from 'libsodium-wrappers';

const { TOKEN, CLIENT_ID } = process.env;

if (!TOKEN) {
    throw new Error("Token not found in environment variables.");
}

(async () => {
    await sodium.ready;

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    // Dynamically read event files
    const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const event = require(path.join(__dirname, 'events', file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    // Dynamically read command files
    const commands: any[] = [];
    const commandFoldersPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandFoldersPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = require(path.join(commandFoldersPath, file));
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({ version: '9' }).setToken(TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            const data: any = await rest.put(
                Routes.applicationCommands(CLIENT_ID as string),
                { body: commands },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error('Error refreshing application (/) commands:', error);
        }
    })();

    client.login(TOKEN);
})();
