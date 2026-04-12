import { useState } from 'react';
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
                  <GuidePreview title={item.name} uri={item.imageUrl} />
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
                  <GuidePreview title={item.title} uri={item.imageUrl} />
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
                  <GuidePreview title={item.name} uri={item.imageUrl} />
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

function GuidePreview({ title, uri }: { title: string; uri: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View style={styles.previewFallback}>
        <Text style={styles.previewFallbackTitle}>{title}</Text>
        <Text style={styles.previewFallbackText}>No se pudo cargar imagen externa. Revisa las fuentes abajo.</Text>
      </View>
    );
  }

  return <Image onError={() => setHasError(true)} source={{ uri }} style={styles.previewImage} />;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  itemCard: {
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
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
    backgroundColor: '#1E1A13',
    borderColor: '#CFBE95',
    borderRadius: radius.sm,
    borderWidth: 1,
    aspectRatio: 4 / 3,
    resizeMode: 'contain',
    width: '100%',
  },
  previewFallback: {
    alignItems: 'center',
    backgroundColor: '#E6DABF',
    borderColor: '#CFBE95',
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
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },
  previewFallbackTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  referenceChip: {
    backgroundColor: '#EAF2E6',
    borderColor: '#9CBF8D',
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
