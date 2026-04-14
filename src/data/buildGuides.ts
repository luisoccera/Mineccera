export interface BuildTemplate {
  id: string;
  keywords: string[];
  materials: string[];
  notes: string;
  title: string;
}

export interface WebBuildResult {
  imageUrl?: string;
  source: string;
  summary: string;
  title: string;
  url: string;
}

const templates: BuildTemplate[] = [
  {
    id: 'starter-house',
    keywords: ['starter', 'inicio', 'casa', 'house', 'survival'],
    materials: [
      'Madera: 8-12 stacks',
      'Vidrio: 2-4 stacks',
      'Puerta x2',
      'Cofres x4',
      'Antorchas o faroles x32+',
      'Escaleras y losas para techo',
    ],
    notes: 'Base rapida para early game con almacenamiento y cama.',
    title: 'Casa inicial',
  },
  {
    id: 'castle',
    keywords: ['castillo', 'castle', 'fortaleza', 'fortress'],
    materials: [
      'Piedra/ladrillo de piedra: 20-40 stacks',
      'Andamios para altura',
      'Vallas y escaleras decorativas',
      'Cristal tintado opcional',
      'Iluminacion interior/exterior',
    ],
    notes: 'Proyecto grande, construye por modulos y torres separadas.',
    title: 'Castillo medieval',
  },
  {
    id: 'villager-trading-hall',
    keywords: ['aldeano', 'villager', 'trading hall', 'intercambio'],
    materials: [
      'Aldeanos: 2+ para iniciar',
      'Camas x2+',
      'Bloques de trabajo segun profesion',
      'Vagonetas y rieles',
      'Bloques para celdas',
      'Iluminacion anti-spawn',
    ],
    notes: 'Ideal para libros de encantamiento y esmeraldas estables.',
    title: 'Trading hall de aldeanos',
  },
  {
    id: 'iron-farm',
    keywords: ['hierro', 'iron', 'golem'],
    materials: [
      'Aldeanos x3 minimo',
      'Camas x3',
      'Zombie (name tag recomendado)',
      'Cubetas de agua x2+',
      'Cubeta de lava x1',
      'Tolvas x4 + Cofres x2',
    ],
    notes: 'Protege el zombie del sol y usa slab para evitar spawns fuera de camara.',
    title: 'Granja de hierro',
  },
  {
    id: 'creeper-farm',
    keywords: ['creeper', 'polvora', 'gunpowder'],
    materials: [
      'Gatos x2+',
      'Trapdoors: 6-10 stacks',
      'Losas/botones para filtrar mobs',
      'Tolvas + cofres para recoleccion',
      'Bloques de construccion: 20+ stacks',
    ],
    notes: 'Muy util para cohetes y TNT; considera AFK platform elevada.',
    title: 'Granja de creepers',
  },
  {
    id: 'mob-farm',
    keywords: ['mob', 'xp', 'hostil', 'spawner'],
    materials: [
      'Bloques solidos para plataforma',
      'Trapdoors',
      'Cubetas de agua',
      'Tolvas + cofres',
      'Espadas/Tridente para kill chamber',
    ],
    notes: 'Ilumina cuevas cercanas para mejorar rates.',
    title: 'Granja general de mobs',
  },
  {
    id: 'sugar-cane-farm',
    keywords: ['sugar cane', 'cana de azucar', 'paper'],
    materials: [
      'Observers',
      'Pistons',
      'Redstone dust',
      'Tolvas + cofres',
      'Arena/tierra + agua',
    ],
    notes: 'Automatizacion clasica para papel y cohetes.',
    title: 'Granja automatica de cana',
  },
  {
    id: 'bamboo-farm',
    keywords: ['bamboo', 'bambu', 'wood farm'],
    materials: [
      'Observers',
      'Pistons',
      'Redstone',
      'Tolvas + cofres',
      'Hornos/smokers opcional',
    ],
    notes: 'Buena para combustible y madera procesada.',
    title: 'Granja automatica de bambu',
  },
  {
    id: 'crop-farm',
    keywords: ['trigo', 'carrot', 'potato', 'zanahoria', 'papa', 'cultivo'],
    materials: [
      'Aldeano granjero x1+',
      'Compostador x1',
      'Camas x1+',
      'Tolvas + cofres',
      'Agua + tierra cultivable',
    ],
    notes: 'Facil de mantener y produce comida estable.',
    title: 'Granja de cultivos con aldeano',
  },
  {
    id: 'statue',
    keywords: ['estatua', 'statue', 'pixel art', 'monumento'],
    materials: [
      'Concreto/lana de colores: 10-30 stacks',
      'Andamios',
      'Bloques de contorno',
      'Iluminacion para resaltar',
    ],
    notes: 'Usa capa por capa con plantilla para mantener proporciones.',
    title: 'Estatua / Pixel Art',
  },
];

