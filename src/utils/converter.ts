import { VideoInfo } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import ytdl from '@distube/ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

if (!ffmpegPath) {
    throw new Error("找不到 ffmpeg，請確認已安裝 ffmpeg 或安裝 ffmpeg-static。");
}
ffmpeg.setFfmpegPath(ffmpegPath);

export default class Converter {
    private getOutputPath(fileName: string) {
        const outputDir = path.resolve(process.cwd(), 'downloads');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        return path.join(outputDir, fileName);
    }

    async convertToMp3(videoInfo: VideoInfo): Promise<void> {
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]+/g, ''); // 過濾非法字元
        const fileName = `${safeTitle || 'output'}.mp3`;
        const filePath = this.getOutputPath(fileName);

        return new Promise((resolve, reject) => {
            const stream = ytdl(videoInfo.url, { quality: 'highestaudio' });
            ffmpeg(stream)
                .audioBitrate(128)
                .toFormat('mp3')
                .on('end', () => {
                    console.log(`已建立檔案: ${fileName}`);
                    resolve();
                })
                .on('error', (err: unknown) => {
                    console.error('轉檔失敗:', err);
                    reject(err);
                })
                .save(filePath);
        });
    }

    async convertToMp4(videoInfo: VideoInfo): Promise<void> {
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]+/g, ''); // 過濾非法字元
        const fileName = `${safeTitle || 'output'}.mp4`;
        const filePath = this.getOutputPath(fileName);

        return new Promise((resolve, reject) => {
            const audio = ytdl(videoInfo.url, { quality: 'highestaudio' });
            const video = ytdl(videoInfo.url, { quality: 'highestvideo' });

            ffmpeg()
                .input(video)
                .input(audio)
                .videoCodec('libx264')
                .audioCodec('aac')
                .toFormat('mp4')
                .on('end', () => {
                    console.log(`已建立檔案: ${fileName}`);
                    resolve();
                })
                .on('error', (err: unknown) => {
                    console.error('轉檔失敗:', err);
                    reject(err);
                })
                .save(filePath);
        });
    }
}
