import { ScrollView, StyleSheet, Text } from 'react-native';
import { CommonGuidesPanel } from '../components/CommonGuidesPanel';
import { FarmSearchPanel } from '../components/FarmSearchPanel';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { palette, spacing } from '../theme';

export function BuildIdeasScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Aqui se muestra solo lo mas comun para jugar mejor en Java y Bedrock"
        title="Construcciones y Granjas Clave"
      >
        <CommonGuidesPanel />
      </SectionCard>

      <SectionCard
        subtitle="Buscador detallado de granjas con fuente principal en Minecraft Wiki y guias tecnicas confiables"
        title="Buscador De Granjas"
      >
        <FarmSearchPanel />
      </SectionCard>

      <Text style={styles.legalText}>
        Fuentes principales: Minecraft Wiki + guias tecnicas verificadas por granja.
      </Text>
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
  legalText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
});
