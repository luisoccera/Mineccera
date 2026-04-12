import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

type SkinSortMode = 'latest' | 'mostvoted';

const WEBVIEW_HEIGHT = 940;

const sanitizeQueryForPath = (input: string) =>
  input
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildSearchUrl = (queryPath: string, page: number, mode: SkinSortMode) => {
  const base = mode === 'latest' ? 'search/skin' : 'search/mostvotedskin';
  return `https://www.minecraftskins.com/${base}/${queryPath}/${page}/`;
};

const Iframe = (props: { src: string }) => {
  const Tag = 'iframe' as unknown as any;
  return (
    <Tag
      allow="clipboard-write; fullscreen"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
      src={props.src}
      style={{
        backgroundColor: '#101010',
        border: '0',
        borderRadius: `${radius.md}px`,
        height: `${WEBVIEW_HEIGHT}px`,
        width: '100%',
      }}
      title="MinecraftSkins Search"
    />
  );
};

export function SkinScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [query, setQuery] = useState('spider man');
  const [activeQueryPath, setActiveQueryPath] = useState('spider-man');
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<SkinSortMode>('latest');
  const [viewerKey, setViewerKey] = useState(1);

  const embeddedUrl = useMemo(
    () => buildSearchUrl(activeQueryPath, page, mode),
    [activeQueryPath, mode, page]
  );

  const runSearch = () => {
    const cleanPath = sanitizeQueryForPath(query);
    if (!cleanPath) {
      return;
    }
    setActiveQueryPath(cleanPath);
    setPage(1);
    setViewerKey((k) => k + 1);
  };

  const goPrev = () => {
    setPage((p) => Math.max(1, p - 1));
    setViewerKey((k) => k + 1);
  };

  const goNext = () => {
    setPage((p) => p + 1);
    setViewerKey((k) => k + 1);
  };

  const applyMode = (nextMode: SkinSortMode) => {
    setMode(nextMode);
    setPage(1);
    setViewerKey((k) => k + 1);
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Busqueda integrada en MinecraftSkins.com con paginacion para ver muchas skins"
        title="Buscador De Skins"
      >
        <Text style={[styles.label, compact && styles.labelCompact]}>Buscar skin</Text>
        <TextInput
          onChangeText={setQuery}
          placeholder="Ej: spider man, anime, knight, creeper..."
          placeholderTextColor={palette.muted}
          style={[styles.input, compact && styles.inputCompact]}
          value={query}
        />

        <View style={[styles.controlsRow, compact && styles.controlsRowCompact]}>
          <Pressable onPress={runSearch} style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonText}>Buscar</Text>
          </Pressable>
          <Pressable onPress={goPrev} style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Pagina -</Text>
          </Pressable>
          <Pressable onPress={goNext} style={[styles.button, styles.buttonSecondary]}>
            <Text style={styles.buttonText}>Pagina +</Text>
          </Pressable>
        </View>

        <View style={styles.chips}>
          <Pressable onPress={() => applyMode('latest')} style={[styles.chip, mode === 'latest' && styles.chipActive]}>
            <Text style={[styles.chipText, mode === 'latest' && styles.chipTextActive]}>Latest</Text>
          </Pressable>
          <Pressable
            onPress={() => applyMode('mostvoted')}
            style={[styles.chip, mode === 'mostvoted' && styles.chipActive]}
          >
            <Text style={[styles.chipText, mode === 'mostvoted' && styles.chipTextActive]}>Most Voted</Text>
          </Pressable>
        </View>

        <Text style={styles.metaText}>
          Consulta: "{activeQueryPath.replace(/-/g, ' ')}" | Pagina: {page} | Modo:{' '}
          {mode === 'latest' ? 'Latest' : 'Most Voted'}
        </Text>

        <View style={[styles.controlsRow, compact && styles.controlsRowCompact]}>
          <Pressable onPress={() => setViewerKey((k) => k + 1)} style={[styles.button, styles.buttonNeutral]}>
            <Text style={styles.buttonText}>Recargar visor</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(embeddedUrl)} style={[styles.button, styles.buttonNeutral]}>
            <Text style={styles.buttonText}>Abrir en pestaña</Text>
          </Pressable>
        </View>
      </SectionCard>

      <SectionCard
        subtitle="Aqui ves miniaturas del sitio y puedes entrar a cada skin para descargar PNG"
        title="Vista Integrada De MinecraftSkins"
      >
        {Platform.OS === 'web' ? (
          <View style={styles.viewerWrap}>
            <Iframe key={`iframe-${viewerKey}`} src={embeddedUrl} />
          </View>
        ) : (
          <View style={styles.viewerWrap}>
            <WebView
              key={`webview-${viewerKey}`}
              source={{ uri: embeddedUrl }}
              style={styles.nativeWebview}
              sharedCookiesEnabled
              thirdPartyCookiesEnabled
            />
          </View>
        )}
      </SectionCard>

      <Text style={styles.legalText}>
        Fuente: MinecraftSkins.com (The Skindex). Para descargar: entra a una skin y usa el boton Download de su pagina.
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
  chip: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: '#DFF4E8',
    borderColor: palette.primary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  chipText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: palette.primaryDark,
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
  metaText: {
    color: palette.secondary,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  nativeWebview: {
    backgroundColor: '#0C0C0C',
    borderRadius: radius.md,
    height: WEBVIEW_HEIGHT,
    overflow: 'hidden',
    width: '100%',
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  viewerWrap: {
    borderColor: '#8D7A56',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
  },
});
