import * as Linking from 'expo-linking';
import { useEffect, useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import { searchMinecraftSkins, type SkinResult } from '../data/skins';

const FEATURED_SKINS_QUERY = 'latest';
const FEATURED_SKINS_TARGET = 50;

const dedupeSkins = (items: SkinResult[]) => {
  const seen = new Set<string>();
  const unique: SkinResult[] = [];
  for (const item of items) {
    const key = item.skinUrl || item.id;
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(item);
  }
  return unique;
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'No se pudo cargar MinecraftSkins en este momento. Intenta de nuevo.';
};

const absoluteExternalUrl = (url: string) => {
  const clean = (url || '').trim();
  if (!clean) {
    return '';
  }
  if (clean.startsWith('http://')) {
    return clean.replace(/^http:\/\//i, 'https://');
  }
  if (clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('//')) {
    return `https:${clean}`;
  }
  if (clean.startsWith('/')) {
    return `https://www.minecraftskins.com${clean}`;
  }
  return `https://${clean}`;
};

const toDownloadFetchCandidates = (url: string) => {
  const absolute = absoluteExternalUrl(url);
  if (!absolute) {
    return [];
  }

  const candidates = [absolute];
  candidates.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(absolute)}`);
  candidates.push(`https://corsproxy.io/?${encodeURIComponent(absolute)}`);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    unique.push(candidate);
  }
  return unique;
};

