interface MbPlayerTrack {
    id: string;
    youtubeId: string;
    title: string;
    duration?: number;
}

interface MbPlayerPlaylist {
    id: string;
    name: string;
    owner?: string;
    thumbnail?: string;
    total: number;
    items: MbPlayerTrack[];
}

const MBPLAYER_LIST_REGEX = /^(?:https?:\/\/)?(?:www\.)?mbplayer\.com\/list\/(\d+)(?:[/?#].*)?$/i;
const NEXT_DATA_REGEX = /<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s;

function extractPlaylistId(value: string): string | null {
    const match = value.match(MBPLAYER_LIST_REGEX);
    return match?.[1] ?? null;
}

export function isMbPlayerPlaylistUrl(value: string): boolean {
    return Boolean(extractPlaylistId(value));
}

export async function fetchMbPlayerPlaylist(value: string): Promise<MbPlayerPlaylist> {
    const playlistId = extractPlaylistId(value);
    if (!playlistId) {
        throw new Error('這不是有效的 MBPlayer 歌單連結。');
    }

    const targetUrl = value.startsWith('http') ? value : `https://www.mbplayer.com/list/${playlistId}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
        throw new Error(`無法讀取 MBPlayer 歌單頁面（HTTP ${response.status}）`);
    }

    const html = await response.text();
    return parseMbPlayerHtml(html, playlistId);
}

function parseMbPlayerHtml(html: string, fallbackId: string): MbPlayerPlaylist {
    const match = html.match(NEXT_DATA_REGEX);
    if (!match) {
        throw new Error('無法從 MBPlayer 頁面擷取 __NEXT_DATA__。');
    }

    let json: any;
    try {
        json = JSON.parse(match[1]);
    } catch (error) {
        throw new Error('無法解析 MBPlayer 內嵌資料。');
    }

    const vector = json?.props?.pageProps?.payload?.getVector;
    if (!vector) {
        throw new Error('找不到 MBPlayer 歌單內容。');
    }

    const rawItems = Array.isArray(vector.musicItems) ? vector.musicItems : vector.items ?? [];

    const tracks: MbPlayerTrack[] = rawItems
        .filter((item: any) => typeof item?.f === 'string' && typeof item?.tt === 'string')
        .map((item: any) => ({
            id: String(item._id ?? ''),
            youtubeId: item.f,
            title: item.tt,
            duration: typeof item.tm === 'number' ? item.tm : undefined,
        }));

    if (!tracks.length) {
        throw new Error('此 MBPlayer 歌單沒有可下載的歌曲。');
    }

    return {
        id: vector.id ?? fallbackId,
        name: vector.name ?? `MBPlayer 歌單 ${vector.id ?? fallbackId}`,
        owner: vector.owner ?? '',
        thumbnail: vector.thumbnail,
        total: typeof vector.total === 'number' ? vector.total : tracks.length,
        items: tracks,
    };
}
