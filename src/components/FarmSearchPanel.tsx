import * as Linking from 'expo-linking';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { farmGuides } from '../data/farmSearch';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

type VersionFilter = 'all' | 'bedrock' | 'java';

const proxifyImage = (url?: string) => {
  const clean = (url || '').trim();
  if (!clean || clean.startsWith('data:')) {
    return '';
  }
  const normalized = clean.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(normalized)}&w=900&h=700&fit=inside`;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const matchesVersion = (versions: string, filter: VersionFilter) => {
  if (filter === 'all') {
    return true;
  }
  const text = normalize(versions);
  if (filter === 'java') {
    return text.includes('java');
  }
  return text.includes('bedrock');
};

const difficultyTagStyle = (difficulty: string) => {
  if (difficulty === 'Alta') {
    return { backgroundColor: '#F1E3DE', borderColor: '#C89A8B' };
  }
  if (difficulty === 'Media') {
    return { backgroundColor: '#E8EEDF', borderColor: '#A8B791' };
  }
  return { backgroundColor: '#DEECE3', borderColor: '#8FAF9B' };
};

export function FarmSearchPanel() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [query, setQuery] = useState('');
  const [versionFilter, setVersionFilter] = useState<VersionFilter>('all');
  const [selectedId, setSelectedId] = useState(farmGuides[0]?.id || '');
  const [imageIndex, setImageIndex] = useState(0);

  const filteredGuides = useMemo(() => {
    const q = normalize(query.trim());
    return farmGuides.filter((farm) => {
      if (!matchesVersion(farm.versions, versionFilter)) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = normalize(
        `${farm.name} ${farm.output} ${farm.tags.join(' ')} ${farm.keyMaterials.join(' ')} ${farm.biomes.join(' ')}`,
      );
      return haystack.includes(q);
    });
  }, [query, versionFilter]);

  const selectedFarm = useMemo(
    () => filteredGuides.find((farm) => farm.id === selectedId) || filteredGuides[0] || null,
    [filteredGuides, selectedId],
  );

  const imageCandidates = useMemo(() => {
    if (!selectedFarm) {
      return [];
    }
    const list = [
      selectedFarm.imageUrl,
      proxifyImage(selectedFarm.imageUrl),
      selectedFarm.backupImageUrl,
      proxifyImage(selectedFarm.backupImageUrl),
    ];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const value of list) {
      const clean = (value || '').trim();
      if (!clean || seen.has(clean)) {
        continue;
      }
      seen.add(clean);
      unique.push(clean);
    }
    return unique;
  }, [selectedFarm]);

  useEffect(() => {
    if (!filteredGuides.length) {
      setSelectedId('');
      return;
    }
    if (!filteredGuides.some((farm) => farm.id === selectedId)) {
      setSelectedId(filteredGuides[0].id);
    }
  }, [filteredGuides, selectedId]);

  useEffect(() => {
    setImageIndex(0);
  }, [selectedFarm?.id]);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, compact && styles.labelCompact]}>Buscar granja</Text>
      <TextInput
        onChangeText={setQuery}
        placeholder="Ej: hierro, creeper, oro, xp, aldeanos..."
        placeholderTextColor={palette.muted}
        style={[styles.input, compact && styles.inputCompact]}
        value={query}
      />

      <View style={styles.filters}>
        <Pressable
          onPress={() => setVersionFilter('all')}
          style={[styles.filterChip, versionFilter === 'all' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, versionFilter === 'all' && styles.filterChipTextActive]}>Todas</Text>
        </Pressable>
        <Pressable
          onPress={() => setVersionFilter('java')}
          style={[styles.filterChip, versionFilter === 'java' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, versionFilter === 'java' && styles.filterChipTextActive]}>Java</Text>
        </Pressable>
        <Pressable
          onPress={() => setVersionFilter('bedrock')}
          style={[styles.filterChip, versionFilter === 'bedrock' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, versionFilter === 'bedrock' && styles.filterChipTextActive]}>Bedrock</Text>
        </Pressable>
      </View>

      <Text style={styles.metaText}>Resultados: {filteredGuides.length}</Text>

      {filteredGuides.length ? (
        <View style={styles.list}>
          {filteredGuides.map((farm) => (
            <Pressable
              key={farm.id}
              onPress={() => setSelectedId(farm.id)}
              style={[styles.resultCard, selectedFarm?.id === farm.id && styles.resultCardActive]}
            >
              <Text style={styles.resultTitle}>{farm.name}</Text>
              <Text style={styles.resultMeta}>
                {farm.versions} | {farm.difficulty}
              </Text>
              <Text numberOfLines={2} style={styles.resultText}>
                {farm.output}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No se encontraron granjas con ese filtro.</Text>
      )}

      {selectedFarm ? (
        <View style={styles.detailCard}>
          <View style={[styles.detailHead, compact && styles.detailHeadCompact]}>
            <View style={styles.detailMedia}>
              {imageCandidates[imageIndex] ? (
                <Image
                  onError={() => setImageIndex((value) => value + 1)}
                  source={{ uri: imageCandidates[imageIndex] }}
                  style={styles.detailImage}
                />
              ) : (
                <View style={styles.detailImageFallback}>
                  <Text style={styles.detailImageFallbackEmoji}>🌾</Text>
                  <Text style={styles.detailImageFallbackText}>Sin imagen externa</Text>
                </View>
              )}
            </View>
            <View style={styles.detailBody}>
              <Text style={styles.detailTitle}>{selectedFarm.name}</Text>
              <View style={styles.badgesRow}>
                <Text style={styles.detailBadge}>{selectedFarm.versions}</Text>
                <Text style={[styles.detailBadge, difficultyTagStyle(selectedFarm.difficulty)]}>
                  Dificultad: {selectedFarm.difficulty}
                </Text>
              </View>
              <Text style={styles.detailOutput}>Salida: {selectedFarm.output}</Text>
              <Text style={styles.detailMeta}>Bioma/zona recomendada: {selectedFarm.biomes.join(' | ')}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Materiales clave</Text>
          {selectedFarm.keyMaterials.map((material) => (
            <Text key={material} style={styles.bulletText}>
              • {material}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Pasos detallados</Text>
          {selectedFarm.steps.map((step, index) => (
            <Text key={`${selectedFarm.id}-step-${index}`} style={styles.bulletText}>
              {index + 1}. {step}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Notas de optimizacion</Text>
          {selectedFarm.notes.map((note, index) => (
            <Text key={`${selectedFarm.id}-note-${index}`} style={styles.bulletText}>
              • {note}
            </Text>
          ))}

          <View style={[styles.linksRow, compact && styles.linksRowCompact]}>
            <Pressable onPress={() => Linking.openURL(selectedFarm.wikiSource.url)} style={styles.primarySourceButton}>
              <Text style={styles.primarySourceText}>{selectedFarm.wikiSource.label}</Text>
            </Pressable>
          </View>
          <View style={styles.extraLinks}>
            {selectedFarm.extraSources.map((reference) => (
              <Pressable key={reference.url} onPress={() => Linking.openURL(reference.url)} style={styles.extraLinkChip}>
                <Text style={styles.extraLinkText}>{reference.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
  },
  bulletText: {
    color: palette.text,
    fontSize: 12,
    lineHeight: 18,
  },
  container: {
    gap: spacing.sm,
  },
  detailBadge: {
    backgroundColor: '#E1ECE4',
    borderColor: '#8FAF9B',
    borderRadius: radius.chip,
    borderWidth: 1,
    color: palette.text,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  detailBody: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  detailCard: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  detailHead: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailHeadCompact: {
    flexDirection: 'column',
  },
  detailImage: {
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 160,
    resizeMode: 'cover',
    width: '100%',
  },
  detailImageFallback: {
    alignItems: 'center',
    backgroundColor: palette.stone,
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 6,
    height: 160,
    justifyContent: 'center',
    width: '100%',
  },
  detailImageFallbackEmoji: {
    fontSize: 30,
    lineHeight: 34,
  },
  detailImageFallbackText: {
    color: palette.muted,
    fontSize: 11,
  },
  detailMedia: {
    minWidth: 220,
    width: '33%',
  },
  detailMeta: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  detailOutput: {
    color: palette.text,
    fontSize: 12,
    lineHeight: 17,
  },
  detailTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
  },
  extraLinkChip: {
    backgroundColor: '#E2ECE6',
    borderColor: palette.primary,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  extraLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  extraLinkText: {
    color: palette.text,
    fontSize: 10,
    lineHeight: 14,
  },
  filterChip: {
    backgroundColor: '#E6ECE8',
    borderColor: '#A5B5AB',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: '#DEECE3',
    borderColor: palette.primary,
  },
  filterChipText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: palette.primaryDark,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
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
  linksRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  linksRowCompact: {
    flexDirection: 'column',
  },
  list: {
    gap: spacing.xs,
  },
  metaText: {
    color: palette.secondary,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  primarySourceButton: {
    alignItems: 'center',
    backgroundColor: '#DFECE3',
    borderColor: '#8FAF9B',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  primarySourceText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 11,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: '#E8EDE9',
    borderColor: '#AEBBB3',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 3,
    padding: spacing.sm,
  },
  resultCardActive: {
    borderColor: palette.primary,
    borderWidth: 2,
  },
  resultMeta: {
    color: palette.secondary,
    fontSize: 10,
    lineHeight: 14,
  },
  resultText: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  resultTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
