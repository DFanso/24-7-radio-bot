import { AudioPlayer, AudioPlayerStatus } from '@discordjs/voice';

export let currentStationUrl: string = 'https://stream.raiseradio.com/hardstyle-high';
export let currentStationName: string = 'RaiseRadio';
export let playerStatus: AudioPlayerStatus | null = null;
export let player: AudioPlayer | null = null; // Add player to the shared state

export const updateCurrentStationUrl = (url: string) => {
    currentStationUrl = url;
};

export const updateCurrentStationName = (name: string) => {
    currentStationName = name;
};

export const updatePlayerStatus = (status: AudioPlayerStatus | null) => {
    playerStatus = status;
};

export const updatePlayer = (audioPlayer: AudioPlayer | null) => {
    player = audioPlayer;
};
