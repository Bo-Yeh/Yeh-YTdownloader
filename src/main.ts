import * as readline from 'readline';
import Converter from './utils/converter';
import { VideoInfo } from './types';
import ytdl from '@distube/ytdl-core';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const converter = new Converter();

function promptUser() {
    rl.question('請輸入YouTube影片連結：', (url) => {
        rl.question('請選擇轉換格式 (mp3/mp4)：', async (format) => {
            try {
                const safeFormat: 'mp3' | 'mp4' = format === 'mp3' ? 'mp3' : 'mp4';
                
                // 抓取影片資訊
                const info = await ytdl.getInfo(url);
                const title = info.videoDetails.title;

                const videoInfo: VideoInfo = { title, url, format: safeFormat };
                await handleConversion(videoInfo);
            } catch (err) {
                console.error('無法取得影片資訊:', err);
                rl.close();
            }
        });
    });
}

async function handleConversion(videoInfo: VideoInfo) {
    if (videoInfo.format === 'mp3') {
        converter.convertToMp3(videoInfo)
            .then(() => {
                console.log('轉換完成，已儲存為 mp3 格式。');
                rl.close();
            })
            .catch((err: unknown) => {
                console.error('轉換失敗:', err);
                rl.close();
            });
    } else if (videoInfo.format === 'mp4') {
        converter.convertToMp4(videoInfo)
            .then(() => {
                console.log('轉換完成，已儲存為 mp4 格式。');
                rl.close();
            })
            .catch((err: unknown) => {
                console.error('轉換失敗:', err);
                rl.close();
            });
    } else {
        console.log('無效的格式選擇。請選擇 mp3 或 mp4。');
        rl.close();
    }
}

promptUser();
