# YouTube Downloader (MP3/MP4)

👋 Yeh 的第一個小工具，使用 **TypeScript** 撰寫。  
這是一個簡單的命令列程式，可下載 YouTube 影片並轉換為 **MP3** 或 **MP4**。  

內建：
- [`ffmpeg-static`](https://github.com/eugeneware/ffmpeg-static)：跨平台 ffmpeg 二進位
- [`fluent-ffmpeg`](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)：影片/音訊處理
- [`@distube/ytdl-core`](https://github.com/distubejs/ytdl-core)：解析 YouTube 影片串流

---

## ✨ 功能特色
- 互動式 CLI：輸入連結、選擇 mp3/mp4 即可轉檔  
- 自動抓取影片標題，並清理非法字元，避免覆蓋檔案  
- MP3：128kbps（可在程式碼內調整）  
- MP4：自動合併音訊與影像，避免「只有畫面沒聲音」  
- 輸出目錄：`./downloads/`

---

## 📦 系統需求
- Node.js **v18+** (建議 LTS)
- ffmpeg（已隨 `ffmpeg-static` 內建，無需額外安裝）

---

## 📂 專案結構

```
youtube-downloader
├── src
│   ├── main.ts         # CLI 入口
│   ├── utils
│   │   └── converter.ts # 下載/轉檔邏輯
│   └── types
│       └── index.ts    # 型別定義
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ 安裝

```bash
git clone https://github.com/<your-username>/youtube-downloader.git
cd youtube-downloader
npm install
```

## 🚀 使用方法

```bash
npm start
```

## 操作流程

1. 貼上 YouTube 影片連結（支援一般 watch URL）
2. 選擇輸出格式 MP3 或 MP4
3. 完成後檔案會在 `./downloads/` 下，檔名為影片標題（已移除非法字元）

需要直接以編譯後的 JS 執行？請先執行
```bash
npm run build
npm run start:dist
``` 

## 🛠️ 疑難排解

1. **Could not extract functions / 解析失敗**
   - 我們使用的是 `@distube/ytdl-core`，通常能跟上 YouTube 變動。若仍失敗：
     - 執行 `npm outdated`、`npm update`，確認 `@distube/ytdl-core` 為最新。
     - 某些受限/年齡限制/區域鎖定影片可能無法解析。

2. **ffmpeg 找不到或輸出失敗**
   - 預設用 `ffmpeg-static` 自帶二進位；若你的平台不支援，請安裝系統 ffmpeg：
     - **macOS（Homebrew）**：`brew install ffmpeg`
     - **Linux（Debian/Ubuntu）**：`sudo apt-get install ffmpeg`
     - **Windows（scoop/choco）**：`scoop install ffmpeg` 或 `choco install ffmpeg`
   - 然後在 `converter.ts` 裡改用系統 ffmpeg 路徑（`ffmpeg.setFfmpegPath(...)`）。

3. **Windows 檔名/編碼問題**
   - 我們已移除 `<>:\"/\\|?*` 等非法字元，仍建議避免過長或含特殊控制字元的標題。

## 🧑‍💻 開發

### 編譯到 dist/

```bash
npm run build
```

### 執行編譯後版本

```bash
npm run start:dist
```

### 型別檢查

```bash
npm run typecheck
```

## 路線圖

- 指令列參數（URL 與格式不用互動、可直接下 `-f mp3 -o <dir>`）
- 自訂 MP3 bitrate / MP4 編碼設定
- Proxy / Cookies 支援（用於特定受限影片）
- 單元測試 & GitHub Actions

## 法律聲明

請務必遵守 YouTube 服務條款與著作權法規。本工具僅供個人學習與研究用途，請勿用於下載未獲授權的受保護內容。使用者需自行承擔使用風險與法律責任。

## 授權

MIT

## 致謝

- `@distube/ytdl-core`
- `fluent-ffmpeg`
- `ffmpeg-static`
