import * as Linking from 'expo-linking';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { findTemplate, getCommonTemplates, searchBuildIdeas, WebBuildResult } from '../data/buildGuides';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const proxifyImage = (url?: string) => {
  const clean = (url || '').trim();
  if (!clean || clean.startsWith('data:')) {
    return '';
  }
  const normalized = clean.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(normalized)}&w=900&h=700&fit=inside`;
};

const toSearchPlaceholderImage = (label: string) => {
  const safeLabel = (label || 'Estructura Minecraft').replace(/[<>&"]/g, '').slice(0, 42);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='560' viewBox='0 0 900 560'>
<defs>
<linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='#2E4738'/>
<stop offset='100%' stop-color='#1E2F25'/>
</linearGradient>
</defs>
<rect width='900' height='560' fill='url(#bg)'/>
<rect x='32' y='30' width='836' height='500' rx='16' fill='#2D4235' stroke='#6F8B72' stroke-width='4'/>
<rect x='66' y='68' width='768' height='292' rx='10' fill='#1E2E24' stroke='#7D9B83' stroke-width='3'/>
<rect x='66' y='380' width='768' height='118' rx='10' fill='#E9E3D7' stroke='#C0B39A' stroke-width='3'/>
<text x='94' y='444' font-family='Verdana, Arial, sans-serif' font-size='38' font-weight='700' fill='#2B352F'>${safeLabel}</text>
<text x='94' y='478' font-family='Verdana, Arial, sans-serif' font-size='24' fill='#59665C'>Usa fuentes de wiki, reddit y guias tecnicas</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export function BuildSearchPanel() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const tablet = deviceClass === 'tablet';
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<WebBuildResult[]>([]);
  const [selectedResultUrl, setSelectedResultUrl] = useState('');
  const [previewSourceIndex, setPreviewSourceIndex] = useState(0);
  const commonTemplates = useMemo(() => getCommonTemplates(5), []);

  const selectedResult = useMemo(
    () => results.find((result) => result.url === selectedResultUrl) || results[0],
    [results, selectedResultUrl],
  );

  const selectedTemplate = useMemo(() => {
    if (!hasSearched || !searchedQuery || !selectedResult) {
      return null;
    }
    const context = `${searchedQuery} ${selectedResult?.title || ''}`.trim();
    return findTemplate(context);
  }, [hasSearched, searchedQuery, selectedResult]);

  const featuredImage = useMemo(() => {
    if (!hasSearched || !searchedQuery) {
      return undefined;
    }
    if (selectedResult?.imageUrl) {
      return selectedResult.imageUrl;
    }
    return results.find((result) => result.imageUrl)?.imageUrl;
  }, [hasSearched, results, searchedQuery, selectedResult]);
  const previewCandidates = useMemo(() => {
    if (!hasSearched) {
      return [];
    }
    const placeholderLabel = searchedQuery || query || 'Estructura Minecraft';
    const list = [featuredImage, proxifyImage(featuredImage), toSearchPlaceholderImage(placeholderLabel)];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const candidate of list) {
      const clean = (candidate || '').trim();
      if (!clean || seen.has(clean)) {
        continue;
      }
      seen.add(clean);
      unique.push(clean);
    }
    return unique;
  }, [featuredImage, hasSearched, query, searchedQuery]);

  useEffect(() => {
    setPreviewSourceIndex(0);
  }, [featuredImage]);

  const runSearchFor = async (rawQuery: string) => {
    const cleanQuery = rawQuery.trim();
    if (!cleanQuery) {
      setError('Escribe que quieres construir.');
      setHasSearched(false);
      setSearchedQuery('');
      setSelectedResultUrl('');
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);
    setSearchedQuery(cleanQuery);
    setSelectedResultUrl('');
    try {
      const found = await searchBuildIdeas(cleanQuery);
      setResults(found);
      if (!found.length) {
        setError('Sin resultados por ahora. Prueba con otra descripcion.');
      } else {
        const preferred = found.find((result) => !!result.imageUrl) || found[0];
        setSelectedResultUrl(preferred?.url || '');
      }
    } catch {
      setResults([]);
      setSelectedResultUrl('');
      setError('No se pudo consultar la red. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async () => {
    await runSearchFor(query);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, compact && styles.labelCompact]}>Que quieres construir?</Text>
      <TextInput
        onChangeText={setQuery}
        placeholder="Ej: estatua de dragon, iron farm 1.21, casa medieval..."
        placeholderTextColor={palette.muted}
        style={[styles.input, compact && styles.inputCompact]}
        value={query}
      />

      <Pressable onPress={runSearch} style={[styles.searchButton, compact && styles.searchButtonCompact]}>
        <Text style={[styles.searchButtonText, compact && styles.searchButtonTextCompact]}>Buscar En La Red</Text>
      </Pressable>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.primary} />
          <Text style={styles.loadingText}>Buscando referencias y filtrando contenido no relevante...</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Imagen sugerida</Text>
        {previewCandidates[previewSourceIndex] ? (
          <Image
            onError={() => setPreviewSourceIndex((value) => value + 1)}
            source={{ uri: previewCandidates[previewSourceIndex] }}
            style={[styles.previewImage, compact && styles.previewImageCompact]}
          />
        ) : hasSearched ? (
          <Text style={styles.emptyText}>
            No se encontro una imagen fiable para esta busqueda. Revisa las fuentes abajo.
          </Text>
        ) : (
          <Text style={styles.emptyText}>Busca algo para traer una imagen de referencia.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Lo necesario para construir</Text>
        {!hasSearched ? (
          <Text style={styles.emptyText}>Primero haz una busqueda.</Text>
        ) : selectedTemplate ? (
          <View style={styles.templateBox}>
            <Text style={[styles.templateTitle, compact && styles.templateTitleCompact]}>{selectedTemplate.title}</Text>
            {selectedTemplate.materials.map((material) => (
              <Text key={material} style={styles.materialItem}>• {material}</Text>
            ))}
            <Text style={styles.templateNote}>{selectedTemplate.notes}</Text>
          </View>
        ) : (
          <View style={styles.templateBox}>
            <Text style={[styles.templateTitle, compact && styles.templateTitleCompact]}>
              Sin coincidencia exacta: opciones comunes recomendadas
            </Text>
            <Text style={styles.templateNote}>
              Para prevenir resultados vacios, te dejamos plantillas base de estructuras comunes.
            </Text>
            {commonTemplates.map((template) => (
              <View key={template.id} style={styles.commonTemplateRow}>
                <Text style={styles.commonTemplateTitle}>{template.title}</Text>
                <Text style={styles.commonTemplateMeta}>{template.materials.slice(0, 3).join(' | ')}</Text>
                <Pressable
                  onPress={async () => {
                    setQuery(template.title);
                    await runSearchFor(template.title);
                  }}
                  style={styles.useTemplateButton}
                >
                  <Text style={styles.useTemplateButtonText}>Usar esta base</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Resultados confiables</Text>
        {!results.length && !loading ? (
          <Text style={styles.emptyText}>Aqui apareceran enlaces de wiki, Reddit y otros sitios confiables.</Text>
        ) : null}

        <View style={styles.results}>
          {results.map((result) => (
            <View
              key={result.url}
              style={[
                styles.resultCard,
                compact && styles.resultCardCompact,
                selectedResult?.url === result.url && styles.resultCardSelected,
              ]}
            >
              <Pressable onPress={() => setSelectedResultUrl(result.url)} style={styles.resultSelectArea}>
                <Text style={[styles.resultTitle, compact && styles.resultTitleCompact]}>{result.title}</Text>
                <Text style={styles.resultMeta}>{result.source}</Text>
                <Text style={styles.resultSummary}>{result.summary || 'Sin resumen disponible.'}</Text>
              </Pressable>
              <Pressable
                onPress={() => Linking.openURL(result.url)}
                style={[styles.openSourceButton, tablet && styles.openSourceButtonTablet]}
              >
                <Text style={styles.openSourceButtonText}>Abrir fuente</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
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
    paddingVertical: 9,
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
  loading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 11,
  },
  materialItem: {
    color: palette.text,
    fontSize: 12,
    lineHeight: 19,
  },
  previewImage: {
    backgroundColor: '#D7D7D7',
    borderColor: '#B9B9B9',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 170,
    width: '100%',
  },
  previewImageCompact: {
    height: 150,
  },
  resultCard: {
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
    padding: spacing.sm,
  },
  resultCardCompact: {
    padding: spacing.xs,
  },
  resultCardSelected: {
    borderColor: palette.primary,
    borderWidth: 2,
  },
  resultMeta: {
    color: palette.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  resultSelectArea: {
    gap: 4,
  },
  resultSummary: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  resultTitle: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  resultTitleCompact: {
    fontSize: 11,
    lineHeight: 15,
  },
  results: {
    gap: spacing.xs,
  },
  openSourceButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9F4E1',
    borderColor: '#89B072',
    borderRadius: radius.sm,
    borderWidth: 1,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  openSourceButtonTablet: {
    alignSelf: 'flex-end',
  },
  openSourceButtonText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 11,
    fontWeight: '700',
  },
  commonTemplateRow: {
    backgroundColor: '#F4ECDD',
    borderColor: '#C9B691',
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 4,
    marginTop: spacing.xs,
    padding: spacing.xs,
  },
  commonTemplateTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
    fontWeight: '700',
  },
  commonTemplateMeta: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  useTemplateButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2ECE6',
    borderColor: palette.primary,
    borderRadius: radius.chip,
    borderWidth: 1,
    marginTop: 2,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  useTemplateButtonText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 10,
    fontWeight: '700',
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#E3F3DB',
    borderColor: '#89B072',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingVertical: 11,
  },
  searchButtonCompact: {
    paddingVertical: 10,
  },
  searchButtonText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  searchButtonTextCompact: {
    fontSize: 11,
  },
  section: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitleCompact: {
    fontSize: 11,
  },
  templateBox: {
    backgroundColor: '#EEE4CF',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
    padding: spacing.sm,
  },
  templateNote: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
  templateTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  templateTitleCompact: {
    fontSize: 11,
    lineHeight: 14,
  },
});