const toDownloadFilename = (item: SkinResult) => {
  const safeTitle = (item.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${safeTitle || `skin-${item.id}`}.png`;
};

const getPreferredDownloadUrl = (item: SkinResult) => {
  const direct = absoluteExternalUrl(item.downloadUrl);
  if (direct) {
    return direct;
  }
  return `https://www.minecraftskins.com/skin/download/${item.id}`;
};

export function SkinScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const cardsPerRow = deviceClass === 'xl' || deviceClass === 'desktop' ? 4 : compact ? 2 : 3;
  const cardWidth = cardsPerRow === 4 ? '24.2%' : cardsPerRow === 3 ? '32.2%' : '49%';

  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [results, setResults] = useState<SkinResult[]>([]);
  const [isFeaturedMode, setIsFeaturedMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});

  const resultCount = results.length;
  const canLoadMore = hasNextPage && !loading && !loadingMore && !loadingAll;

  const statusLine = useMemo(() => {
    if (!activeQuery) {
      return 'Cargando skins del momento...';
    }
    if (isFeaturedMode) {
      return `Skins del momento cargadas: ${resultCount} | Puedes elegir una o buscar algo especifico.`;
    }
    return `Consulta: "${activeQuery}" | Pagina actual: ${page} | Resultados: ${resultCount}`;
  }, [activeQuery, isFeaturedMode, page, resultCount]);

  const loadFeaturedSkins = async () => {
    setLoading(true);
    setError('');
    setBrokenImages({});

    try {
      let currentPage = 1;
      let hasNext = true;
      let collected: SkinResult[] = [];
      const maxPages = 8;

      while (hasNext && collected.length < FEATURED_SKINS_TARGET && currentPage <= maxPages) {
        const response = await searchMinecraftSkins(FEATURED_SKINS_QUERY, currentPage);
        collected = dedupeSkins([...collected, ...response.results]);
        hasNext = response.hasNextPage;
        currentPage += 1;
      }

      const limited = collected.slice(0, FEATURED_SKINS_TARGET);
      setResults(limited);
      setActiveQuery(FEATURED_SKINS_QUERY);
      setPage(Math.max(1, currentPage - 1));
      setHasNextPage(hasNext);
      setIsFeaturedMode(true);
    } catch (searchError) {
      setResults([]);
      setHasNextPage(false);
      setPage(1);
      setActiveQuery('');
      setIsFeaturedMode(false);
      setError(toErrorMessage(searchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedSkins();
  }, []);

  const runSearch = async () => {
    const clean = query.trim();
    if (!clean) {
      return;
    }

    setLoading(true);
    setError('');
    setBrokenImages({});

    try {
      const response = await searchMinecraftSkins(clean, 1);
      setActiveQuery(response.query || clean.toLowerCase());
      setPage(response.page);
      setHasNextPage(response.hasNextPage);
      setResults(dedupeSkins(response.results));
      setIsFeaturedMode(false);
    } catch (searchError) {
      setResults([]);
      setHasNextPage(false);
      setPage(1);
      setActiveQuery(clean.toLowerCase());
      setIsFeaturedMode(false);
      setError(toErrorMessage(searchError));
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!activeQuery || !canLoadMore) {
      return;
    }

    setLoadingMore(true);
    setError('');

    try {
      const nextPage = page + 1;
      const response = await searchMinecraftSkins(activeQuery, nextPage);
      setPage(response.page);
      setHasNextPage(response.hasNextPage);
      setResults((prev) => dedupeSkins([...prev, ...response.results]));
    } catch (searchError) {
      setError(toErrorMessage(searchError));
    } finally {
      setLoadingMore(false);
    }
  };

  const loadAll = async () => {
    if (!activeQuery || !canLoadMore) {
      return;
    }

    setLoadingAll(true);
    setError('');

    try {
      let currentPage = page;
      let nextAvailable: boolean = hasNextPage;
      let collected = [...results];
      const maxExtraPages = 6;

      for (let i = 0; i < maxExtraPages && nextAvailable; i += 1) {
        const response = await searchMinecraftSkins(activeQuery, currentPage + 1);
        currentPage = response.page;
        nextAvailable = response.hasNextPage;
        collected = dedupeSkins([...collected, ...response.results]);
      }

      setResults(collected);
      setPage(currentPage);
      setHasNextPage(nextAvailable);
    } catch (searchError) {
      setError(toErrorMessage(searchError));
    } finally {
      setLoadingAll(false);
    }
  };

  const downloadFromMineccera = async (item: SkinResult) => {
    const downloadUrl = getPreferredDownloadUrl(item);
    if (!downloadUrl) {
      return;
    }

    if (Platform.OS !== 'web') {
      Linking.openURL(downloadUrl);
      return;
    }

    setDownloadingId(item.id);
    setError('');

    try {
      const attempts = toDownloadFetchCandidates(downloadUrl);
      let downloadedBlob: Blob | null = null;

      for (const attempt of attempts) {
        try {
          const response = await fetch(attempt, {
            headers: { Accept: 'image/png,image/*;q=0.9,*/*;q=0.8' },
          });
          if (!response.ok) {
            continue;
          }
          const blob = await response.blob();
          if (blob.size > 0) {
            downloadedBlob = blob;
            break;
          }
        } catch {
          // Se prueba el siguiente mirror/proxy.
        }
      }

      if (!downloadedBlob) {
        throw new Error('No download blob');
      }

      const webUrlApi = (globalThis as any).URL;
      const webDocument = (globalThis as any).document;
      if (!webUrlApi?.createObjectURL || !webDocument?.createElement) {
        throw new Error('Web APIs unavailable');
      }

      const blobUrl = webUrlApi.createObjectURL(downloadedBlob);
      const anchor = webDocument.createElement('a');
      anchor.href = blobUrl;
      anchor.download = toDownloadFilename(item);
      anchor.rel = 'noopener noreferrer';
      webDocument.body.appendChild(anchor);
      anchor.click();
      webDocument.body.removeChild(anchor);
      setTimeout(() => webUrlApi.revokeObjectURL(blobUrl), 3000);
    } catch {
      setError('No se pudo descargar directo desde Mineccera. Se abrio la fuente original como respaldo.');
      Linking.openURL(downloadUrl);
    } finally {
      setDownloadingId('');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Busca skins reales de MinecraftSkins.com, mira miniatura y descarga el PNG"
        title="Buscador De Skins"
      >
        <Text style={styles.metaText}>
          Al abrir esta pestaña se cargan 50 skins del momento automaticamente para que elijas sin buscar.
        </Text>
        <Text style={[styles.label, compact && styles.labelCompact]}>Buscar skin</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setQuery}
          onSubmitEditing={runSearch}
          placeholder="Ej: spider man, anime, creeper, knight..."
          placeholderTextColor={palette.muted}
          style={[styles.input, compact && styles.inputCompact]}
          value={query}
        />

        <View style={[styles.controlsRow, compact && styles.controlsRowCompact]}>
          <Pressable onPress={runSearch} style={[styles.button, styles.buttonPrimary]}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons color={palette.text} name="magnify" size={15} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Buscar</Text>
            </View>
          </Pressable>
          <Pressable disabled={!canLoadMore} onPress={loadMore} style={[styles.button, styles.buttonSecondary, !canLoadMore && styles.buttonDisabled]}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons color={palette.text} name="arrow-expand-down" size={14} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{loadingMore ? 'Cargando...' : 'Cargar mas'}</Text>
            </View>
          </Pressable>
          <Pressable disabled={!canLoadMore} onPress={loadAll} style={[styles.button, styles.buttonNeutral, !canLoadMore && styles.buttonDisabled]}>
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons color={palette.text} name="download-multiple" size={14} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>{loadingAll ? 'Trayendo...' : 'Traer todo'}</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.metaText}>{statusLine}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </SectionCard>

      <SectionCard subtitle="Miniatura, enlace original y descarga PNG por cada skin" title="Resultados De MinecraftSkins">
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator color={palette.primaryDark} />
            <Text style={styles.loaderText}>Buscando skins...</Text>
          </View>
        ) : null}

        {!loading && !results.length ? (
          <Text style={styles.emptyText}>Aqui veras las skins encontradas.</Text>
        ) : (
          <View style={styles.resultGrid}>
            {results.map((item) => {
              const broken = brokenImages[item.id] === true;
              const sourceUrl = absoluteExternalUrl(item.skinUrl);
              const downloadUrl = getPreferredDownloadUrl(item);
              return (
                <View key={item.id} style={[styles.resultCell, { width: cardWidth }]}>
                  <View style={styles.resultCard}>
                    <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
                      {item.previewUrl && !broken ? (
                        <Image
                          onError={() => setBrokenImages((prev) => ({ ...prev, [item.id]: true }))}
                          source={{ uri: item.previewUrl }}
                          style={styles.image}
                        />
                      ) : (
                        <View style={styles.imageFallback}>
                          <Text numberOfLines={3} style={styles.imageFallbackText}>
                            Sin vista previa
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cardBody}>
                      <Text numberOfLines={2} style={styles.cardTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.cardMeta}>ID: {item.id}</Text>
                      <Text style={styles.cardMeta}>Publicacion: {item.publishedAt || 'N/A'}</Text>

                      <View style={[styles.linkRow, compact && styles.linkRowCompact]}>
                        <Pressable onPress={() => sourceUrl && Linking.openURL(sourceUrl)} style={[styles.linkBtn, styles.linkSource]}>
                          <View style={styles.buttonContent}>
                            <MaterialCommunityIcons color={palette.text} name="open-in-new" size={12} style={styles.buttonIcon} />
                            <Text style={styles.linkBtnTextSource}>Ver fuente</Text>
                          </View>
                        </Pressable>
                        <Pressable
                          disabled={!downloadUrl}
                          onPress={() => downloadFromMineccera(item)}
                          style={[styles.linkBtn, styles.linkDownload, !downloadUrl && styles.buttonDisabled]}
                        >
                          <View style={styles.buttonContent}>
                            <MaterialCommunityIcons color={palette.text} name="download" size={12} style={styles.buttonIcon} />
                            <Text style={styles.linkBtnText}>
                              {downloadingId === item.id ? 'Descargando...' : 'Descargar PNG'}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </SectionCard>

      <Text style={styles.legalText}>
        Fuente: MinecraftSkins.com (The Skindex). Descarga y uso de skins sujeto a autoria y terminos de su plataforma.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  buttonIcon: {
    marginTop: -1,
  },
  buttonNeutral: {
    backgroundColor: '#EAEDE9',
    borderColor: '#B7C4BC',
  },
  buttonPrimary: {
    backgroundColor: '#DEECE3',
    borderColor: palette.primary,
  },
  buttonSecondary: {
    backgroundColor: '#E5ECE8',
    borderColor: '#98AEA0',
  },
  buttonText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  cardMeta: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 14,
  },
  cardTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
  },
  content: {
    alignSelf: 'center',
    gap: spacing.md,
    maxWidth: 1240,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  contentCompact: {
    paddingHorizontal: spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  controlsRowCompact: {
    flexDirection: 'column',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
  },
  errorText: {
    color: '#B3362E',
    fontSize: 12,
    marginTop: spacing.xs,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: '#DCE3DE',
    borderColor: '#A2B1A8',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    width: '100%',
  },
  imageFallbackText: {
    color: palette.muted,
    fontSize: 10,
    textAlign: 'center',
  },
  imageWrap: {
    borderRadius: radius.md,
    height: 118,
    overflow: 'hidden',
    width: 118,
  },
  imageWrapCompact: {
    height: 98,
    width: 98,
  },
  input: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 13,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  inputCompact: {
    fontSize: 12,
  },
  label: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  labelCompact: {
    fontSize: 11,
  },
  legalText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  linkBtn: {
    alignItems: 'center',
    borderRadius: radius.chip,
    borderWidth: 1,
    flex: 1,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  linkBtnText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 10,
  },
  linkBtnTextSource: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 8.5,
  },
  linkDownload: {
    backgroundColor: '#E1ECE4',
    borderColor: '#8FAF9B',
  },
  linkRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  linkRowCompact: {
    flexDirection: 'column',
  },
  linkSource: {
    backgroundColor: '#E7EDE9',
    borderColor: '#97AFA1',
  },
  loaderText: {
    color: palette.muted,
    fontSize: 12,
  },
  loaderWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  metaText: {
    color: palette.secondary,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  resultCard: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'column',
    gap: spacing.sm,
    height: '100%',
    padding: spacing.sm,
  },
  resultCell: {
    marginBottom: spacing.sm,
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
});
