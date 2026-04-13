import { Platform } from 'react-native';

export interface SkinResult {
  downloadUrl: string;
  id: string;
  previewUrl: string;
  publishedAt: string;
  skinUrl: string;
  title: string;
}

export interface SkinSearchResponse {
  hasNextPage: boolean;
  page: number;
  query: string;
  results: SkinResult[];
  sourceUrl: string;
}

interface ParsedSkinResult {
  downloadUrl: string;
  id: string;
  needsHydration: boolean;
  previewUrl: string;
  publishedAt: string;
  skinUrl: string;
  slug: string;
  title: string;
}

const ALL_ORIGINS_PREFIX = 'https://api.allorigins.win/raw?url=';
const SKINDEX_BASE = 'https://www.minecraftskins.com';

const monthMap: Record<string, string> = {
  Apr: '04',
  Aug: '08',
  Dec: '12',
  Feb: '02',
  Jan: '01',
  Jul: '07',
  Jun: '06',
  Mar: '03',
  May: '05',
  Nov: '11',
  Oct: '10',
  Sep: '09',
};

const cleanQuery = (query: string) =>
  query
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeTitle = (value: string) =>
  value
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const decodeUrl = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const removeQueryHighlight = (line: string) => line.replace(/\*\*/g, '');

const toProxyUrl = (url: string) => `${ALL_ORIGINS_PREFIX}${encodeURIComponent(url)}`;

const toJinaMirrorUrl = (url: string) => `https://r.jina.ai/http://${url.replace(/^https?:\/\//i, '')}`;

const toPreviewUrl = (yyyyMmDd: string, slug: string, id: string) =>
  `https://www.minecraftskins.com/uploads/preview-skins/${yyyyMmDd}/${slug}-${id}.png`;

const toDownloadUrl = (yyyyMmDd: string, slug: string, id: string) =>
  `https://www.minecraftskins.com/uploads/skins/${yyyyMmDd}/${slug}-${id}.png`;

const toDownloadEndpoint = (id: string) => `${SKINDEX_BASE}/skin/download/${id}`;

const normalizeSkinsUrl = (url: string) => {
  const clean = decodeUrl(url).trim().replace(/["')\]]+$/, '');
  if (!clean) {
    return '';
  }

  if (clean.startsWith('//')) {
    return `https:${clean}`;
  }
  if (clean.startsWith('/')) {
    return `${SKINDEX_BASE}${clean}`;
  }
  if (/^http:\/\/www\.minecraftskins\.com/i.test(clean)) {
    return clean.replace(/^http:\/\//i, 'https://');
  }
  return clean;
};

const parseAssetPathFromDownloadUrl = (downloadUrl: string) => {
  const match = /uploads\/skins\/(\d{4})\/(\d{2})\/(\d{2})\//i.exec(downloadUrl);
  if (!match) {
    return null;
  }
  return `${match[1]}-${match[2]}-${match[3]}`;
};

const parseSkinUrl = (line: string) => {
  const match = /\((https:\/\/www\.minecraftskins\.com\/skin\/\d+\/[^)\s]+\/?)\)/i.exec(line);
  return match?.[1] || '';
};

const parseTitle = (line: string) => {
  const match = /###\s*(.+?)\]\(https:\/\/www\.minecraftskins\.com\/skin\//i.exec(line);
  if (!match?.[1]) {
    return '';
  }
  return normalizeTitle(match[1]);
};

const parseSlugAndId = (skinUrl: string) => {
  const match = /\/skin\/(\d+)\/([^/]+)\/?/i.exec(skinUrl);
  return {
    id: match?.[1] || '',
    slug: match?.[2] || '',
  };
};

const parseYahooDate = (line: string) => {
  const match = /\b([A-Z][a-z]{2})\s+(\d{1,2}),\s+(\d{4})\b/.exec(line);
  if (!match) {
    return null;
  }

  const month = monthMap[match[1]];
  const day = match[2].padStart(2, '0');
  const year = match[3];
  if (!month) {
    return null;
  }
  return `${year}/${month}/${day}`;
};

const parseUploadsSkinUrl = (line: string) => {
  const cleaned = removeQueryHighlight(line);
  const match = /(https?:\/\/www\.minecraftskins\.com|\/)?\/?uploads\/skins\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9\-_.]+(?:-\d+)?\.png(?:\?v\d+)?/i.exec(
    cleaned
  );
  return normalizeSkinsUrl(match?.[0] || '');
};

const parsePreviewSkinUrl = (line: string) => {
  const cleaned = removeQueryHighlight(line);
  const match =
    /(https?:\/\/www\.minecraftskins\.com|\/)?\/?uploads\/preview-skins\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9\-_.]+\.png(?:\?v\d+)?/i.exec(
      cleaned
    );
  return normalizeSkinsUrl(match?.[0] || '');
};

