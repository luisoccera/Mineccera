import * as Linking from 'expo-linking';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { searchMinecraftSkins, type SkinResult } from '../data/skins';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const MAX_AUTO_PAGES = 12;

const mergeUniqueSkins = (current: SkinResult[], incoming: SkinResult[]) => {
  const seen = new Set(current.map((skin) => skin.skinUrl));
  const merged = [...current];
  for (const skin of incoming) {
    if (seen.has(skin.skinUrl)) {
      continue;
    }
    seen.add(skin.skinUrl);
    merged.push(skin);
  }
  return merged;
};

export function SkinScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const tablet = deviceClass === 'tablet';
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState<SkinResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async () => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      setError('Escribe algo para buscar skins.');
      setResults([]);
      setCurrentPage(0);
      setSearchedQuery('');
      setHasNextPage(false);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setCurrentPage(0);
    setHasNextPage(false);
    setSearchedQuery(cleanQuery);

    try {
      const firstPage = await searchMinecraftSkins(cleanQuery, 1);
      setResults(firstPage.results);
      setCurrentPage(1);
      setHasNextPage(firstPage.hasNextPage);
      if (!firstPage.results.length) {
        setError('No encontramos skins para esa busqueda.');
      }
    } catch {
      setError('No se pudo cargar MinecraftSkins en este momento. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!searchedQuery || !hasNextPage || loading || loadingMore || loadingAll) {
      return;
    }

    const nextPage = currentPage + 1;
    setLoadingMore(true);
    setError('');

    try {
      const response = await searchMinecraftSkins(searchedQuery, nextPage);
      setResults((current) => mergeUniqueSkins(current, response.results));
      setCurrentPage(nextPage);
      setHasNextPage(response.hasNextPage);
      if (!response.results.length && !response.hasNextPage) {
        setError('No hay mas skins en esta consulta.');
      }
    } catch {
      setError('No se pudo cargar la siguiente pagina.');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadAll = async () => {
    if (!searchedQuery || !hasNextPage || loading || loadingMore || loadingAll) {
      return;
    }

    setLoadingAll(true);
    setError('');
    let page = currentPage;
    let keepGoing: boolean = hasNextPage;

    try {
      while (keepGoing && page < MAX_AUTO_PAGES) {
        const nextPage = page + 1;
        const response = await searchMinecraftSkins(searchedQuery, nextPage);
        setResults((current) => mergeUniqueSkins(current, response.results));
        page = nextPage;
        keepGoing = response.hasNextPage;
        setCurrentPage(page);
        setHasNextPage(keepGoing);
      }

      if (keepGoing && page >= MAX_AUTO_PAGES) {
        setError(`Se cargaron ${MAX_AUTO_PAGES} paginas para evitar bloqueo temporal. Usa "Cargar mas".`);
      }
    } catch {
      setError('Se corto la carga completa. Puedes continuar con "Cargar mas".');
    } finally {
      setLoadingAll(false);
    }
  };

  const openUrl = async (url: string, fallbackMessage: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      setError(fallbackMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Busca skins reales en MinecraftSkins.com, mira miniatura y descarga el PNG"
        title="Buscador De Skins"
      >
        <Text style={[styles.label, compact && styles.labelCompact]}>Buscar skin</Text>
        <TextInput
          onChangeText={setQuery}
          placeholder="Ej: steve, anime, creeper, knight..."
          placeholderTextColor={palette.muted}
          style={[styles.input, compact && styles.inputCompact]}
          value={query}
        />

        <View style={[styles.actionsRow, compact && styles.actionsRowCompact]}>
          <Pressable onPress={runSearch} style={[styles.actionButton, styles.actionPrimary]}>
            <Text style={styles.actionButtonText}>Buscar</Text>
          </Pressable>
          <Pressable disabled={!hasNextPage || loading || loadingMore || loadingAll} onPress={loadMore} style={[styles.actionButton, styles.actionSecondary, (!hasNextPage || loading || loadingMore || loadingAll) && styles.actionDisabled]}>
            <Text style={styles.actionButtonText}>Cargar mas</Text>
          </Pressable>
          <Pressable disabled={!hasNextPage || loading || loadingMore || loadingAll} onPress={loadAll} style={[styles.actionButton, styles.actionNeutral, (!hasNextPage || loading || loadingMore || loadingAll) && styles.actionDisabled]}>
            <Text style={styles.actionButtonText}>Traer todo</Text>
          </Pressable>
        </View>

        {loading || loadingMore || loadingAll ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={palette.primary} />
            <Text style={styles.loadingText}>
              {loading ? 'Buscando skins...' : loadingAll ? 'Cargando todas las paginas...' : 'Cargando mas skins...'}
            </Text>
          </View>
        ) : null}

        {searchedQuery ? (
          <Text style={styles.metaText}>
            Consulta: "{searchedQuery}" | Pagina actual: {currentPage || 1} | Resultados: {results.length}
          </Text>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </SectionCard>

      <SectionCard
        subtitle="Miniatura, enlace original y descarga PNG por cada skin"
        title="Resultados De MinecraftSkins"
      >
        {!results.length ? (
          <Text style={styles.emptyText}>Aqui veras las skins encontradas.</Text>
        ) : (
          <View style={styles.resultsList}>
            {results.map((skin) => (
              <View key={skin.skinUrl} style={[styles.resultCard, compact && styles.resultCardCompact]}>
                <Image source={{ uri: skin.previewUrl }} style={[styles.preview, compact && styles.previewCompact]} />
                <View style={styles.resultBody}>
                  <Text numberOfLines={2} style={[styles.resultTitle, compact && styles.resultTitleCompact]}>
                    {skin.title}
                  </Text>
                  <Text style={styles.resultMeta}>ID: {skin.id}</Text>

                  <View style={[styles.resultButtons, tablet && styles.resultButtonsTablet]}>
                    <Pressable onPress={() => openUrl(skin.skinUrl, 'No se pudo abrir la pagina de la skin.')} style={[styles.smallButton, styles.smallButtonPrimary]}>
                      <Text style={styles.smallButtonText}>Ver fuente</Text>
                    </Pressable>
                    <Pressable onPress={() => openUrl(skin.downloadUrl, 'No se pudo abrir la descarga del PNG.')} style={[styles.smallButton, styles.smallButtonSecondary]}>
                      <Text style={styles.smallButtonText}>Descargar PNG</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
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
  actionButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  actionButtonText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
    fontWeight: '700',
  },
  actionDisabled: {
    opacity: 0.45,
  },
  actionNeutral: {
    backgroundColor: '#F1F0E4',
    borderColor: '#B9B79D',
  },
  actionPrimary: {
    backgroundColor: '#DFF4E8',
    borderColor: palette.primary,
  },
  actionSecondary: {
    backgroundColor: '#F2EDDF',
    borderColor: '#C2AF87',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  actionsRowCompact: {
    flexDirection: 'column',
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  contentCompact: {
    paddingHorizontal: spacing.sm,
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
  },
  errorText: {
    color: palette.danger,
    fontSize: 12,
    marginTop: spacing.xs,
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
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 11,
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
  preview: {
    backgroundColor: '#E7E7E7',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 126,
    width: 126,
  },
  previewCompact: {
    alignSelf: 'center',
    height: 132,
    width: 132,
  },
  resultBody: {
    flex: 1,
    gap: 6,
  },
  resultButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  resultButtonsTablet: {
    flexDirection: 'row',
  },
  resultCard: {
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  resultCardCompact: {
    flexDirection: 'column',
  },
  resultMeta: {
    color: palette.muted,
    fontSize: 11,
  },
  resultTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  resultTitleCompact: {
    fontSize: 12,
    lineHeight: 16,
  },
  resultsList: {
    gap: spacing.xs,
  },
  smallButton: {
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: spacing.sm,
  },
  smallButtonPrimary: {
    backgroundColor: '#EAF3FF',
    borderColor: '#8FB3DA',
  },
  smallButtonSecondary: {
    backgroundColor: '#E8F6E9',
    borderColor: '#8BBB8E',
  },
  smallButtonText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 10,
  },
});
