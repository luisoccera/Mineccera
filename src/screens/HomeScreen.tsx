import { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { monsterCodex, type MonsterStatEntry } from '../data/worldCodex';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

const wikiTitleByMonsterId: Record<string, string> = {
  blaze: 'Blaze',
  bogged: 'Bogged',
  cave_spider: 'Cave Spider',
  creeper: 'Creeper',
  drowned: 'Drowned',
  elder_guardian: 'Elder Guardian',
  enderman: 'Enderman',
  endermite: 'Endermite',
  evoker: 'Evoker',
  ghast: 'Ghast',
  guardian: 'Guardian',
  hoglin: 'Hoglin',
  husk: 'Husk',
  magma_cube: 'Magma Cube',
  phantom: 'Phantom',
  piglin_brute: 'Piglin Brute',
  pillager: 'Pillager',
  ravager: 'Ravager',
  shulker: 'Shulker',
  silverfish: 'Silverfish',
  skeleton: 'Skeleton',
  slime: 'Slime',
  spider: 'Spider',
  stray: 'Stray',
  vindicator: 'Vindicator',
  warden: 'Warden',
  witch: 'Witch',
  wither_skeleton: 'Wither Skeleton',
  zombie: 'Zombie',
};

const normalizeWikiTitle = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/_/g, ' ');

const chunk = <T,>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const proxifyImage = (url?: string) => {
  const clean = (url || '').trim();
  if (!clean || clean.startsWith('data:')) {
    return '';
  }
  const normalized = clean.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(normalized)}&w=128&h=128&fit=inside`;
};

const realmMembers = [
  'Cucha',
  'Kike',
  'Raúl',
  'Tete',
  'Ash',
  'Miki',
  'Gallipro',
  'H Tlacuache',
  'Camila',
  'Garzón',
  'Luisoccera',
  'Morado',
];

const pinkMembers = new Set(['Ash', 'Tete', 'Camila', 'H Tlacuache']);

export function HomeScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const wideCards = deviceClass === 'desktop' || deviceClass === 'xl';
  const [wikiImageById, setWikiImageById] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadWikiMonsterImages = async () => {
      try {
        const titles = monsterCodex.map((entry) => wikiTitleByMonsterId[entry.id] || entry.name);
        const titleToImage: Record<string, string> = {};

        for (const titleChunk of chunk(titles, 10)) {
          const response = await fetch(
            `https://minecraft.wiki/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=256&pilimit=max&titles=${encodeURIComponent(
              titleChunk.join('|'),
            )}`,
          );
          if (!response.ok) {
            continue;
          }

          const json = (await response.json()) as {
            query?: {
              pages?: Record<
                string,
                {
                  title?: string;
                  thumbnail?: { source?: string };
                }
              >;
            };
          };

          const pages = json.query?.pages || {};
          Object.values(pages).forEach((page) => {
            if (!page?.title || !page?.thumbnail?.source) {
              return;
            }
            titleToImage[normalizeWikiTitle(page.title)] = page.thumbnail.source;
          });
        }

        if (cancelled) {
          return;
        }

        const byId: Record<string, string> = {};
        monsterCodex.forEach((entry) => {
          const title = wikiTitleByMonsterId[entry.id] || entry.name;
          const wikiImg = titleToImage[normalizeWikiTitle(title)];
          if (wikiImg) {
            byId[entry.id] = wikiImg;
          }
        });
        setWikiImageById(byId);
      } catch {
        if (!cancelled) {
          setWikiImageById({});
        }
      }
    };

    loadWikiMonsterImages();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Explora guias, mapas, encantamientos, proyectos y skins"
        title="Bienvenido Al Realm de la Unión Barbies"
      >
        <Text style={styles.welcomeText}>Miembros del realm:</Text>
        <View style={styles.memberGrid}>
          {realmMembers.map((member) => (
            <View key={member} style={[styles.memberChip, pinkMembers.has(member) ? styles.memberChipPink : styles.memberChipBlue]}>
              <Text style={styles.memberChipText}>{member}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard
        subtitle="Informacion completa dentro de la app: vida, dano, spawn, XP, drops y notas"
        title="Bestiario De Criaturas (Sin Enlaces Externos)"
      >
        <View style={styles.legendRow}>
          <Text style={styles.legendText}>Vida = HP totales | Dano = por golpe/ataque</Text>
          <Text style={styles.legendText}>XP = experiencia al matar | Drops = loot principal</Text>
          <Text style={styles.legendText}>Sin enlaces externos: toda la guia queda integrada aqui.</Text>
        </View>

        <View style={[styles.monsterGrid, compact && styles.monsterGridCompact]}>
          {monsterCodex.map((entry) => (
            <MonsterCard
              compact={compact}
              entry={entry}
              key={entry.id}
              wikiImageUrl={wikiImageById[entry.id]}
              wideCards={wideCards}
            />
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

function MonsterCard({
  compact,
  entry,
  wikiImageUrl,
  wideCards,
}: {
  compact: boolean;
  entry: MonsterStatEntry;
  wikiImageUrl?: string;
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
          <MonsterImage
            backupImageUrl={entry.backupImageUrl}
            imageUrl={entry.imageUrl}
            name={entry.name}
            wikiImageUrl={wikiImageUrl}
          />
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
  const safe = name.replace(/[<>&"]/g, '').slice(0, 22);
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
<text x='64' y='82' text-anchor='middle' font-family='Verdana, Arial, sans-serif' font-size='10' fill='#D7D1C2'>${safe}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function MonsterImage({
  backupImageUrl,
  imageUrl,
  name,
  wikiImageUrl,
}: {
  backupImageUrl?: string;
  imageUrl: string;
  name: string;
  wikiImageUrl?: string;
}) {
  const [index, setIndex] = useState(0);
  const candidates = useMemo(() => {
    const list = [
      wikiImageUrl,
      proxifyImage(wikiImageUrl),
      imageUrl,
      proxifyImage(imageUrl),
      backupImageUrl,
      proxifyImage(backupImageUrl),
      toMonsterPlaceholderImage(name),
    ];
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
  }, [backupImageUrl, imageUrl, name, wikiImageUrl]);

  const active = candidates[index] || candidates[candidates.length - 1];

  return (
    <Image
      onError={() => {
        const next = index + 1;
        setIndex(next >= candidates.length ? candidates.length - 1 : next);
      }}
      source={{ uri: active }}
      style={styles.monsterImage}
    />
  );
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
  legendRow: {
    gap: 2,
    marginBottom: spacing.sm,
  },
  legendText: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 15,
  },
  memberChip: {
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  memberChipBlue: {
    backgroundColor: '#DEE9FA',
    borderColor: '#6F93CC',
  },
  memberChipPink: {
    backgroundColor: '#F9DFEE',
    borderColor: '#D58CB5',
  },
  memberChipText: {
    color: palette.text,
    fontFamily: font.body,
    fontSize: 12,
    fontWeight: '600',
  },
  memberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
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
    color: palette.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
