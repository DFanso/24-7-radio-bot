import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection, StreamType, AudioResource } from '@discordjs/voice';

let currentStationUrl: string = 'https://stream.raiseradio.com/hardstyle-high';
let currentVoiceChannel: VoiceConnection | null = null;
let player = createAudioPlayer();

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

            const member = interaction.member as GuildMember;
            const voiceChannel = member.voice.channel;
            if (!voiceChannel) {
                return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });
            }

            currentVoiceChannel = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            const resource: AudioResource = createAudioResource(station, {
                inputType: StreamType.Arbitrary,
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
                interaction.followUp({ content: 'An error occurred while trying to play the station.', ephemeral: true });
            });

            currentStationUrl = station;
            interaction.reply(`Broadcasting **${station}**`);

        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'An error occurred while trying to play the station.', ephemeral: true });
        }
    },
};
