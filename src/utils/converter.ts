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
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]+/g, '');
        const fileName = `${safeTitle || 'output'}.mp4`;
        const filePath = this.getOutputPath(fileName);

        const videoTemp = this.getOutputPath(`${safeTitle}_video.mp4`);
        const audioTemp = this.getOutputPath(`${safeTitle}_audio.mp4`);

        return new Promise((resolve, reject) => {
            console.log('正在下載影片串流...');
            const videoStream = ytdl(videoInfo.url, { quality: 'highestvideo' });
            const videoFile = fs.createWriteStream(videoTemp);
            videoStream.pipe(videoFile);

            videoFile.on('finish', () => {
                console.log('影片下載完成，正在下載音訊串流...');
                const audioStream = ytdl(videoInfo.url, { quality: 'highestaudio' });
                const audioFile = fs.createWriteStream(audioTemp);
                audioStream.pipe(audioFile);

                audioFile.on('finish', () => {
                    console.log('音訊下載完成，正在合併檔案...');
                    ffmpeg()
                        .input(videoTemp)
                        .input(audioTemp)
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .toFormat('mp4')
                        .on('end', () => {
                            console.log(`已建立檔案: ${fileName}`);
                            // 清理暫存檔
                            fs.unlinkSync(videoTemp);
                            fs.unlinkSync(audioTemp);
                            resolve();
                        })
                        .on('error', (err: unknown) => {
                            console.error('轉檔失敗:', err);
                            // 出錯也嘗試清理暫存檔
                            if (fs.existsSync(videoTemp)) fs.unlinkSync(videoTemp);
                            if (fs.existsSync(audioTemp)) fs.unlinkSync(audioTemp);
                            reject(err);
                        })
                        .save(filePath);
                });

                audioFile.on('error', (err) => reject(err));
            });

            videoFile.on('error', (err) => reject(err));
        });
    }
}
