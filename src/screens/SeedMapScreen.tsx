import { createElement, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

type PlatformId = 'bedrock_1_21' | 'java_1_21';
type ViewMode = 'map' | 'structureFinder';

interface StructureFinder {
  id: string;
  label: string;
}

const structureFinders: StructureFinder[] = [
  { id: 'amethyst-geode-finder', label: 'Geodas de amatista' },
  { id: 'ancient-city-finder', label: 'Ancient City' },
  { id: 'bastion-remnant-finder', label: 'Bastion Remnant' },
  { id: 'biome-finder', label: 'Biomas' },
  { id: 'block-compendium', label: 'Block Compendium' },
  { id: 'buried-treasure-finder', label: 'Tesoro enterrado' },
  { id: 'desert-temple-finder', label: 'Templo del desierto' },
  { id: 'dungeon-finder', label: 'Dungeons' },
  { id: 'endcity-finder', label: 'End City' },
  { id: 'end-gateway-finder', label: 'End Gateway' },
  { id: 'fossil-finder', label: 'Fosiles' },
  { id: 'igloo-finder', label: 'Iglus' },
  { id: 'jungle-temple-finder', label: 'Templo de jungla' },
  { id: 'village-finder', label: 'Aldeas' },
  { id: 'mineshaft-finder', label: 'Mineshaft' },
  { id: 'nether-fortress-finder', label: 'Fortaleza del Nether' },
  { id: 'ocean-ruin-finder', label: 'Ruinas oceanicas' },
  { id: 'pillager-outpost-finder', label: 'Outpost saqueador' },
  { id: 'ravine-finder', label: 'Barrancos' },
  { id: 'ruined-portal-finder', label: 'Portal en ruinas' },
  { id: 'seed-finder-slimes', label: 'Seed Finder (Slimes)' },
  { id: 'shipwreck-finder', label: 'Barcos hundidos' },
  { id: 'slime-finder', label: 'Slime Chunks' },
  { id: 'spawn-chunks-reader', label: 'Spawn Chunks Reader' },
  { id: 'stronghold-finder', label: 'Stronghold' },
  { id: 'superflat-generator', label: 'Superflat Generator' },
  { id: 'mansion-finder', label: 'Mansion' },
  { id: 'ocean-monument-finder', label: 'Monumento oceanico' },
  { id: 'witch-hut-finder', label: 'Witch Hut' },
];

const platforms: Array<{ id: PlatformId; label: string }> = [
  { id: 'java_1_21', label: 'Java 1.21+' },
  { id: 'bedrock_1_21', label: 'Bedrock 1.21+' },
];

const normalizeCoordinateInput = (input: string) => {
  const value = input.replace(',', '.');
  let output = '';
  let hasMinus = false;
  let hasDot = false;
  let decimals = 0;

  for (const char of value) {
    if (char >= '0' && char <= '9') {
      if (hasDot) {
        if (decimals < 3) {
          output += char;
          decimals += 1;
        }
      } else {
        output += char;
      }
      continue;
    }

    if (char === '-' && !hasMinus && output.length === 0) {
      output += char;
      hasMinus = true;
      continue;
    }

    if (char === '.' && !hasDot) {
      output += char;
      hasDot = true;
      continue;
    }
  }

  return output;
};

const safeCoordinate = (value: string) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Number(parsed.toFixed(3));
  }
  return 0;
};

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const webIframeStyle = {
  backgroundColor: '#122214',
  border: '0',
  height: '100%',
  width: '100%',
} as const;

