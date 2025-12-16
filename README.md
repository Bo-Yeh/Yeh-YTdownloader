# YouTube Downloader (MP3/MP4)

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)

> 👋 使用 **TypeScript** 撰寫的 YouTube 影片下載工具  
> 一個簡單而強大的命令列程式，可下載 YouTube 影片並轉換為 **MP3** 或 **MP4** 格式

## 🌟 主要特色

- **🎯 互動式 CLI**：簡單的命令列介面，輸入連結、選擇格式即可開始轉檔
- **📝 智能檔名**：自動抓取影片標題，並清理非法字元，避免檔案覆蓋
- **🎵 MP3 轉換**：預設 128kbps，支援自訂 bitrate
- **🎬 MP4 轉換**：自動合併音訊與影像，避免「只有畫面沒聲音」的問題
- **📋 歌單支援**：支援 MBPlayer 歌單 URL，自動擷取全部曲目並逐一轉檔
- **⚡ 跨平台**：內建 ffmpeg，Windows/macOS/Linux 開箱即用
- **🔒 開源**：MIT 授權，完全開源

## 📋 核心依賴

| 套件 | 用途 |
|------|------|
| [`ffmpeg-static`](https://github.com/eugeneware/ffmpeg-static) | 跨平台 ffmpeg 二進位檔案 |
| [`fluent-ffmpeg`](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) | 影片/音訊轉檔處理 |
| [`yt-dlp-wrap`](https://github.com/AlexTa69/yt-dlp-wrap) | YouTube 影片下載與解析 |
| [`@distube/ytdl-core`](https://github.com/distubejs/ytdl-core) | YouTube 影片串流擷取 |

## 📦 系統需求

- **Node.js**: v18 或更新版本（建議使用 LTS 版本）
- **npm**: v8 或更新版本
- **ffmpeg**：已內建於 `ffmpeg-static`，無需額外安裝（部分平台可能需要系統依賴）

## 📂 專案結構

```
Yeh-YTdownloader/
├── src/
│   ├── main.ts                 # CLI 主入口
│   ├── custom.d.ts             # TypeScript 型別聲明
│   ├── utils/
│   │   ├── converter.ts        # 核心轉檔邏輯
│   │   └── mbplayer.ts         # MBPlayer 歌單解析
│   └── types/
│       └── index.ts            # 型別定義
├── dist/                       # 編譯後的 JavaScript（npm run build 生成）
├── downloads/                  # 輸出目錄（自動建立）
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速開始

### 1️⃣ 克隆專案

```bash
git clone https://github.com/Bo-Yeh/Yeh-YTdownloader.git
cd Yeh-YTdownloader
```

### 2️⃣ 安裝依賴

```bash
npm install
```

### 3️⃣ 執行程式

```bash
npm start
```

## 📖 使用說明

### 基本使用

執行 `npm start` 後，遵循以下步驟：

```
請輸入YouTube影片連結：https://www.youtube.com/watch?v=dQw4w9WgXcQ
請選擇轉換格式 (mp3/mp4)：mp3
```

程式會自動：
1. 抓取影片資訊（標題、時長等）
2. 清理檔名中的非法字元
3. 下載影片串流
4. 轉檔至指定格式
5. 儲存至 `./downloads/` 目錄

### 下載 MBPlayer 歌單

程式內建支援 MBPlayer 歌單：

```
請輸入MBPlayer歌單連結或YouTube影片連結：https://www.mbplayer.com/list/198573651
請選擇轉換格式 (mp3/mp4)：mp3
```

程式會自動：
1. 解析歌單中的所有歌曲
2. 逐一從 YouTube 下載
3. 轉檔並儲存至 `./downloads/`

### 執行編譯後的版本

如需直接執行 JavaScript（不依賴 TypeScript 編譯）：

```bash
npm run build          # 編譯 TypeScript 至 dist/
npm run start:dist     # 執行編譯後的 JavaScript
```

## 🛠️ 開發指南

### 可用的 npm 指令

| 指令 | 說明 |
|------|------|
| `npm start` | 執行 TypeScript 程式（使用 ts-node） |
| `npm run build` | 編譯 TypeScript 至 dist/ 目錄 |
| `npm run start:dist` | 執行編譯後的 JavaScript 版本 |
| `npm run typecheck` | 進行型別檢查（如可用） |

### 專案配置

- **TypeScript 設定**：參見 `tsconfig.json`
- **輸出格式**：
  - **MP3**：預設 128kbps（可在 `src/utils/converter.ts` 調整）
  - **MP4**：H.264 video + AAC audio

## ⚙️ 自訂配置

### 修改 MP3 品質

編輯 `src/utils/converter.ts`：

```typescript
ffmpeg(stream)
    .audioBitrate(192)  // 改為 192kbps（預設 128）
    .toFormat('mp3')
    // ...
```

### 使用系統 ffmpeg（而非 ffmpeg-static）

編輯 `src/utils/converter.ts`：

```typescript
// 註解此行
// ffmpeg.setFfmpegPath(ffmpegPath);

// 替換為系統 ffmpeg 路徑
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');  // Linux/macOS
ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');  // Windows
```

## 🐛 常見問題

### ❌ 「找不到 ffmpeg」或轉檔失敗

**原因**：某些平台上 `ffmpeg-static` 可能無法執行

**解決方案**：安裝系統 ffmpeg

```bash
# macOS (Homebrew)
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows (Chocolatey)
choco install ffmpeg

# Windows (Scoop)
scoop install ffmpeg
```

安裝後修改 `src/utils/converter.ts` 使用系統 ffmpeg 路徑。

### ❌ 「Could not extract functions」或影片無法解析

**原因**：YouTube 定期更新防護機制，ytdl-core 需要更新

**解決方案**：

```bash
npm update
npm install @distube/ytdl-core@latest
```

某些影片（受限、年齡限制、區域鎖定）可能無法下載。

### ❌ Windows 檔名錯誤或亂碼

**原因**：Windows 系統對檔案名稱有特殊限制

**情況**：已內建移除 `<>:"/\|?*` 等非法字元，通常無需操心

**建議**：避免過長或含有特殊控制字元的影片標題。

### ❌ 「cannot find module」錯誤

**原因**：依賴未安裝或版本衝突

**解決方案**：

```bash
rm -rf node_modules package-lock.json  # 或 Windows: rmdir /s node_modules
npm install
```

## 🗺️ 未來計畫

- [ ] 指令列參數支援（可直接指定 URL、格式、輸出目錄，不用互動）
- [ ] 自訂 MP3 bitrate / MP4 編碼設定（CLI 選項）
- [ ] Proxy 與 Cookies 支援（用於特定受限影片）
- [ ] 單元測試 & GitHub Actions CI/CD
- [ ] 進度條顯示（下載與轉檔進度）
- [ ] GUI 版本（Electron/web 介面）

## 📜 法律聲明

**重要**：請務必遵守 YouTube 服務條款與當地著作權法規。

- 本工具僅供 **個人學習與研究用途**
- 請勿用於下載未獲授權或受保護的內容
- 使用者需自行承擔使用本工具所產生的任何法律責任與後果

## 📄 授權

本專案採用 **MIT 授權**，詳見 [LICENSE](LICENSE) 檔案。

## 🙏 致謝

感謝以下開源專案的貢獻：

- [`@distube/ytdl-core`](https://github.com/distubejs/ytdl-core)：YouTube 串流擷取
- [`yt-dlp-wrap`](https://github.com/AlexTa69/yt-dlp-wrap)：影片資訊解析
- [`fluent-ffmpeg`](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)：媒體轉檔
- [`ffmpeg-static`](https://github.com/eugeneware/ffmpeg-static)：跨平台 ffmpeg 支援

## 🤝 貢獻

歡迎提交 Pull Request 或開啟 Issue！

## 📧 聯絡方式

有任何問題或建議，歡迎：
- 開啟 [GitHub Issues](https://github.com/Bo-Yeh/Yeh-YTdownloader/issues)
- 提交 Pull Request

---

**更新時間**：2025年12月  
**版本**：1.0.0
