import * as readline from 'readline';
import Converter from './utils/converter';
import { VideoInfo } from './types';
import { fetchMbPlayerPlaylist, isMbPlayerPlaylistUrl } from './utils/mbplayer';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const converter = new Converter();

const askQuestion = (message: string): Promise<string> =>
    new Promise((resolve) => rl.question(message, (answer) => resolve(answer.trim())));

async function handleConversion(videoInfo: VideoInfo): Promise<void> {
    try {
        if (videoInfo.format === 'mp3') {
            await converter.convertToMp3(videoInfo);
            console.log('轉換完成，已儲存為 mp3。');
        } else if (videoInfo.format === 'mp4') {
            await converter.convertToMp4(videoInfo);
            console.log('轉換完成，已儲存為 mp4。');
        } else {
            throw new Error('未支援的格式。');
        }
    } catch (error) {
        console.error(`處理 "${videoInfo.title}" 時發生錯誤:`, error instanceof Error ? error.message : error);
        // 繼續處理，不中斷整個程式
    }
}

// 從 YouTube URL 提取影片 ID
function extractVideoId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
        /youtube\.com\/embed\/([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

async function run(): Promise<void> {
    try {
        const input = await askQuestion('請輸入 YouTube 影片連結或 MBPlayer 歌單連結：');
        if (!input) {
            console.log('未輸入連結，程式結束。');
            return;
        }

        const formatAnswer = await askQuestion('請選擇轉換格式 (mp3/mp4)：');
        const format: 'mp3' | 'mp4' = formatAnswer.toLowerCase() === 'mp3' ? 'mp3' : 'mp4';

        if (isMbPlayerPlaylistUrl(input)) {
            const playlist = await fetchMbPlayerPlaylist(input);
            console.log(`偵測到歌單 "${playlist.name}"，共 ${playlist.items.length} 首歌曲。`);

            let successCount = 0;
            let failCount = 0;

            for (const [index, track] of playlist.items.entries()) {
                console.log(`\n[${index + 1}/${playlist.items.length}] ${track.title}`);
                const videoInfo: VideoInfo = {
                    title: track.title,
                    url: `https://www.youtube.com/watch?v=${track.youtubeId}`,
                    format
                };

                try {
                    await handleConversion(videoInfo);
                    successCount++;
                } catch (error) {
                    failCount++;
                    console.error(`跳過此歌曲，繼續處理下一首...`);
                }
            }

            console.log(`\n已完成所有歌單歌曲的轉檔。成功: ${successCount}, 失敗: ${failCount}`);
        } else {
            // 處理單一 YouTube 影片
            const videoId = extractVideoId(input);
            if (!videoId) {
                console.error('無效的 YouTube 連結');
                return;
            }

            const videoInfo: VideoInfo = {
                title: videoId, // yt-dlp 會自動取得正確的標題
                url: input,
                format
            };

            await handleConversion(videoInfo);
        }
    } catch (error) {
        console.error('發生錯誤：', error instanceof Error ? error.message : error);
    } finally {
        rl.close();
    }
}

run();