import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import { searchMinecraftSkins, type SkinResult } from '../data/skins';

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

export function SkinScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  const [query, setQuery] = useState('spider man');
  const [activeQuery, setActiveQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [results, setResults] = useState<SkinResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});

  const resultCount = results.length;
  const canLoadMore = hasNextPage && !loading && !loadingMore && !loadingAll;

  const statusLine = useMemo(() => {
    if (!activeQuery) {
      return 'Haz una busqueda para ver skins reales.';
    }
    return `Consulta: "${activeQuery}" | Pagina actual: ${page} | Resultados: ${resultCount}`;
  }, [activeQuery, page, resultCount]);

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
    } catch (searchError) {
      setResults([]);
      setHasNextPage(false);
      setPage(1);
      setActiveQuery(clean.toLowerCase());
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

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Busca skins reales de MinecraftSkins.com, mira miniatura y descarga el PNG"
        title="Buscador De Skins"
      >
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
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
          <Pressable disabled={!canLoadMore} onPress={loadMore} style={[styles.button, styles.buttonSecondary, !canLoadMore && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>{loadingMore ? 'Cargando...' : 'Cargar mas'}</Text>
          </Pressable>
          <Pressable disabled={!canLoadMore} onPress={loadAll} style={[styles.button, styles.buttonNeutral, !canLoadMore && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>{loadingAll ? 'Trayendo...' : 'Traer todo'}</Text>
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
          <View style={styles.resultList}>
            {results.map((item) => {
              const broken = brokenImages[item.id] === true;
              return (
                <View key={item.id} style={styles.resultCard}>
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
                      <Pressable onPress={() => Linking.openURL(item.skinUrl)} style={[styles.linkBtn, styles.linkSource]}>
                        <Text style={styles.linkBtnText}>Ver fuente</Text>
                      </Pressable>
                      <Pressable
                        disabled={!item.downloadUrl}
                        onPress={() => item.downloadUrl && Linking.openURL(item.downloadUrl)}
                        style={[styles.linkBtn, styles.linkDownload, !item.downloadUrl && styles.buttonDisabled]}
                      >
                        <Text style={styles.linkBtnText}>Descargar PNG</Text>
                      </Pressable>
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
  buttonNeutral: {
    backgroundColor: '#F2EFE4',
    borderColor: '#C7BFA3',
  },
  buttonPrimary: {
    backgroundColor: '#DFF4E8',
    borderColor: palette.primary,
  },
  buttonSecondary: {
    backgroundColor: '#EAF3FF',
    borderColor: '#95B4D7',
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
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
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
    backgroundColor: '#E7E0CE',
    borderColor: '#C3B594',
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
    backgroundColor: '#F8F4EA',
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
  linkDownload: {
    backgroundColor: '#EAF4E2',
    borderColor: '#9AB585',
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
    backgroundColor: '#E9F0FF',
    borderColor: '#9EB6D8',
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
    backgroundColor: '#F8F4EA',
    borderColor: '#BFA779',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  resultList: {
    gap: spacing.sm,
  },
});
