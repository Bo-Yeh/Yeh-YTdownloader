import { VideoInfo } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import YTDlpWrap from 'yt-dlp-wrap';

if (!ffmpegPath) {
    throw new Error("找不到 ffmpeg，請確認已安裝 ffmpeg 或安裝 ffmpeg-static。");
}
ffmpeg.setFfmpegPath(ffmpegPath);

export default class Converter {
    private ytDlp: YTDlpWrap;

    constructor() {
        // yt-dlp 會自動下載到專案目錄
        this.ytDlp = new YTDlpWrap();
    }

    private getOutputPath(fileName: string) {
        const outputDir = path.resolve(process.cwd(), 'downloads');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
        return path.join(outputDir, fileName);
    }

    private async retryOperation<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 2000
    ): Promise<T> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`重試 ${i + 1}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error('超過最大重試次數');
    }

    async convertToMp3(videoInfo: VideoInfo): Promise<void> {
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]+/g, '');
        const fileName = `${safeTitle || 'output'}.mp3`;
        const filePath = this.getOutputPath(fileName);

        return this.retryOperation(async () => {
            console.log(`正在下載: ${fileName}`);
            
            await this.ytDlp.execPromise([
                videoInfo.url,
                '-x',                           // 只下載音訊
                '--audio-format', 'mp3',        // 轉換為 mp3
                '--audio-quality', '0',         // 最高音質
                '-o', filePath,                 // 輸出路徑
                '--no-playlist',                // 不下載播放清單
                '--quiet',                      // 安靜模式
                '--no-warnings',                // 不顯示警告
                '--add-metadata',               // 添加元數據
            ]);

            console.log(`已建立檔案: ${fileName}`);
        });
    }

    async convertToMp4(videoInfo: VideoInfo): Promise<void> {
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]+/g, '');
        const fileName = `${safeTitle || 'output'}.mp4`;
        const filePath = this.getOutputPath(fileName);

        return this.retryOperation(async () => {
            console.log(`正在下載: ${fileName}`);
            
            await this.ytDlp.execPromise([
                videoInfo.url,
                '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', // 最佳畫質
                '-o', filePath,
                '--merge-output-format', 'mp4', // 合併為 mp4
                '--no-playlist',
                '--quiet',
                '--no-warnings',
                '--add-metadata',
            ]);

            console.log(`已建立檔案: ${fileName}`);
        });
    }
}