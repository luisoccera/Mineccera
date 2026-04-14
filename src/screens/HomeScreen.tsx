import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CommonGuidesPanel } from '../components/CommonGuidesPanel';
import { SectionCard } from '../components/SectionCard';
import { biomeCodex, creatureCodex, floraCodex, type CodexEntry } from '../data/worldCodex';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const sources = [
  { label: 'Minecraft Diamond Ore (Wiki)', url: 'https://minecraft.wiki/w/Diamond_Ore' },
  { label: 'Anvil Mechanics', url: 'https://minecraft.wiki/w/Anvil_mechanics' },
  { label: 'Chunkbase Seed Map', url: 'https://www.chunkbase.com/apps/seed-map' },
  { label: 'Minecraft Wiki: Biome', url: 'https://minecraft.wiki/w/Biome' },
  { label: 'Minecraft Wiki: Wolf', url: 'https://minecraft.wiki/w/Wolf' },
  { label: 'Minecraft Wiki: Cat', url: 'https://minecraft.wiki/w/Cat' },
  { label: 'Minecraft Wiki: Zombie', url: 'https://minecraft.wiki/w/Zombie' },
];

export function HomeScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <LinearGradient
        colors={['#5E7462', '#6A7F70', '#4C6458']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[styles.hero, compact && styles.heroCompact]}
      >
        <Text style={[styles.heroTitle, compact && styles.heroTitleCompact]}>Guia Pro Minecraft</Text>
        <Text style={[styles.welcomeText, compact && styles.welcomeTextCompact]}>
          welcome to the final... al realm de Luisoccera 8)
        </Text>
        <Text style={[styles.heroSubtitle, compact && styles.heroSubtitleCompact]}>
          Resuelve dudas rapido: diamantes, capas, encantamientos, seeds y estructuras.
        </Text>
      </LinearGradient>

      <SectionCard
        subtitle="Solo contenido clave: construcciones comunes, recetas de encantamiento y granjas importantes"
        title="Guia Base Del Juego"
      >
        <CommonGuidesPanel showAll={false} />
      </SectionCard>

      <SectionCard
        subtitle="Biomas, criaturas y flora con rareza para que sepas que farmear y donde explorar"
        title="Codex De Mundo"
      >
        <Text style={styles.codexTitle}>Biomas clave</Text>
        <View style={[styles.codexGrid, compact && styles.codexGridCompact]}>
          {biomeCodex.map((entry) => (
            <CodexCard compact={compact} entry={entry} key={entry.id} />
          ))}
        </View>

        <Text style={styles.codexTitle}>Criaturas y mobs</Text>
        <View style={[styles.codexGrid, compact && styles.codexGridCompact]}>
          {creatureCodex.map((entry) => (
            <CodexCard compact={compact} entry={entry} key={entry.id} />
          ))}
        </View>

        <Text style={styles.codexTitle}>Plantas y especies</Text>
        <View style={[styles.codexGrid, compact && styles.codexGridCompact]}>
          {floraCodex.map((entry) => (
            <CodexCard compact={compact} entry={entry} key={entry.id} />
          ))}
        </View>
      </SectionCard>

      <SectionCard subtitle="Referencias base del proyecto." title="Fuentes usadas">
        <View style={styles.sourceList}>
          {sources.map((source) => (
            <Pressable key={source.url} onPress={() => Linking.openURL(source.url)} style={styles.sourceButton}>
              <Text style={styles.sourceButtonText}>{source.label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

function CodexCard({ compact, entry }: { compact: boolean; entry: CodexEntry }) {
  const rarityStyle =
    entry.rarity === 'Muy raro'
      ? styles.badgeVeryRare
      : entry.rarity === 'Raro'
        ? styles.badgeRare
        : entry.rarity === 'Poco común'
          ? styles.badgeUncommon
          : styles.badgeCommon;

  return (
    <View style={[styles.codexCard, compact && styles.codexCardCompact]}>
      <View style={styles.codexHead}>
        <Text numberOfLines={1} style={styles.codexName}>
          {entry.name}
        </Text>
        <Text style={[styles.codexBadge, rarityStyle]}>{entry.rarity}</Text>
      </View>
      <Text style={styles.codexFound}>Donde: {entry.foundIn}</Text>
      <Text style={styles.codexNotes}>{entry.notes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeCommon: {
    backgroundColor: '#DCEADB',
    borderColor: '#95B49A',
  },
  badgeRare: {
    backgroundColor: '#E7E3F2',
    borderColor: '#AAA0CF',
  },
  badgeUncommon: {
    backgroundColor: '#E3ECEF',
    borderColor: '#9AB2BF',
  },
  badgeVeryRare: {
    backgroundColor: '#EEE2D8',
    borderColor: '#C8A98F',
  },
  codexBadge: {
    borderRadius: radius.chip,
    borderWidth: 1,
    color: palette.text,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  codexCard: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
    padding: spacing.sm,
    width: '32%',
  },
  codexCardCompact: {
    width: '100%',
  },
  codexFound: {
    color: palette.secondary,
    fontSize: 10,
    lineHeight: 14,
  },
  codexGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  codexGridCompact: {
    flexDirection: 'column',
  },
  codexHead: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  codexName: {
    color: palette.text,
    flex: 1,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  codexNotes: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  codexTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.xs,
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
  hero: {
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  heroCompact: {
    gap: spacing.xs,
    padding: spacing.md,
  },
  heroSubtitle: {
    color: '#F7F1E1',
    fontSize: 12,
    lineHeight: 19,
  },
  heroSubtitleCompact: {
    fontSize: 11,
    lineHeight: 16,
  },
  heroTitle: {
    color: '#F7F1E1',
    fontFamily: font.pixel,
    fontSize: 14,
    lineHeight: 22,
  },
  heroTitleCompact: {
    fontSize: 12,
    lineHeight: 18,
  },
  welcomeText: {
    color: '#F7F1E1',
    fontFamily: font.pixel,
    fontSize: 9,
    lineHeight: 16,
  },
  welcomeTextCompact: {
    fontSize: 8,
    lineHeight: 14,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  sourceButton: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.woodSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  sourceButtonText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 13,
  },
  sourceList: {
    gap: spacing.xs,
  },
});