const parseDownloadEndpoint = (line: string) => {
  const cleaned = removeQueryHighlight(line);
  const match = /(https?:\/\/www\.minecraftskins\.com)?\/skin\/download\/\d+(?:\?[^)\s"]+)?/i.exec(cleaned);
  return normalizeSkinsUrl(match?.[0] || '');
};

const getUniqueResults = (results: ParsedSkinResult[]) => {
  const seen = new Set<string>();
  const unique: ParsedSkinResult[] = [];
  for (const result of results) {
    if (!result.skinUrl || seen.has(result.skinUrl)) {
      continue;
    }
    seen.add(result.skinUrl);
    unique.push(result);
  }
  return unique;
};

const parseSkinResultsFromYahoo = (markdown: string) => {
  const lines = markdown.split('\n');
  const results: ParsedSkinResult[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line.includes('minecraftskins.com') || !line.includes('/skin/')) {
      continue;
    }

    const skinUrl = decodeUrl(parseSkinUrl(line));
    if (!skinUrl) {
      continue;
    }

    const { id, slug } = parseSlugAndId(skinUrl);
    if (!id || !slug) {
      continue;
    }

    const title = parseTitle(line) || slug.replace(/-/g, ' ');
    const publishedPath = parseYahooDate(line);
    const embeddedDownloadUrl = parseUploadsSkinUrl(line);
    const embeddedPreviewUrl = parsePreviewSkinUrl(line);
    const downloadEndpoint = parseDownloadEndpoint(line);

    let downloadUrl = embeddedDownloadUrl || downloadEndpoint || '';
    let previewUrl = embeddedPreviewUrl;
    let publishedAt = 'N/A';

    if (embeddedDownloadUrl) {
      if (!previewUrl) {
        previewUrl = embeddedDownloadUrl.replace('/uploads/skins/', '/uploads/preview-skins/');
      }
      publishedAt = parseAssetPathFromDownloadUrl(embeddedDownloadUrl) ?? publishedAt;
    } else if (publishedPath) {
      if (!previewUrl) {
        previewUrl = toPreviewUrl(publishedPath, slug, id);
      }
      publishedAt = publishedPath.replace(/\//g, '-');
    }

    results.push({
      downloadUrl,
      id,
      needsHydration: !embeddedDownloadUrl,
      previewUrl,
      publishedAt,
      skinUrl,
      slug,
      title,
    });
  }

  return getUniqueResults(results);
};

const parseHasNext = (markdown: string, currentB: number) => {
  const nextB = currentB + 7;
  const nextRegex = new RegExp(`\\[Next\\]\\([^)]*\\bb=${nextB}\\b`, 'i');
  return nextRegex.test(markdown);
};

const fetchTextWithFallback = async (url: string) => {
  const firstProxy = Platform.OS === 'web';
  const attempts = firstProxy ? [toProxyUrl(url), url] : [url, toProxyUrl(url)];

  let lastError: unknown = null;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt, {
        headers: { Accept: 'text/plain, text/html;q=0.9, */*;q=0.8' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      if (!text.trim()) {
        throw new Error('Respuesta vacia');
      }
      return text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('No fue posible cargar la respuesta remota.');
};

const resolveSkinAssetsFromSkinPage = async (skinUrl: string) => {
  try {
    const mirrorUrl = toJinaMirrorUrl(skinUrl);
    const content = await fetchTextWithFallback(mirrorUrl);
    const directDownload = parseUploadsSkinUrl(content);
    const directPreview = parsePreviewSkinUrl(content);
    const endpointDownload = parseDownloadEndpoint(content);
    const pageIdMatch = /\/skin\/(\d+)\//i.exec(skinUrl);
    const fallbackEndpoint = pageIdMatch?.[1] ? toDownloadEndpoint(pageIdMatch[1]) : '';
    const stableDownload = endpointDownload || fallbackEndpoint;

    if (!directDownload && !stableDownload) {
      return null;
    }
    return {
      downloadUrl: directDownload || stableDownload,
      previewUrl: directPreview || (directDownload ? directDownload.replace('/uploads/skins/', '/uploads/preview-skins/') : ''),
      publishedAt: directDownload ? parseAssetPathFromDownloadUrl(directDownload) ?? 'N/A' : 'N/A',
    };
  } catch {
    return null;
  }
};

const hydrateMissingAssets = async (items: ParsedSkinResult[]) => {
  const hydrated = await Promise.all(
    items.map(async (item) => {
      const hasDirectDownload = /\/uploads\/skins\//i.test(item.downloadUrl);
      if (!item.needsHydration && hasDirectDownload && item.previewUrl) {
        return item;
      }
      const resolved = await resolveSkinAssetsFromSkinPage(item.skinUrl);
      if (!resolved) {
        return item;
      }
      return {
        ...item,
        downloadUrl: resolved.downloadUrl || item.downloadUrl || toDownloadEndpoint(item.id),
        needsHydration: false,
        previewUrl: resolved.previewUrl || item.previewUrl,
        publishedAt: resolved.publishedAt,
      };
    })
  );

  return hydrated;
};

export async function searchMinecraftSkins(query: string, page = 1): Promise<SkinSearchResponse> {
  const normalizedQuery = cleanQuery(query);
  if (!normalizedQuery) {
    return {
      hasNextPage: false,
      page: 1,
      query: '',
      results: [],
      sourceUrl: '',
    };
  }

  const b = Math.max(1, (page - 1) * 7 + 1);
  const searchQuery = `site:www.minecraftskins.com/skin/ ${normalizedQuery}`;
  const sourceUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(searchQuery)}&b=${b}&pz=7`;
  const mirrorUrl = toJinaMirrorUrl(sourceUrl);

  const markdown = await fetchTextWithFallback(mirrorUrl);
  const parsed = parseSkinResultsFromYahoo(markdown);
  const hydrated = await hydrateMissingAssets(parsed.slice(0, 14));
  const hasNextPage = parseHasNext(markdown, b);

  const results: SkinResult[] = hydrated
    .map((entry) => ({
      downloadUrl: normalizeSkinsUrl(entry.downloadUrl) || toDownloadEndpoint(entry.id),
      id: entry.id,
      previewUrl: normalizeSkinsUrl(entry.previewUrl),
      publishedAt: entry.publishedAt,
      skinUrl: normalizeSkinsUrl(entry.skinUrl),
      title: entry.title,
    }))
    .filter((entry) => Boolean(entry.skinUrl && entry.downloadUrl));

  return {
    hasNextPage,
    page,
    query: normalizedQuery,
    results,
    sourceUrl,
  };
}
