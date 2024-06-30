import dotenv from 'dotenv';

dotenv.config();

export const FFMPEG_OPTIONS = {
    input: {
        before_options: '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
        options: '-vn',
    },
};



export const { TOKEN, CLIENT_ID } = process.env;
