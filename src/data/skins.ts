export interface SkinResult {
  downloadUrl: string;
  id: string;
  previewUrl: string;
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

const ensureHttps = (url: string) => url.replace(/^http:\/\//i, 'https://');

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const normalizeTitle = (value: string) => decodeHtml(value.replace(/\s+/g, ' ').trim());

const extractIdFromSkinUrl = (skinUrl: string) => {
  const match = /\/skin\/(\d+)\//i.exec(skinUrl);
  return match?.[1] || skinUrl;
};

const titleFromSkinUrl = (skinUrl: string) => {
  const match = /\/skin\/\d+\/([^/]+)\//i.exec(skinUrl);
  if (!match?.[1]) {
    return 'Skin';
  }
  return normalizeTitle(match[1].replace(/-/g, ' '));
};

const deriveDownloadUrl = (previewUrl: string) => {
  const httpsPreview = ensureHttps(previewUrl);
  return httpsPreview.replace('/uploads/preview-skins/', '/uploads/skins/');
};

const parseHasNext = (markdown: string, page: number) => {
  const explicitNext = new RegExp(
    `\\[>\\]\\(https?:\\/\\/www\\.minecraftskins\\.com\\/search\\/skin\\/[^)]+\\/${page + 1}\\/\\)`,
    'i',
  ).test(markdown);

  if (explicitNext) {
    return true;
  }

  let maxSeen = page;
  const pageRegex = /https?:\/\/www\.minecraftskins\.com\/search\/skin\/[^/]+\/(\d+)\//gi;
  let match = pageRegex.exec(markdown);
  while (match) {
    const pageValue = Number(match[1] || page);
    if (Number.isFinite(pageValue)) {
      maxSeen = Math.max(maxSeen, pageValue);
    }
    match = pageRegex.exec(markdown);
  }
  return maxSeen > page;
};

const parseResults = (markdown: string): SkinResult[] => {
  const results: SkinResult[] = [];
  const seen = new Set<string>();

  const cardRegex =
    /\[\!\[Image\s+\d+(?::\s*([^\]]*))?\]\((https?:\/\/www\.minecraftskins\.com\/uploads\/preview-skins\/[^)\s]+)\)\]\((https?:\/\/www\.minecraftskins\.com\/skin\/\d+\/[^)\s]+)\)/gi;

  let match = cardRegex.exec(markdown);
  while (match) {
    const altTitle = normalizeTitle(match[1] || '');
    const previewUrl = ensureHttps(match[2] || '');
    const skinUrl = ensureHttps(match[3] || '');

    if (!previewUrl || !skinUrl || seen.has(skinUrl)) {
      match = cardRegex.exec(markdown);
      continue;
    }

    const nearText = markdown.slice(cardRegex.lastIndex, cardRegex.lastIndex + 260);
    const titleLinkMatch = /\n\[(.+?)\]\((https?:\/\/www\.minecraftskins\.com\/skin\/\d+\/[^)\s]+)\)/i.exec(nearText);
    const linkedTitleUrl = ensureHttps(titleLinkMatch?.[2] || '');
    const linkedTitle = normalizeTitle(titleLinkMatch?.[1] || '');

    const title = linkedTitleUrl === skinUrl && linkedTitle ? linkedTitle : altTitle || titleFromSkinUrl(skinUrl);

    seen.add(skinUrl);
    results.push({
      downloadUrl: deriveDownloadUrl(previewUrl),
      id: extractIdFromSkinUrl(skinUrl),
      previewUrl,
      skinUrl,
      title,
    });

    match = cardRegex.exec(markdown);
  }

  return results;
};

export async function searchMinecraftSkins(query: string, page = 1): Promise<SkinSearchResponse> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {
      hasNextPage: false,
      page,
      query: cleanQuery,
      results: [],
      sourceUrl: '',
    };
  }

  const encodedQuery = encodeURIComponent(cleanQuery);
  const sourceUrl = `https://www.minecraftskins.com/search/skin/${encodedQuery}/${page}/`;
  const proxyUrl = `https://r.jina.ai/http://www.minecraftskins.com/search/skin/${encodedQuery}/${page}/`;

  const response = await fetch(proxyUrl, {
    headers: { Accept: 'text/plain' },
  });

  if (!response.ok) {
    throw new Error(`No se pudo consultar skins (${response.status}).`);
  }

  const markdown = await response.text();
  const results = parseResults(markdown);
  const hasNextPage = parseHasNext(markdown, page);

  return {
    hasNextPage,
    page,
    query: cleanQuery,
    results,
    sourceUrl,
  };
}
