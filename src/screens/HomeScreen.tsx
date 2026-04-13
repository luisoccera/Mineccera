import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CommonGuidesPanel } from '../components/CommonGuidesPanel';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const sources = [
  { label: 'Minecraft Diamond Ore (Wiki)', url: 'https://minecraft.wiki/w/Diamond_Ore' },
  { label: 'Anvil Mechanics', url: 'https://minecraft.wiki/w/Anvil_mechanics' },
  { label: 'Chunkbase Seed Map', url: 'https://www.chunkbase.com/apps/seed-map' },
];

export function HomeScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <LinearGradient
        colors={['#6AA84F', '#8B5A2B', '#4F8A3A']}
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

const styles = StyleSheet.create({
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
    backgroundColor: '#EFE7D4',
    borderColor: '#D2C19B',
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
