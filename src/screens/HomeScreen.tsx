import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { monsterCodex, type MonsterStatEntry } from '../data/worldCodex';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const sources = [
  { label: 'Minecraft Wiki: Hostile mobs', url: 'https://minecraft.wiki/w/Monster' },
  { label: 'Minecraft Wiki: Zombie', url: 'https://minecraft.wiki/w/Zombie' },
  { label: 'Minecraft Wiki: Creeper', url: 'https://minecraft.wiki/w/Creeper' },
  { label: 'Minecraft Wiki: Enderman', url: 'https://minecraft.wiki/w/Enderman' },
  { label: 'Minecraft Wiki: Witch', url: 'https://minecraft.wiki/w/Witch' },
  { label: 'Minecraft Wiki: Slime', url: 'https://minecraft.wiki/w/Slime' },
];

export function HomeScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const wideCards = deviceClass === 'desktop' || deviceClass === 'xl';

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
          Bestiario rapido con stats reales para combate, farmeo y rutas seguras.
        </Text>
      </LinearGradient>

      <SectionCard
        subtitle="Desglose de monstruos con imagen, vida, dano, spawn, XP y drops"
        title="Bestiario De Monstruos"
      >
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Vida = HP totales | Dano = dano por golpe/ataque</Text>
          <Text style={styles.legendText}>XP = experiencia al matar | Drops = loot principal</Text>
        </View>

        <View style={[styles.monsterGrid, compact && styles.monsterGridCompact]}>
          {monsterCodex.map((entry) => (
            <MonsterCard
              compact={compact}
              entry={entry}
              key={entry.id}
              wideCards={wideCards}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard subtitle="Referencias base del bestiario." title="Fuentes usadas">
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

function MonsterCard({
  compact,
  entry,
  wideCards,
}: {
  compact: boolean;
  entry: MonsterStatEntry;
  wideCards: boolean;
}) {
  const rarityStyle =
    entry.rarity === 'Muy raro'
      ? styles.badgeVeryRare
      : entry.rarity === 'Raro'
        ? styles.badgeRare
        : entry.rarity === 'Poco común'
          ? styles.badgeUncommon
          : styles.badgeCommon;

  return (
    <View
      style={[
        styles.monsterCard,
        compact && styles.monsterCardCompact,
        !compact && wideCards ? styles.monsterCardWide : styles.monsterCardNarrow,
      ]}
    >
      <View style={styles.monsterHeader}>
        <View style={styles.monsterImageWrap}>
          <MonsterImage backupImageUrl={entry.backupImageUrl} imageUrl={entry.imageUrl} name={entry.name} />
        </View>
        <View style={styles.monsterHeaderBody}>
          <Text numberOfLines={2} style={styles.monsterName}>
            {entry.name}
          </Text>
          <Text style={[styles.monsterBadge, rarityStyle]}>{entry.rarity}</Text>
        </View>
      </View>

      <View style={styles.statsBox}>
        <StatLine label="Vida" value={entry.health} />
        <StatLine label="Dano" value={entry.attack} />
        <StatLine label="XP" value={entry.xp} />
        <StatLine label="Spawn" value={entry.spawn} />
      </View>

      <Text style={styles.monsterMeta}>Zona: {entry.foundIn}</Text>
      <Text style={styles.monsterNotes}>Drops: {entry.drops}</Text>
      <Text style={styles.monsterNotes}>{entry.notes}</Text>
    </View>
  );
}

const toMonsterPlaceholderImage = (name: string) => {
  const safe = name.replace(/[<>&"]/g, '').slice(0, 20);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
<defs>
<linearGradient id='m' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='#31473A'/>
<stop offset='100%' stop-color='#1F2F25'/>
</linearGradient>
</defs>
<rect width='128' height='128' fill='url(#m)'/>
<rect x='8' y='8' width='112' height='112' rx='12' fill='#2D4436' stroke='#83A08A' stroke-width='3'/>
<text x='64' y='58' text-anchor='middle' font-family='Verdana, Arial, sans-serif' font-size='14' font-weight='700' fill='#EDE7D7'>Mob</text>
<text x='64' y='82' text-anchor='middle' font-family='Verdana, Arial, sans-serif' font-size='11' fill='#D7D1C2'>${safe}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function MonsterImage({
  backupImageUrl,
  imageUrl,
  name,
}: {
  backupImageUrl?: string;
  imageUrl: string;
  name: string;
}) {
  const [index, setIndex] = useState(0);
  const candidates = useMemo(() => {
    const list = [imageUrl, backupImageUrl, toMonsterPlaceholderImage(name)];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const item of list) {
      const clean = (item || '').trim();
      if (!clean || seen.has(clean)) {
        continue;
      }
      seen.add(clean);
      unique.push(clean);
    }
    return unique;
  }, [backupImageUrl, imageUrl, name]);

  const active = candidates[index] || candidates[candidates.length - 1];
  return <Image onError={() => setIndex((prev) => prev + 1)} source={{ uri: active }} style={styles.monsterImage} />;
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statLine}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
  legendRow: {
    gap: 2,
    marginBottom: spacing.sm,
  },
  legendText: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 15,
  },
  monsterBadge: {
    borderRadius: radius.chip,
    borderWidth: 1,
    color: palette.text,
    fontSize: 10,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  monsterCard: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.sm,
  },
  monsterCardCompact: {
    width: '100%',
  },
  monsterCardNarrow: {
    width: '49%',
  },
  monsterCardWide: {
    width: '32.5%',
  },
  monsterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  monsterGridCompact: {
    flexDirection: 'column',
  },
  monsterHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  monsterHeaderBody: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  monsterImage: {
    height: 46,
    width: 46,
  },
  monsterImageWrap: {
    alignItems: 'center',
    backgroundColor: '#DFE6E1',
    borderColor: '#A3B3A8',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  monsterMeta: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 14,
  },
  monsterName: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  monsterNotes: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 15,
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
  statLabel: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 10,
    minWidth: 44,
  },
  statLine: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 6,
  },
  statsBox: {
    backgroundColor: '#EAF0EC',
    borderColor: '#B7C5BC',
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 4,
    padding: spacing.xs,
  },
  statValue: {
    color: palette.text,
    flex: 1,
    fontSize: 10,
    lineHeight: 14,
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
});
