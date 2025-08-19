# YouTube Downloader (MP3/MP4)
Yeh軟體小白的首個小工具撰寫，當中許多不足還請前輩指點。

一個使用 TypeScript 撰寫的命令列工具，能讀取 YouTube 影片，輸出為 **MP3** 或 **MP4**。  
內建 `ffmpeg-static`（跨平台 ffmpeg 二進位）與 `fluent-ffmpeg`，並採用 `@distube/ytdl-core` 以提升與 YouTube 更新的相容性。

## 功能特色
- 互動式 CLI：貼上連結、選擇 mp3/mp4 即可開始轉檔
- 自動抓取影片標題並**清理非法字元**，檔名不會互相覆蓋
- MP3：128kbps（可在程式碼內調整）
- MP4：自動**合併影像軌與音訊軌**，避免「只有畫面沒聲音」
- 產出目錄：`./downloads/`

## 需求
- Node.js（建議 **v18+** / LTS）
- 系統上不需要預先安裝 ffmpeg——本專案使用 `ffmpeg-static`。若某些平台沒有對應二進位，請改裝系統 ffmpeg 並調整程式碼 PATH（見「疑難排解」）。

## 專案結構
youtube-downloader
├── src
│ ├── main.ts # CLI 入口
│ ├── utils
│ │ └── converter.ts # 下載/轉檔邏輯
│ └── types
│ └── index.ts # 型別定義
├── package.json
├── tsconfig.json
└── README.md


## 安裝
git clone https://github.com/<your-username>/youtube-downloader.git
cd youtube-downloader
npm install


# 互動式執行
npm start


# 操作流程：

貼上 YouTube 影片連結（支援一般 watch URL）

選擇輸出格式 mp3 或 mp4

完成後檔案會在 ./downloads/ 下，檔名為影片標題（已移除非法字元）

需要直接以編譯後的 JS 執行？請先 npm run build，之後 npm run start:dist。

# 疑難排解
1) Could not extract functions / 解析失敗
我們使用的是 @distube/ytdl-core，通常能跟上 YouTube 變動。若仍失敗：

執行 npm outdated、npm update，確認 @distube/ytdl-core 為最新

某些受限/年齡限制/區域鎖定影片可能無法解析

2) ffmpeg 找不到或輸出失敗
預設用 ffmpeg-static 自帶二進位；若你的平台不支援，請安裝系統 ffmpeg：

macOS（Homebrew）：brew install ffmpeg

Linux（Debian/Ubuntu）：sudo apt-get install ffmpeg

Windows（scoop/choco）：scoop install ffmpeg 或 choco install ffmpeg

然後在 converter.ts 裡改用系統 ffmpeg 路徑（ffmpeg.setFfmpegPath(...)）

3) Windows 檔名/編碼問題
我們已移除 <>:"/\|?* 等非法字元，仍建議避免過長或含特殊控制字元的標題

# 開發

## 編譯到 dist/
npm run build

## 執行編譯後版本
npm run start:dist

## 型別檢查
npm run typecheck

## 路線圖
- 指令列參數（URL 與格式不用互動、可直接下 -f mp3 -o <dir>）
- 自訂 MP3 bitrate / MP4 編碼設定
- Proxy / Cookies 支援（用於特定受限影片）
- 單元測試 & GitHub Actions

## 法律聲明
請務必遵守 YouTube 服務條款與著作權法規。本工具僅供個人學習與研究用途，請勿用於下載未獲授權的受保護內容。使用者需自行承擔使用風險與法律責任。

## 授權
MIT

## 致謝
- @distube/ytdl-core

- fluent-ffmpeg

- ffmpeg-static
