import { useMemo, useState } from 'react';
import * as Linking from 'expo-linking';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import { commonBuilds, enchantingRecipes, essentialFarms } from '../data/commonGuides';

type CommonGuidesPanelProps = {
  showAll?: boolean;
};

export function CommonGuidesPanel({ showAll = true }: CommonGuidesPanelProps) {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  const builds = showAll ? commonBuilds : commonBuilds.slice(0, 4);
  const recipes = showAll ? enchantingRecipes : enchantingRecipes.slice(0, 3);
  const farms = showAll ? essentialFarms : essentialFarms.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Construcciones comunes</Text>
        <View style={styles.list}>
          {builds.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.itemLayout, compact && styles.itemLayoutCompact]}>
                <View style={[styles.mediaColumn, compact && styles.mediaColumnCompact]}>
                  <GuidePreview backupUri={item.backupImageUrl} title={item.name} uri={item.imageUrl} />
                  <Text style={styles.imageCredit}>Imagen: {item.imageCredit}</Text>
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.purpose}</Text>
                  <Text style={styles.itemMeta}>Materiales base: {item.materials.join(', ')}</Text>
                  <View style={styles.referenceWrap}>
                    {item.references.map((reference) => (
                      <Pressable
                        key={reference.url}
                        onPress={() => Linking.openURL(reference.url)}
                        style={styles.referenceChip}
                      >
                        <Text style={styles.referenceText}>{reference.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Recetas de encantamiento</Text>
        <View style={styles.list}>
          {recipes.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.itemLayout, compact && styles.itemLayoutCompact]}>
                <View style={[styles.mediaColumn, compact && styles.mediaColumnCompact]}>
                  <GuidePreview backupUri={item.backupImageUrl} title={item.title} uri={item.imageUrl} />
                  <Text style={styles.imageCredit}>Imagen: {item.imageCredit}</Text>
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemText}>Receta: {item.recipe}</Text>
                  <Text style={styles.itemMeta}>{item.use}</Text>
                  <View style={styles.referenceWrap}>
                    {item.references.map((reference) => (
                      <Pressable
                        key={reference.url}
                        onPress={() => Linking.openURL(reference.url)}
                        style={styles.referenceChip}
                      >
                        <Text style={styles.referenceText}>{reference.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>
          Granjas importantes (Java y Bedrock)
        </Text>
        <View style={styles.list}>
          {farms.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={[styles.itemLayout, compact && styles.itemLayoutCompact]}>
                <View style={[styles.mediaColumn, compact && styles.mediaColumnCompact]}>
                  <GuidePreview backupUri={item.backupImageUrl} title={item.name} uri={item.imageUrl} />
                  <Text style={styles.imageCredit}>Imagen: {item.imageCredit}</Text>
                </View>
                <View style={styles.contentColumn}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemText}>{item.output}</Text>
                  <Text style={styles.itemMeta}>Versiones: {item.versions}</Text>
                  <Text style={styles.itemMeta}>Materiales clave: {item.keyMaterials.join(', ')}</Text>
                  <View style={styles.referenceWrap}>
                    {item.references.map((reference) => (
                      <Pressable
                        key={reference.url}
                        onPress={() => Linking.openURL(reference.url)}
                        style={styles.referenceChip}
                      >
                        <Text style={styles.referenceText}>{reference.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const proxifyImage = (url?: string) => {
  const clean = (url || '').trim();
  if (!clean || clean.startsWith('data:')) {
    return '';
  }
  const normalized = clean.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(normalized)}&w=900&h=700&fit=inside`;
};

const toGuidePlaceholderImage = (title: string) => {
  const safeTitle = title.replace(/[<>&"]/g, '').slice(0, 38);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='675' viewBox='0 0 900 675'>
<defs>
<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='#31493B'/>
<stop offset='100%' stop-color='#1F2E25'/>
</linearGradient>
</defs>
<rect width='900' height='675' fill='url(#g)'/>
<rect x='38' y='38' width='824' height='599' rx='18' fill='#2F4538' stroke='#6D896F' stroke-width='4'/>
<rect x='72' y='88' width='756' height='380' rx='12' fill='#233329' stroke='#7F9A84' stroke-width='3'/>
<rect x='72' y='490' width='756' height='114' rx='12' fill='#E9E4D8' stroke='#C0B39A' stroke-width='3'/>
<text x='102' y='550' font-family='Verdana, Arial, sans-serif' font-size='42' font-weight='700' fill='#2A342E'>${safeTitle}</text>
<text x='102' y='590' font-family='Verdana, Arial, sans-serif' font-size='26' fill='#58665A'>Referencia visual base de Mineccera</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getGuideEmoji = (title: string) => {
  const normalized = title.toLowerCase();
  if (normalized.includes('casa') || normalized.includes('home')) return '🏠';
  if (normalized.includes('almacen')) return '📦';
  if (normalized.includes('encant')) return '✨';
  if (normalized.includes('aldean') || normalized.includes('trading')) return '🧑‍🌾';
  if (normalized.includes('nether')) return '🔥';
  if (normalized.includes('granja') || normalized.includes('farm')) return '🌾';
  if (normalized.includes('smelter') || normalized.includes('fund')) return '🏭';
  if (normalized.includes('creeper')) return '💥';
  return '🧱';
};

function GuidePreview({ backupUri, title, uri }: { backupUri?: string; title: string; uri: string }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const candidates = useMemo(() => {
    const list = [uri, proxifyImage(uri), backupUri, proxifyImage(backupUri), toGuidePlaceholderImage(title)];
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
  }, [backupUri, uri]);

  const activeUri = candidates[sourceIndex];

  if (!activeUri) {
    return (
      <View style={styles.previewFallback}>
        <Text style={styles.previewEmoji}>{getGuideEmoji(title)}</Text>
        <Text style={styles.previewFallbackTitle}>{title}</Text>
        <Text style={styles.previewFallbackText}>Plano visual de referencia</Text>
      </View>
    );
  }

  return (
    <Image
      onError={() => setSourceIndex((value) => value + 1)}
      source={{ uri: activeUri }}
      style={styles.previewImage}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  itemCard: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
    padding: spacing.sm,
  },
  imageCredit: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 14,
    paddingTop: 4,
  },
  itemMeta: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  itemText: {
    color: palette.text,
    fontSize: 12,
    lineHeight: 17,
  },
  itemTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  contentColumn: {
    flex: 1,
    gap: 6,
  },
  list: {
    gap: spacing.xs,
  },
  itemLayout: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  itemLayoutCompact: {
    flexDirection: 'column',
  },
  mediaColumn: {
    maxWidth: 320,
    minWidth: 220,
    width: '33%',
  },
  mediaColumnCompact: {
    maxWidth: 999,
    minWidth: 0,
    width: '100%',
  },
  previewImage: {
    backgroundColor: '#223329',
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    aspectRatio: 4 / 3,
    resizeMode: 'contain',
    width: '100%',
  },
  previewFallback: {
    alignItems: 'center',
    backgroundColor: palette.stone,
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 6,
    justifyContent: 'center',
    aspectRatio: 4 / 3,
    minHeight: 120,
    paddingHorizontal: spacing.sm,
  },
  previewFallbackText: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
  previewEmoji: {
    fontSize: 34,
    lineHeight: 40,
  },
  previewFallbackTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  referenceChip: {
    backgroundColor: '#E2ECE6',
    borderColor: palette.primary,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  referenceText: {
    color: palette.text,
    fontSize: 10,
    lineHeight: 14,
  },
  referenceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  section: {
    gap: spacing.xs,
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
});
