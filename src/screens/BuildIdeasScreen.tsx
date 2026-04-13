import { ScrollView, StyleSheet, Text } from 'react-native';
import { CommonGuidesPanel } from '../components/CommonGuidesPanel';
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

      <Text style={styles.legalText}>
        Guia curada para evitar resultados aleatorios o poco utiles.
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