export function getCommonTemplates(limit = 4): BuildTemplate[] {
  return templates.slice(0, Math.max(1, Math.floor(limit)));
}

const trustedHosts = [
  'duckduckgo.com',
  'www.duckduckgo.com',
  'minecraft.wiki',
  'www.minecraft.net',
  'reddit.com',
  'www.reddit.com',
  'old.reddit.com',
  'www.planetminecraft.com',
  'planetminecraft.com',
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
];

const trustedBuildSubreddits = new Set([
  'minecraft',
  'minecraftbuilds',
  'detailcraft',
  'minecraftfarms',
  'technicalminecraft',
  'redstone',
]);

const buildIntentTerms = [
  'build',
  'farm',
  'house',
  'castle',
  'base',
  'tutorial',
  'blueprint',
  'schematic',
  'statue',
  'pixel art',
  'redstone',
  'automatic',
  'granja',
  'casa',
  'castillo',
  'tutorial',
  'estatua',
  'construccion',
  'automatizada',
];

const noisyTerms = [
  'annoying',
  'pissing',
  'problem',
  'issue',
  'bug',
  'crash',
  'error',
  'rant',
  'drama',
  'hate',
  'frustrated',
];

const stopTokens = new Set([
  'como',
  'para',
  'with',
  'this',
  'that',
  'from',
  'the',
  'and',
  'una',
  'unos',
  'unas',
  'minecraft',
  'build',
  'tutorial',
]);

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const stripHtml = (value: string) => decodeHtml(value.replace(/<[^>]+>/g, '')).trim();

const tokenize = (value: string) =>
  normalize(value)
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 3 && !stopTokens.has(token));

const containsAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

const countTokenHits = (text: string, tokens: string[]) =>
  tokens.reduce((count, token) => (text.includes(token) ? count + 1 : count), 0);

const isTrusted = (url: string) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return trustedHosts.some((trustedHost) => host === trustedHost || host.endsWith(`.${trustedHost}`));
  } catch {
    return false;
  }
};

const isPotentialImageUrl = (url?: string) => {
  if (!url || !url.startsWith('http')) {
    return false;
  }
  const lower = url.toLowerCase();
  if (lower.includes('.gif')) {
    return false;
  }
  return lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp');
};

const flattenDuckTopics = (topics: Array<Record<string, unknown>>) => {
  const flat: Array<{ FirstURL?: string; Text?: string; Icon?: { URL?: string } }> = [];
  topics.forEach((topic) => {
    const nested = topic.Topics;
    if (Array.isArray(nested)) {
      nested.forEach((entry) => flat.push(entry as { FirstURL?: string; Icon?: { URL?: string }; Text?: string }));
      return;
    }
    flat.push(topic as { FirstURL?: string; Icon?: { URL?: string }; Text?: string });
  });
  return flat;
};

