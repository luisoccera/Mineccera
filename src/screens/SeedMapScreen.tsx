import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  generateStructurePoints,
  structureDistance,
  structureLayers,
  type SeedDimension,
  type SeedEdition,
} from '../utils/seedExplorer';

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

const normalizePositiveInt = (input: string) => input.replace(/[^\d]/g, '');

const parseCoordinate = (value: string) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed)) {
    return Number(parsed.toFixed(3));
  }
  return 0;
};

const parseRadius = (value: string) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.max(800, Math.min(12000, Math.round(parsed)));
  }
  return 2500;
};

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const editions: Array<{ id: SeedEdition; label: string }> = [
  { id: 'java_1_21', label: 'Java 1.21+' },
  { id: 'bedrock_1_21', label: 'Bedrock 1.21+' },
];

const dimensions: Array<{ id: SeedDimension; label: string }> = [
  { id: 'overworld', label: 'Overworld' },
  { id: 'nether', label: 'Nether' },
  { id: 'end', label: 'End' },
];

export function SeedMapScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const { width } = useWindowDimensions();

  const [seed, setSeed] = useState('0');
  const [x, setX] = useState('0');
  const [y, setY] = useState('64');
  const [z, setZ] = useState('0');
  const [radiusInput, setRadiusInput] = useState('2500');
  const [edition, setEdition] = useState<SeedEdition>('java_1_21');
  const [dimension, setDimension] = useState<SeedDimension>('overworld');
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState('');
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [activeLayers, setActiveLayers] = useState<string[]>(
    structureLayers.filter((layer) => layer.dimension === 'overworld').map((layer) => layer.id)
  );

  const availableLayers = useMemo(
    () => structureLayers.filter((layer) => layer.dimension === dimension),
    [dimension]
  );

  useEffect(() => {
    const allowedIds = new Set(availableLayers.map((layer) => layer.id));
    setActiveLayers((prev) => {
      const filtered = prev.filter((id) => allowedIds.has(id));
      return filtered.length ? filtered : availableLayers.map((layer) => layer.id);
    });
  }, [availableLayers]);

  const filteredLayers = useMemo(() => {
    const query = normalizeSearch(search.trim());
    if (!query) {
      return availableLayers;
    }

    return availableLayers.filter((layer) => {
      const byName = normalizeSearch(layer.name).includes(query);
      const byDescription = normalizeSearch(layer.description).includes(query);
      return byName || byDescription;
    });
  }, [availableLayers, search]);

  const centerX = parseCoordinate(x);
  const centerZ = parseCoordinate(z);
  const radiusBlocks = parseRadius(radiusInput);
  const effectiveRadius = Math.max(400, Math.round(radiusBlocks / zoom));

  const rawPoints = useMemo(
    () =>
      generateStructurePoints({
        activeLayers,
        centerX,
        centerZ,
        dimension,
        edition,
        radius: effectiveRadius,
        seed,
      }),
    [activeLayers, centerX, centerZ, dimension, edition, effectiveRadius, seed]
  );

  const layerById = useMemo(() => {
    const map = new Map<string, (typeof structureLayers)[number]>();
    for (const layer of structureLayers) {
      map.set(layer.id, layer);
    }
    return map;
  }, []);

  const mapSize = useMemo(() => {
    const sidePadding = compact ? 36 : 70;
    return Math.max(260, Math.min(width - sidePadding, compact ? 380 : 660));
  }, [compact, width]);

  const markers = useMemo(() => {
    const half = mapSize / 2;
    return rawPoints
      .map((point) => {
        const layer = layerById.get(point.layerId);
        if (!layer) {
          return null;
        }
        const left = half + ((point.x - centerX) / effectiveRadius) * half;
        const top = half + ((point.z - centerZ) / effectiveRadius) * half;
        const distance = structureDistance(centerX, centerZ, point.x, point.z);

        if (left < 2 || left > mapSize - 2 || top < 2 || top > mapSize - 2) {
          return null;
        }

        return {
          ...point,
          color: layer.color,
          distance,
          left,
          top,
        };
      })
      .filter((marker): marker is NonNullable<typeof marker> => marker !== null);
  }, [centerX, centerZ, effectiveRadius, layerById, mapSize, rawPoints]);

  const nearest = useMemo(
    () => [...markers].sort((a, b) => a.distance - b.distance).slice(0, 24),
    [markers]
  );

  const gridLines = useMemo(() => {
    const divisions = 8;
    const lines: number[] = [];
    for (let i = 0; i <= divisions; i += 1) {
      lines.push((i / divisions) * mapSize);
    }
    return lines;
  }, [mapSize]);

  const scalePerCell = Math.round((effectiveRadius * 2) / 8);

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]));
  };

  const activateAll = () => setActiveLayers(availableLayers.map((layer) => layer.id));
  const deactivateAll = () => setActiveLayers([]);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Modo tipo Chunkbase: filtra estructuras, activa/desactiva capas y revisa coordenadas cercanas"
        title="Mapa Avanzado De Seed"
      >
        <Text style={styles.label}>Seed</Text>
        <TextInput onChangeText={setSeed} placeholder="Ejemplo: -123456789 o texto" style={styles.input} value={seed} />

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>X</Text>
            <TextInput
              onChangeText={(value) => setX(normalizeCoordinateInput(value))}
              placeholder="-120.5"
              style={[styles.input, compact && styles.inputCompact]}
              value={x}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Y</Text>
            <TextInput
              onChangeText={(value) => setY(normalizeCoordinateInput(value))}
              placeholder="64"
              style={[styles.input, compact && styles.inputCompact]}
              value={y}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Z</Text>
            <TextInput
              onChangeText={(value) => setZ(normalizeCoordinateInput(value))}
              placeholder="340.25"
              style={[styles.input, compact && styles.inputCompact]}
              value={z}
            />
          </View>
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Radio de busqueda (bloques)</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => setRadiusInput(normalizePositiveInt(value))}
              placeholder="2500"
              style={[styles.input, compact && styles.inputCompact]}
              value={radiusInput}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zoom</Text>
            <View style={styles.zoomRow}>
              <Pressable onPress={() => setZoom((current) => Math.max(0.5, Number((current - 0.5).toFixed(1))))} style={styles.zoomButton}>
                <Text style={styles.zoomButtonText}>-</Text>
              </Pressable>
              <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>
              <Pressable onPress={() => setZoom((current) => Math.min(3, Number((current + 0.5).toFixed(1))))} style={styles.zoomButton}>
                <Text style={styles.zoomButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Edicion</Text>
        <View style={styles.chips}>
          {editions.map((entry) => {
            const active = edition === entry.id;
            return (
              <Pressable key={entry.id} onPress={() => setEdition(entry.id)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{entry.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Dimension</Text>
        <View style={styles.chips}>
          {dimensions.map((entry) => {
            const active = dimension === entry.id;
            return (
              <Pressable key={entry.id} onPress={() => setDimension(entry.id)} style={[styles.chip, active && styles.chipActiveSecondary]}>
                <Text style={[styles.chipText, active && styles.chipTextActiveSecondary]}>{entry.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Buscar estructura</Text>
        <TextInput
          onChangeText={setSearch}
          placeholder="Ejemplo: aldea, stronghold, monumento..."
          style={[styles.input, compact && styles.inputCompact]}
          value={search}
        />

        <View style={[styles.row, styles.actionsRow, compact && styles.rowCompact]}>
          <Pressable onPress={activateAll} style={[styles.actionButton, styles.actionPrimary]}>
            <Text style={styles.actionButtonText}>Activar todo</Text>
          </Pressable>
          <Pressable onPress={deactivateAll} style={[styles.actionButton, styles.actionDanger]}>
            <Text style={styles.actionButtonText}>Desactivar todo</Text>
          </Pressable>
        </View>

        <View style={styles.layerList}>
          {filteredLayers.map((layer) => {
            const active = activeLayers.includes(layer.id);
            return (
              <View key={layer.id} style={styles.layerRow}>
                <View style={[styles.layerDot, { backgroundColor: layer.color }]} />
                <View style={styles.layerInfo}>
                  <Text style={styles.layerTitle}>{layer.name}</Text>
                  <Text style={styles.layerDesc}>{layer.description}</Text>
                </View>
                <Switch onValueChange={() => toggleLayer(layer.id)} value={active} />
              </View>
            );
          })}
        </View>

        {!filteredLayers.length ? <Text style={styles.emptyText}>No hay estructuras para ese filtro.</Text> : null}
      </SectionCard>

      <SectionCard
        subtitle={`Centro actual: X ${Math.round(centerX)} / Z ${Math.round(centerZ)} | Y ${Math.round(parseCoordinate(y))}`}
        title="Vista De Mapa"
      >
        <View style={styles.mapControlRow}>
          <Pressable onPress={() => setShowGrid((value) => !value)} style={[styles.mapToggle, showGrid && styles.mapToggleActive]}>
            <Text style={[styles.mapToggleText, showGrid && styles.mapToggleTextActive]}>
              {showGrid ? 'Cuadricula: ON' : 'Cuadricula: OFF'}
            </Text>
          </Pressable>
          <Pressable onPress={() => setShowLabels((value) => !value)} style={[styles.mapToggle, showLabels && styles.mapToggleActive]}>
            <Text style={[styles.mapToggleText, showLabels && styles.mapToggleTextActive]}>
              {showLabels ? 'Etiquetas: ON' : 'Etiquetas: OFF'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.mapWrap, { height: mapSize + 8 }]}>
          <View style={[styles.mapCanvas, { height: mapSize, width: mapSize }]}>
            {showGrid
              ? gridLines.map((line, index) => (
                  <View key={`h-${index}`} style={[styles.gridLineHorizontal, { top: line }]} />
                ))
              : null}
            {showGrid
              ? gridLines.map((line, index) => (
                  <View key={`v-${index}`} style={[styles.gridLineVertical, { left: line }]} />
                ))
              : null}

            <View style={[styles.axisHorizontal, { top: mapSize / 2 }]} />
            <View style={[styles.axisVertical, { left: mapSize / 2 }]} />

            {markers.map((marker) => (
              <View key={marker.id}>
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: marker.color,
                      left: marker.left - 6,
                      top: marker.top - 6,
                    },
                  ]}
                />
                {showLabels ? (
                  <Text
                    style={[
                      styles.markerLabel,
                      {
                        left: marker.left + 7,
                        top: marker.top - 7,
                      },
                    ]}
                  >
                    {marker.layerName}
                  </Text>
                ) : null}
              </View>
            ))}

            <View style={[styles.centerMarker, { left: mapSize / 2 - 7, top: mapSize / 2 - 7 }]} />
          </View>
        </View>
        <Text style={styles.scaleText}>
          Escala: cada division del mapa ~ {scalePerCell} bloques | Marcadores activos: {markers.length}
        </Text>
        <Text style={styles.disclaimerText}>
          Calculado localmente por seed para busqueda rapida en movil. Usa coordenadas en juego para confirmar exactitud
          final.
        </Text>
      </SectionCard>

      <SectionCard
        subtitle="Se listan por distancia desde tus coordenadas X/Z actuales"
        title="Resultados Cercanos"
      >
        {nearest.length ? (
          <View style={styles.resultsList}>
            {nearest.map((entry) => (
              <View key={entry.id} style={styles.resultCard}>
                <View style={[styles.layerDot, { backgroundColor: entry.color }]} />
                <View style={styles.resultContent}>
                  <Text style={styles.resultTitle}>{entry.layerName}</Text>
                  <Text style={styles.resultMeta}>
                    X {Math.round(entry.x)} | Z {Math.round(entry.z)} | Distancia: {entry.distance} bloques
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No hay resultados con los filtros actuales. Activa mas estructuras o aumenta el radio.
          </Text>
        )}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  actionButtonText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
  },
  actionDanger: {
    backgroundColor: '#FEECE9',
    borderColor: '#E3A297',
  },
  actionPrimary: {
    backgroundColor: '#E8F6E9',
    borderColor: '#9FCC9A',
  },
  actionsRow: {
    marginTop: spacing.sm,
  },
  axisHorizontal: {
    backgroundColor: '#E58C44',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  axisVertical: {
    backgroundColor: '#E58C44',
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  centerMarker: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E58C44',
    borderRadius: 8,
    borderWidth: 2,
    height: 14,
    position: 'absolute',
    width: 14,
  },
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
  disclaimerText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 14,
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  gridLineHorizontal: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  gridLineVertical: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
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
  layerDesc: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 14,
  },
  layerDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  layerInfo: {
    flex: 1,
    gap: 2,
  },
  layerList: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  layerRow: {
    alignItems: 'center',
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  layerTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  mapCanvas: {
    backgroundColor: '#102218',
    borderColor: '#3E5E45',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapControlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  mapToggle: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  mapToggleActive: {
    backgroundColor: '#E8F6E9',
    borderColor: '#9FCC9A',
  },
  mapToggleText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  mapToggleTextActive: {
    color: palette.primaryDark,
  },
  mapWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  marker: {
    borderColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  markerLabel: {
    color: '#E9F8EE',
    fontSize: 9,
    fontWeight: '700',
    position: 'absolute',
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  resultContent: {
    flex: 1,
    gap: 2,
  },
  resultMeta: {
    color: palette.muted,
    fontSize: 11,
  },
  resultTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  resultsList: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowCompact: {
    flexDirection: 'column',
  },
  scaleText: {
    color: palette.text,
    fontSize: 11,
    marginBottom: 4,
  },
  zoomButton: {
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  zoomButtonText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  zoomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 1,
  },
  zoomValue: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    minWidth: 42,
    textAlign: 'center',
  },
});
