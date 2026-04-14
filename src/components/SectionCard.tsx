import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

type SectionCardProps = PropsWithChildren<{
  subtitle?: string;
  title: string;
}>;

export function SectionCard({ children, subtitle, title }: SectionCardProps) {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const tablet = deviceClass === 'tablet';

  return (
    <View style={[styles.card, compact && styles.cardCompact, !compact && styles.cardLarge]}>
      <Text style={[styles.title, compact && styles.titleCompact, tablet && styles.titleTablet]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.card,
    borderWidth: 2,
    gap: spacing.xs,
    shadowColor: '#25322A',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: spacing.md,
  },
  cardCompact: {
    borderWidth: 1.5,
    padding: spacing.sm,
  },
  cardLarge: {
    padding: spacing.lg,
  },
  content: {
    marginTop: spacing.xs,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  subtitleCompact: {
    fontSize: 11,
    lineHeight: 16,
  },
  title: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 21,
  },
  titleCompact: {
    fontSize: 14,
    lineHeight: 18,
  },
  titleTablet: {
    fontSize: 15,
  },
});