const getFallbackResults = (query: string): WebBuildResult[] => {
  const encoded = encodeURIComponent(`${query} minecraft`);
  const encodedTutorial = encodeURIComponent(`${query} minecraft tutorial`);
  const encodedPlanet = encodeURIComponent(query.replace(/\s+/g, '+'));

  return [
    {
      source: 'Planet Minecraft',
      summary: 'Galeria con proyectos, tutoriales y materiales de comunidad.',
      title: 'Buscar proyectos en Planet Minecraft',
      url: `https://www.planetminecraft.com/resources/projects/?keywords=${encodedPlanet}`,
    },
    {
      source: 'YouTube',
      summary: 'Videos paso a paso para construir granjas, casas, estatuas y mas.',
      title: 'Buscar tutoriales en YouTube',
      url: `https://www.youtube.com/results?search_query=${encodedTutorial}`,
    },
    {
      source: 'Minecraft Wiki',
      summary: 'Referencia tecnica de bloques, mecanicas y estructuras.',
      title: 'Buscar en Minecraft Wiki',
      url: `https://minecraft.wiki/?search=${encodeURIComponent(query)}`,
    },
    {
      source: 'Reddit',
      summary: 'Buscador de comunidad para ideas y variaciones del build.',
      title: 'Buscar en Reddit',
      url: `https://www.reddit.com/search/?q=${encoded}`,
    },
    {
      source: 'DuckDuckGo',
      summary: 'Busqueda adicional de recursos confiables.',
      title: 'Busqueda general',
      url: `https://duckduckgo.com/?q=${encodedTutorial}`,
    },
  ];
};

export function findTemplate(query: string): BuildTemplate | null {
  const text = normalize(query);
  if (!text) {
    return null;
  }

  const ranked = templates
    .map((template) => ({
      hits: template.keywords.filter((keyword) => text.includes(normalize(keyword))).length,
      template,
    }))
    .sort((a, b) => b.hits - a.hits);

  if (!ranked.length || ranked[0].hits === 0) {
    return null;
  }

  return ranked[0].template;
}

