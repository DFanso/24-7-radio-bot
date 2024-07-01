import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, EmbedBuilder } from 'discord.js';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection, StreamType, AudioResource } from '@discordjs/voice';
import { currentStationUrl, currentStationName, playerStatus, updateCurrentStationUrl, updateCurrentStationName, updatePlayerStatus, updatePlayer } from '../shared/state';

let currentVoiceChannel: VoiceConnection | null = null;
let player = createAudioPlayer();
updatePlayer(player); // Update the shared player state

const stations = [
    {name :'RaiseRadio', url: 'https://stream.raiseradio.com/hardstyle-high'},
    { name: '9128.live', url: 'http://streams.radio.co:80/s0aa1e6f4a/listen' },
    { name: 'Frisky Chill', url: 'https://chill.friskyradio.com' },
    { name: 'NASA Third Rock Radio', url: 'https://stream.nasa.gov:80/thirdrock.mp3' },
    { name: 'CPR News Colorado', url: 'http://stream1.cprnetwork.org:80/cpr1_lo' },
    { name: 'Afterhours.FM', url: 'http://stream.ah.fm:8000/stream' },
    { name: 'Ambient Sleeping Pill', url: 'http://www.ambientsleepingpill.com/play' },
    { name: 'BBC Radio 1', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_q' },
    { name: 'BBC Radio 2', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio2_mf_q' },
    { name: 'BBC Radio 6 Music', url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_6music_mf_q' },
    { name: 'BBC World Service', url: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk' },
    { name: 'BadRadio', url: 'https://s2.radio.co/s2b2b68744/listen' },
    { name: 'Bluemars Cryosleep', url: 'http://sc-bm1.smartguideradio.com:8000/cryosleep.mp3' },
    { name: 'Bluemars Voices From Within', url: 'http://sc-bm2.smartguideradio.com:8000/voices.mp3' },
    { name: 'Bluemars', url: 'http://sc-bm2.smartguideradio.com:8000/bluemars.mp3' },
    { name: 'Dark Ambient Radio', url: 'http://dar.fm:8028' },
    { name: 'Dogglounge', url: 'http://87.98.169.143:8398/stream' },
    { name: 'Dublab', url: 'http://dublab.com/stream-hi' },
    { name: 'FIP', url: 'http://icecast.radiofrance.fr/fip-midfi.mp3' },
    { name: 'Hirschmilch Chillout', url: 'http://hirschmilch.de:7000/chillout.mp3' },
    { name: 'KAFM Western CO Public', url: 'http://stream.kafmradio.org:8000/kafm128' },
    { name: 'KCHUNG', url: 'http://kchungradio.org:8000/stream' },
    { name: 'KEXP Seattle', url: 'http://live-aacplus-64.kexp.org/kexp64.aac' },
    { name: 'KRCC Colorado Public', url: 'http://stream.krcc.org:8000/krcc.mp3' },
    { name: 'KSPC Claremont', url: 'http://kspc.citrus3.com:8000/stream' }
];


function getStationNameFromUrl(url: string): string {
    const station = stations.find(station => station.url === url);
    return station ? station.name : 'Unknown Station';
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Choose your preferred station')
        .addStringOption(option =>
            option.setName('station')
                .setDescription('Available stations')
                .setRequired(false)
                .addChoices(
                    {name :'RaiseRadio', value: 'https://stream.raiseradio.com/hardstyle-high'},
                    { name: '9128.live', value: 'http://streams.radio.co:80/s0aa1e6f4a/listen' },
                    { name: 'Frisky Chill', value: 'https://chill.friskyradio.com' },
                    { name: 'NASA Third Rock Radio', value: 'https://stream.nasa.gov:80/thirdrock.mp3' },
                    { name: 'CPR News Colorado', value: 'http://stream1.cprnetwork.org:80/cpr1_lo' },
                    { name: 'Afterhours.FM', value: 'http://stream.ah.fm:8000/stream' },
                    { name: 'Ambient Sleeping Pill', value: 'http://www.ambientsleepingpill.com/play' },
                    { name: 'BBC Radio 1', value: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_q' },
                    { name: 'BBC Radio 2', value: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio2_mf_q' },
                    { name: 'BBC Radio 6 Music', value: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_6music_mf_q' },
                    { name: 'BBC World Service', value: 'http://bbcwssc.ic.llnwd.net/stream/bbcwssc_mp1_ws-eieuk' },
                    { name: 'BadRadio', value: 'https://s2.radio.co/s2b2b68744/listen' },
                    { name: 'Bluemars Cryosleep', value: 'http://sc-bm1.smartguideradio.com:8000/cryosleep.mp3' },
                    { name: 'Bluemars Voices From Within', value: 'http://sc-bm2.smartguideradio.com:8000/voices.mp3' },
                    { name: 'Bluemars', value: 'http://sc-bm2.smartguideradio.com:8000/bluemars.mp3' },
                    { name: 'Dark Ambient Radio', value: 'http://dar.fm:8028' },
                    { name: 'Dogglounge', value: 'http://87.98.169.143:8398/stream' },
                    { name: 'Dublab', value: 'http://dublab.com/stream-hi' },
                    { name: 'FIP', value: 'http://icecast.radiofrance.fr/fip-midfi.mp3' },
                    { name: 'Frisky', value: 'http://friskyradio.com' },
                    { name: 'Hirschmilch Chillout', value: 'http://hirschmilch.de:7000/chillout.mp3' },
                    { name: 'KAFM Western CO Public', value: 'http://stream.kafmradio.org:8000/kafm128' },
                    { name: 'KCHUNG', value: 'http://kchungradio.org:8000/stream' },
                    { name: 'KEXP Seattle', value: 'http://live-aacplus-64.kexp.org/kexp64.aac' },
                    { name: 'KRCC Colorado Public', value: 'http://stream.krcc.org:8000/krcc.mp3' },
                    { name: 'KSPC Claremont', value: 'http://kspc.citrus3.com:8000/stream' }
                )),
    async execute(interaction: CommandInteraction) {
        try {
            const option = interaction.options.data;
            const stationOption = interaction.options.get('station');
            const station = stationOption && stationOption.value ? stationOption.value as string : currentStationUrl;
            const stationName = getStationNameFromUrl(station);
            console.log(option);

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
                .setThumbnail('https://cdn.pixabay.com/animation/2023/02/28/13/25/13-25-18-504_512.gif');
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
