import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const CREATURES_WIKI_URL = 'https://minecraft.fandom.com/es/wiki/Criatura';

export function HomeScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Catalogo oficial de criaturas y mobs en Minecraft Fandom (espanol)"
        title="Criaturas De Minecraft"
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Fuente seleccionada</Text>
          <Text style={styles.infoText}>{CREATURES_WIKI_URL}</Text>
          <Text style={styles.infoText}>
            Aqui se centraliza todo el contenido de criaturas en un solo lugar, en lugar del bestiario local.
          </Text>
        </View>

        <Pressable onPress={() => Linking.openURL(CREATURES_WIKI_URL)} style={styles.openButton}>
          <Text style={styles.openButtonText}>Abrir Guia De Criaturas</Text>
        </Pressable>
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
  infoBox: {
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
    padding: spacing.sm,
  },
  infoTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  infoText: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  openButton: {
    alignItems: 'center',
    backgroundColor: '#DEECE3',
    borderColor: palette.primary,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: 10,
  },
  openButtonText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
});
