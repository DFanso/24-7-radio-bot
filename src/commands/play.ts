import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection, StreamType, AudioResource } from '@discordjs/voice';
import { currentStationUrl, currentStationName, playerStatus, updateCurrentStationUrl, updateCurrentStationName, updatePlayerStatus, updatePlayer } from '../shared/state';

let currentVoiceChannel: VoiceConnection | null = null;
let player = createAudioPlayer();
updatePlayer(player); // Update the shared player state

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Choose your preferred station')
        .addStringOption(option =>
            option.setName('station')
                .setDescription('Available stations')
                .setRequired(false)
                .addChoices(
                    { name: 'RaiseRadio', value: 'https://stream.raiseradio.com/hardstyle-high' }
                )),
    async execute(interaction: CommandInteraction) {
        try {
            const stationOption = interaction.options.get('station');
            const station = stationOption && stationOption.value ? stationOption.value as string : currentStationUrl;
            const stationName = stationOption && stationOption.name ? stationOption.name : 'RaiseRadio';

            const member = interaction.member as GuildMember;
            const voiceChannel = member.voice.channel;
            if (!voiceChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('You need to be in a voice channel!')
                    .setColor(0xFF0000); // Red color
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            currentVoiceChannel = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const resource: AudioResource = createAudioResource(station, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true, // Enable volume control
                metadata: { title: station }
            });

            player.play(resource);
            currentVoiceChannel.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`Broadcasting **${station}**`);
            });

            player.on('error', error => {
                const metadata = (error.resource.metadata as { title: string }).title;
                console.error('Error:', error.message, 'with track', metadata);
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription('An error occurred while trying to play the station.')
                    .setColor(0xFF0000); // Red color
                interaction.followUp({ embeds: [embed], ephemeral: true });
            });

            updateCurrentStationUrl(station);
            updateCurrentStationName(stationName);
            updatePlayerStatus(AudioPlayerStatus.Playing); // Update the player status
            const embed = new EmbedBuilder()
                .setTitle('Now Playing')
                .setDescription(`Broadcasting **${stationName}**`)
                .setColor(0x00FF00) // Green color
                .setThumbnail('https://raiseradio.com/Logo.png');
            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while trying to play the station.')
                .setColor(0xFF0000); // Red color
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
