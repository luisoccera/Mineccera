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
  previewUrl: string;
  publishedAt: string;
  skinUrl: string;
  slug: string;
  title: string;
}

const ALL_ORIGINS_PREFIX = 'https://api.allorigins.win/raw?url=';

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
  const match =
    /https:\/\/www\.minecraftskins\.com\/uploads\/skins\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9\-_.]+-\d+\.png/i.exec(cleaned);
  return match?.[0] || '';
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

    let downloadUrl = '';
    let previewUrl = '';
    let publishedAt = 'N/A';

    if (embeddedDownloadUrl) {
      downloadUrl = embeddedDownloadUrl;
      previewUrl = embeddedDownloadUrl.replace('/uploads/skins/', '/uploads/preview-skins/');
      publishedAt = parseAssetPathFromDownloadUrl(downloadUrl) ?? publishedAt;
    } else if (publishedPath) {
      downloadUrl = toDownloadUrl(publishedPath, slug, id);
      previewUrl = toPreviewUrl(publishedPath, slug, id);
      publishedAt = publishedPath.replace(/\//g, '-');
    }

    results.push({
      downloadUrl,
      id,
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
    if (!directDownload) {
      return null;
    }
    return {
      downloadUrl: directDownload,
      previewUrl: directDownload.replace('/uploads/skins/', '/uploads/preview-skins/'),
      publishedAt: parseAssetPathFromDownloadUrl(directDownload) ?? 'N/A',
    };
  } catch {
    return null;
  }
};

const hydrateMissingAssets = async (items: ParsedSkinResult[]) => {
  const hydrated = await Promise.all(
    items.map(async (item) => {
      if (item.downloadUrl && item.previewUrl) {
        return item;
      }
      const resolved = await resolveSkinAssetsFromSkinPage(item.skinUrl);
      if (!resolved) {
        return item;
      }
      return {
        ...item,
        downloadUrl: resolved.downloadUrl,
        previewUrl: resolved.previewUrl,
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
      downloadUrl: entry.downloadUrl,
      id: entry.id,
      previewUrl: entry.previewUrl,
      publishedAt: entry.publishedAt,
      skinUrl: decodeUrl(entry.skinUrl),
      title: entry.title,
    }))
    .filter((entry) => Boolean(entry.skinUrl && (entry.previewUrl || entry.downloadUrl)));

  return {
    hasNextPage,
    page,
    query: normalizedQuery,
    results,
    sourceUrl,
  };
}