export async function searchBuildIdeas(query: string): Promise<WebBuildResult[]> {
  const cleanQuery = query.trim();
  const queryTokens = tokenize(cleanQuery);
  const encoded = encodeURIComponent(`${cleanQuery} minecraft build tutorial materiales`);
  const results: WebBuildResult[] = [];

  try {
    const redditRes = await fetch(
      `https://www.reddit.com/search.json?limit=30&t=year&sort=relevance&raw_json=1&q=${encodeURIComponent(
        `${cleanQuery} minecraft build OR farm OR tutorial`,
      )}`,
      { headers: { Accept: 'application/json' } },
    );

    if (redditRes.ok) {
      const redditJson = (await redditRes.json()) as {
        data?: {
          children?: Array<{
            data?: {
              permalink?: string;
              preview?: {
                images?: Array<{
                  source?: { height?: number; url?: string; width?: number };
                }>;
              };
              selftext?: string;
              subreddit?: string;
              thumbnail?: string;
              title?: string;
              url?: string;
            };
          }>;
        };
      };

      const redditCandidates: Array<WebBuildResult & { score: number }> = [];

      (redditJson.data?.children || []).forEach((entry) => {
        const data = entry.data;
        if (!data) {
          return;
        }
        const title = data?.title?.trim();
        const body = data?.selftext?.trim() || '';
        const subreddit = normalize(data?.subreddit || '');
        if (!title) {
          return;
        }

        const mergedText = normalize(`${title} ${body}`);
        if (containsAny(mergedText, noisyTerms)) {
          return;
        }
        if (!containsAny(mergedText, buildIntentTerms)) {
          return;
        }

        const tokenHits = countTokenHits(mergedText, queryTokens);
        if (queryTokens.length > 0 && tokenHits === 0) {
          return;
        }

        const inTrustedBuildSub = trustedBuildSubreddits.has(subreddit);
        if (!inTrustedBuildSub && tokenHits < 2) {
          return;
        }

        const postUrl = data?.permalink ? `https://www.reddit.com${data.permalink}` : data?.url;
        if (!postUrl || !isTrusted(postUrl)) {
          return;
        }

        const preview = data.preview?.images?.[0]?.source;
        const previewUrl = preview?.url ? decodeHtml(preview.url) : undefined;
        const hasGoodPreview =
          !!previewUrl &&
          (preview?.width || 0) >= 500 &&
          (preview?.height || 0) >= 280 &&
          isPotentialImageUrl(previewUrl);

        const thumbnail = data.thumbnail && isPotentialImageUrl(data.thumbnail) ? data.thumbnail : undefined;
        const imageUrl = hasGoodPreview ? previewUrl : thumbnail;

        let score = tokenHits * 3;
        if (inTrustedBuildSub) {
          score += 3;
        }
        if (imageUrl) {
          score += 2;
        }
        if (mergedText.includes('tutorial') || mergedText.includes('step')) {
          score += 1;
        }

        redditCandidates.push({
          imageUrl,
          score,
          source: `Reddit r/${data.subreddit || 'minecraft'}`,
          summary: (body || 'Publicacion de comunidad para referencia de construccion.').slice(0, 180),
          title,
          url: postUrl,
        });
      });

      redditCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .forEach((candidate) => {
          results.push({
            imageUrl: candidate.imageUrl,
            source: candidate.source,
            summary: candidate.summary,
            title: candidate.title,
            url: candidate.url,
          });
        });
    }
  } catch {
    // Keep partial results
  }

  try {
    const wikiRes = await fetch(
      `https://minecraft.wiki/api.php?action=query&list=search&format=json&origin=*&srlimit=8&srsearch=${encoded}`,
    );
    if (wikiRes.ok) {
      const wikiJson = (await wikiRes.json()) as {
        query?: { search?: Array<{ snippet: string; title: string }> };
      };

      (wikiJson.query?.search || []).forEach((item) => {
        const title = stripHtml(item.title);
        const summary = stripHtml(item.snippet);
        const normalized = normalize(`${title} ${summary}`);

        if (queryTokens.length > 0 && countTokenHits(normalized, queryTokens) === 0) {
          return;
        }

        const url = `https://minecraft.wiki/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
        results.push({
          source: 'Minecraft Wiki',
          summary,
          title,
          url,
        });
      });
    }
  } catch {
    // Keep partial results
  }

  try {
    const duckRes = await fetch(`https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=1`);
    if (duckRes.ok) {
      const duckJson = (await duckRes.json()) as {
        RelatedTopics?: Array<Record<string, unknown>>;
      };
      const topics = flattenDuckTopics(duckJson.RelatedTopics || []);

      topics.forEach((topic) => {
        if (!topic.FirstURL || !topic.Text) {
          return;
        }
        if (!isTrusted(topic.FirstURL)) {
          return;
        }

        const summary = stripHtml(topic.Text);
        const normalized = normalize(summary);
        if (!normalized.includes('minecraft')) {
          return;
        }
        if (queryTokens.length > 0 && countTokenHits(normalized, queryTokens) === 0) {
          return;
        }

        results.push({
          source: 'DuckDuckGo (sitio confiable)',
          summary,
          title: summary.slice(0, 90),
          url: topic.FirstURL,
        });
      });
    }
  } catch {
    // Keep partial results
  }

  const unique: WebBuildResult[] = [];
  const seen = new Set<string>();

  results.forEach((result) => {
    if (seen.has(result.url)) {
      return;
    }
    seen.add(result.url);
    unique.push(result);
  });

  getFallbackResults(cleanQuery || 'build').forEach((fallback) => {
    if (seen.has(fallback.url)) {
      return;
    }
    seen.add(fallback.url);
    unique.push(fallback);
  });

  return unique.slice(0, 12);
}