export function SeedMapScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [seed, setSeed] = useState('0');
  const [x, setX] = useState('0');
  const [y, setY] = useState('0');
  const [z, setZ] = useState('0');
  const [platform, setPlatform] = useState<PlatformId>('java_1_21');
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [finder, setFinder] = useState<StructureFinder['id']>('village-finder');
  const [finderSearch, setFinderSearch] = useState('');
  const [nonce, setNonce] = useState(0);

  const filteredFinders = useMemo(() => {
    const query = normalizeSearch(finderSearch.trim());
    if (!query) {
      return structureFinders;
    }

    return structureFinders.filter((finderOption) => {
      const label = normalizeSearch(finderOption.label);
      const id = normalizeSearch(finderOption.id);
      return label.includes(query) || id.includes(query);
    });
  }, [finderSearch]);

  const finalUrl = useMemo(() => {
    const baseUrl =
      viewMode === 'map'
        ? 'https://www.chunkbase.com/apps/seed-map'
        : `https://www.chunkbase.com/apps/${finder}`;

    const params = [
      `seed=${encodeURIComponent(seed.trim() || '0')}`,
      `platform=${platform}`,
      'dimension=overworld',
      `x=${safeCoordinate(x)}`,
      `y=${safeCoordinate(y)}`,
      `z=${safeCoordinate(z)}`,
      'zoom=0.5',
    ].join('&');

    return `${baseUrl}#${params}`;
  }, [finder, platform, seed, viewMode, x, y, z]);

  const embeddedWebMapUrl = useMemo(() => {
    const cleanSeed = encodeURIComponent(seed.trim() || '0');
    const safeX = Math.round(safeCoordinate(x));
    const safeZ = Math.round(safeCoordinate(z));

    if (platform === 'java_1_21') {
      return `https://www.mcseeder.com/?seed=${cleanSeed}&version=1.21.11`;
    }

    const params = [
      `seed=${cleanSeed}`,
      `playerX=${safeX}`,
      `playerZ=${safeZ}`,
      `version=${encodeURIComponent('Bedrock 1.21.120')}`,
    ].join('&');

    return `https://www.minecraft-seedmap.com/seed-map/ores/diamonds?${params}`;
  }, [platform, seed, x, z]);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Usa semilla + coordenadas para abrir mapa y buscadores de estructuras"
        title="Mapa De Seed Y Estructuras"
      >
        <Text style={styles.label}>Seed</Text>
        <TextInput onChangeText={setSeed} placeholder="Ejemplo: -123456789" style={styles.input} value={seed} />

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>X</Text>
            <TextInput
              keyboardType="default"
              onChangeText={(value) => setX(normalizeCoordinateInput(value))}
              placeholder="-123.456"
                style={[styles.input, compact && styles.inputCompact]}
                value={x}
              />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Y</Text>
            <TextInput
              keyboardType="default"
              onChangeText={(value) => setY(normalizeCoordinateInput(value))}
              placeholder="64"
                style={[styles.input, compact && styles.inputCompact]}
                value={y}
              />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Z</Text>
            <TextInput
              keyboardType="default"
              onChangeText={(value) => setZ(normalizeCoordinateInput(value))}
              placeholder="987.654"
                style={[styles.input, compact && styles.inputCompact]}
                value={z}
              />
          </View>
        </View>

        <Text style={styles.label}>Edicion</Text>
        <View style={styles.chips}>
          {platforms.map((platformOption) => {
            const active = platformOption.id === platform;
            return (
              <Pressable
                key={platformOption.id}
                onPress={() => setPlatform(platformOption.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{platformOption.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Modo</Text>
        <View style={styles.chips}>
          {[
            { id: 'map' as const, label: 'Mapa completo' },
            { id: 'structureFinder' as const, label: 'Buscador cercano' },
          ].map((modeOption) => {
            const active = modeOption.id === viewMode;
            return (
              <Pressable
                key={modeOption.id}
                onPress={() => setViewMode(modeOption.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{modeOption.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {viewMode === 'structureFinder' ? (
          <View style={styles.finderArea}>
            <Text style={styles.label}>Tipo de estructura / herramienta Chunkbase</Text>
            <View style={styles.searchRow}>
              <TextInput
                onChangeText={setFinderSearch}
                placeholder="Buscar (ej: stronghold, aldea, nether...)"
                style={[styles.input, compact && styles.inputCompact, styles.searchInput]}
                value={finderSearch}
              />
              <Pressable
                onPress={() => {
                  if (!filteredFinders.length) {
                    return;
                  }
                  setFinder(filteredFinders[0].id);
                  setNonce((value) => value + 1);
                }}
                style={[styles.searchButton, compact && styles.searchButtonCompact]}
              >
                <Text style={styles.searchButtonText}>Buscar</Text>
              </Pressable>
            </View>
            <View style={styles.chips}>
              {filteredFinders.map((finderOption) => {
                const active = finderOption.id === finder;
                return (
                  <Pressable
                    key={finderOption.id}
                    onPress={() => setFinder(finderOption.id)}
                    style={[styles.chip, active && styles.chipActiveSecondary]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActiveSecondary]}>
                      {finderOption.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {!filteredFinders.length ? (
              <Text style={styles.emptyResultText}>Sin resultados para esa busqueda.</Text>
            ) : null}
          </View>
        ) : null}

        <Pressable onPress={() => setNonce((value) => value + 1)} style={styles.reloadButton}>
          <Text style={styles.reloadButtonText}>Actualizar Vista</Text>
        </Pressable>
      </SectionCard>

      <SectionCard
        subtitle="La vista de abajo se centra en las coordenadas que indiques"
        title="Vista Integrada"
      >
        <Text style={styles.urlPreview} numberOfLines={2}>
          {Platform.OS === 'web' ? embeddedWebMapUrl : finalUrl}
        </Text>
        {Platform.OS === 'web' ? (
          <Text style={styles.providerText}>
            Mapa web integrado con proveedor alterno (McSeeder / Minecraft Seed Map).
          </Text>
        ) : null}
        <View style={styles.webviewWrapper}>
          {Platform.OS === 'web' ? (
            createElement('iframe', {
              key: `${embeddedWebMapUrl}-${nonce}`,
              loading: 'lazy',
              referrerPolicy: 'no-referrer-when-downgrade',
              src: embeddedWebMapUrl,
              style: webIframeStyle,
              title: 'Mapa integrado de seed',
            })
          ) : (
            <WebView
              key={`${finalUrl}-${nonce}`}
              javaScriptEnabled
              originWhitelist={['*']}
              source={{ uri: finalUrl }}
              style={styles.webview}
            />
          )}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: '#DFF4E8',
    borderColor: palette.primary,
  },
  chipActiveSecondary: {
    backgroundColor: '#FFF5E9',
    borderColor: '#F5D4A5',
  },
  chipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: palette.primaryDark,
  },
  chipTextActiveSecondary: {
    color: palette.secondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  content: {
    gap: spacing.md,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  contentCompact: {
    paddingHorizontal: spacing.sm,
  },
  finderArea: {
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  inputCompact: {
    fontSize: 13,
  },
  inputGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  reloadButton: {
    alignItems: 'center',
    backgroundColor: '#FFF5E9',
    borderColor: '#F5D4A5',
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    paddingVertical: 12,
  },
  reloadButtonText: {
    color: palette.secondary,
    fontFamily: font.display,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowCompact: {
    flexDirection: 'column',
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderColor: '#C0DEC8',
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  searchButtonCompact: {
    minHeight: 40,
  },
  searchButtonText: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 11,
  },
  searchInput: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  emptyResultText: {
    color: palette.muted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  urlPreview: {
    color: palette.muted,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  providerText: {
    color: palette.muted,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  webview: {
    flex: 1,
  },
  webviewWrapper: {
    borderColor: '#D7E2EE',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 500,
    overflow: 'hidden',
  },
});
