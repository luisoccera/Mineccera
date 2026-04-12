import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  generateBiomeCells,
  generateStructurePoints,
  getBiomeAtPoint,
  structureCategories,
  structureDistance,
  structureLayers,
  type BiomeCell,
  type SeedDimension,
  type SeedEdition,
  type StructureCategory,
  type StructureLayer,
} from '../utils/seedExplorer';

const editions: Array<{ id: SeedEdition; label: string }> = [
  { id: 'java_1_21', label: 'Java 1.21+' },
  { id: 'bedrock_1_21', label: 'Bedrock 1.21+' },
];

const dimensions: Array<{ id: SeedDimension; label: string }> = [
  { id: 'overworld', label: 'Overworld' },
  { id: 'nether', label: 'Nether' },
  { id: 'end', label: 'End' },
];

const normalizeCoordinateInput = (input: string) => {
  const value = input.replace(',', '.');
  let output = '';
  let hasMinus = false;
  let hasDot = false;
  let decimals = 0;

  for (const char of value) {
    if (char >= '0' && char <= '9') {
      if (!hasDot || decimals < 3) {
        output += char;
        if (hasDot) {
          decimals += 1;
        }
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
    }
  }
  return output;
};

const parseCoordinate = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(3)) : 0;
};

const parseRadius = (value: string) => {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.max(800, Math.min(16000, Math.round(parsed)));
  }
  return 2500;
};

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

type CategoryFilter = 'all' | StructureCategory;

interface AppliedSearch {
  centerX: number;
  centerY: number;
  centerZ: number;
  radius: number;
  seed: string;
}

interface Marker {
  color: string;
  distance: number;
  id: string;
  layer: StructureLayer;
  layerId: string;
  left: number;
  top: number;
  x: number;
  z: number;
}

interface BiomeSummary {
  biomeColor: string;
  biomeId: string;
  biomeName: string;
  count: number;
  percent: number;
}

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
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showGrid, setShowGrid] = useState(true);
  const [showBiomes, setShowBiomes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedSearch>({
    centerX: 0,
    centerY: 64,
    centerZ: 0,
    radius: 2500,
    seed: '0',
  });

  const [activeLayers, setActiveLayers] = useState<string[]>(() =>
    structureLayers.filter((layer) => layer.dimension === 'overworld' && layer.defaultEnabled).map((layer) => layer.id)
  );

  const availableLayers = useMemo(
    () => structureLayers.filter((layer) => layer.dimension === dimension),
    [dimension]
  );

  useEffect(() => {
    const allowed = new Set(availableLayers.map((layer) => layer.id));
    setActiveLayers((prev) => {
      const kept = prev.filter((id) => allowed.has(id));
      if (kept.length) {
        return kept;
      }
      const defaults = availableLayers.filter((layer) => layer.defaultEnabled).map((layer) => layer.id);
      return defaults.length ? defaults : availableLayers.map((layer) => layer.id);
    });
    setCategoryFilter('all');
    setSelectedMarkerId(null);
  }, [availableLayers]);

  const categoryOptions = useMemo(() => {
    const ids = new Set(availableLayers.map((layer) => layer.category));
    return structureCategories.filter((category) => ids.has(category.id));
  }, [availableLayers]);

  const filteredLayers = useMemo(() => {
    const query = normalizeSearch(search.trim());
    return availableLayers.filter((layer) => {
      if (categoryFilter !== 'all' && layer.category !== categoryFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = normalizeSearch(
        `${layer.name} ${layer.description} ${layer.lootHint} ${layer.rarity} ${layer.aliases.join(' ')}`
      );
      return haystack.includes(query);
    });
  }, [availableLayers, categoryFilter, search]);

  const mapSize = useMemo(() => {
    const sidePadding = compact ? 36 : 72;
    return Math.max(260, Math.min(width - sidePadding, compact ? 390 : 680));
  }, [compact, width]);
  const biomeCellsPerSide = compact ? 18 : 24;
  const biomeCellSize = mapSize / biomeCellsPerSide;

  const effectiveRadius = Math.max(400, Math.round(applied.radius / zoom));

  const layerById = useMemo(() => {
    const map = new Map<string, StructureLayer>();
    for (const layer of structureLayers) {
      map.set(layer.id, layer);
    }
    return map;
  }, []);

  const rawPoints = useMemo(
    () =>
      hasSearched
        ? generateStructurePoints({
            activeLayers,
            centerX: applied.centerX,
            centerZ: applied.centerZ,
            dimension,
            edition,
            radius: effectiveRadius,
            seed: applied.seed,
          })
        : [],
    [activeLayers, applied.centerX, applied.centerZ, applied.seed, dimension, edition, effectiveRadius, hasSearched]
  );

  const biomeCells = useMemo<BiomeCell[]>(
    () =>
      hasSearched
        ? generateBiomeCells({
            centerX: applied.centerX,
            centerZ: applied.centerZ,
            dimension,
            edition,
            radius: effectiveRadius,
            samplesPerSide: biomeCellsPerSide,
            seed: applied.seed,
          })
        : [],
    [applied.centerX, applied.centerZ, applied.seed, biomeCellsPerSide, dimension, edition, effectiveRadius, hasSearched]
  );

  const markers = useMemo(() => {
    const half = mapSize / 2;
    return rawPoints
      .map((point) => {
        const layer = layerById.get(point.layerId);
        if (!layer) {
          return null;
        }
        const left = half + ((point.x - applied.centerX) / effectiveRadius) * half;
        const top = half + ((point.z - applied.centerZ) / effectiveRadius) * half;
        if (left < 2 || left > mapSize - 2 || top < 2 || top > mapSize - 2) {
          return null;
        }
        return {
          color: layer.color,
          distance: structureDistance(applied.centerX, applied.centerZ, point.x, point.z),
          id: point.id,
          layer,
          layerId: point.layerId,
          left,
          top,
          x: point.x,
          z: point.z,
        };
      })
      .filter((marker): marker is Marker => marker !== null);
  }, [applied.centerX, applied.centerZ, effectiveRadius, layerById, mapSize, rawPoints]);

  const nearest = useMemo(
    () =>
      [...markers]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 28)
        .map((entry) => ({
          ...entry,
          biome: getBiomeAtPoint({
            dimension,
            edition,
            seed: applied.seed,
            x: entry.x,
            z: entry.z,
          }),
        })),
    [applied.seed, dimension, edition, markers]
  );

  const statsByLayer = useMemo(() => {
    const stats = new Map<string, { count: number; nearest: number }>();
    for (const marker of markers) {
      const current = stats.get(marker.layerId);
      if (!current) {
        stats.set(marker.layerId, { count: 1, nearest: marker.distance });
      } else {
        current.count += 1;
        current.nearest = Math.min(current.nearest, marker.distance);
        stats.set(marker.layerId, current);
      }
    }
    return stats;
  }, [markers]);

  const selectedMarker = useMemo(
    () => markers.find((marker) => marker.id === selectedMarkerId) ?? null,
    [markers, selectedMarkerId]
  );
  const centerBiome = useMemo(
    () =>
      hasSearched
        ? getBiomeAtPoint({
            dimension,
            edition,
            seed: applied.seed,
            x: applied.centerX,
            z: applied.centerZ,
          })
        : null,
    [applied.centerX, applied.centerZ, applied.seed, dimension, edition, hasSearched]
  );
  const selectedBiome = useMemo(
    () =>
      selectedMarker
        ? getBiomeAtPoint({
            dimension,
            edition,
            seed: applied.seed,
            x: selectedMarker.x,
            z: selectedMarker.z,
          })
        : null,
    [applied.seed, dimension, edition, selectedMarker]
  );

  const biomeSummary = useMemo<BiomeSummary[]>(() => {
    if (!biomeCells.length) {
      return [];
    }

    const grouped = new Map<string, BiomeSummary>();
    for (const cell of biomeCells) {
      const current = grouped.get(cell.biomeId);
      if (!current) {
        grouped.set(cell.biomeId, {
          biomeColor: cell.biomeColor,
          biomeId: cell.biomeId,
          biomeName: cell.biomeName,
          count: 1,
          percent: 0,
        });
      } else {
        current.count += 1;
        grouped.set(cell.biomeId, current);
      }
    }

    const total = biomeCells.length;
    return [...grouped.values()]
      .map((entry) => ({
        ...entry,
        percent: Math.max(1, Math.round((entry.count / total) * 100)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [biomeCells]);

  useEffect(() => {
    if (selectedMarkerId && !markers.some((marker) => marker.id === selectedMarkerId)) {
      setSelectedMarkerId(null);
    }
  }, [markers, selectedMarkerId]);

  const gridLines = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i <= 8; i += 1) {
      lines.push((i / 8) * mapSize);
    }
    return lines;
  }, [mapSize]);

  const activateAll = () => setActiveLayers(availableLayers.map((layer) => layer.id));
  const deactivateAll = () => setActiveLayers([]);
  const useRecommended = () => {
    const defaults = availableLayers.filter((layer) => layer.defaultEnabled).map((layer) => layer.id);
    setActiveLayers(defaults.length ? defaults : availableLayers.map((layer) => layer.id));
  };
  const activateFiltered = () =>
    setActiveLayers((prev) => {
      const next = new Set(prev);
      for (const layer of filteredLayers) {
        next.add(layer.id);
      }
      return [...next];
    });
  const deactivateFiltered = () => {
    const ids = new Set(filteredLayers.map((layer) => layer.id));
    setActiveLayers((prev) => prev.filter((id) => !ids.has(id)));
  };
  const toggleLayer = (layerId: string) =>
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]));

  const runSearch = () => {
    setApplied({
      centerX: parseCoordinate(x),
      centerY: parseCoordinate(y),
      centerZ: parseCoordinate(z),
      radius: parseRadius(radiusInput),
      seed: seed.trim() || '0',
    });
    setHasSearched(true);
    setSelectedMarkerId(null);
  };

  const focusMarker = () => {
    if (!selectedMarker) {
      return;
    }
    setX(Math.round(selectedMarker.x).toString());
    setZ(Math.round(selectedMarker.z).toString());
    setApplied((prev) => ({ ...prev, centerX: selectedMarker.x, centerZ: selectedMarker.z }));
  };

  const shortLabel = (name: string) => (name.length > 14 ? `${name.slice(0, 12)}..` : name);
  const scalePerCell = Math.round((effectiveRadius * 2) / 8);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Tipo Chunkbase: elige estructura, activa/desactiva capas y obten coordenadas cercanas"
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
            <Text style={styles.label}>Radio (bloques)</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={(value) => setRadiusInput(value.replace(/[^\d]/g, ''))}
              placeholder="2500"
              style={[styles.input, compact && styles.inputCompact]}
              value={radiusInput}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Zoom</Text>
            <View style={styles.zoomRow}>
              <Pressable onPress={() => setZoom((v) => Math.max(0.5, Number((v - 0.5).toFixed(1))))} style={styles.zoomBtn}>
                <Text style={styles.zoomTxt}>-</Text>
              </Pressable>
              <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>
              <Pressable onPress={() => setZoom((v) => Math.min(3, Number((v + 0.5).toFixed(1))))} style={styles.zoomBtn}>
                <Text style={styles.zoomTxt}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Edicion</Text>
        <View style={styles.chips}>
          {editions.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setEdition(entry.id)}
              style={[styles.chip, edition === entry.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, edition === entry.id && styles.chipTextActive]}>{entry.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Dimension</Text>
        <View style={styles.chips}>
          {dimensions.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setDimension(entry.id)}
              style={[styles.chip, dimension === entry.id && styles.chipActiveSecondary]}
            >
              <Text style={[styles.chipText, dimension === entry.id && styles.chipTextActiveSecondary]}>{entry.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Buscar estructura/categoria</Text>
        <TextInput
          onChangeText={setSearch}
          placeholder="Ejemplo: aldea, loot, bastion, progreso..."
          style={[styles.input, compact && styles.inputCompact]}
          value={search}
        />

        <View style={styles.chips}>
          <Pressable
            onPress={() => setCategoryFilter('all')}
            style={[styles.chip, categoryFilter === 'all' && styles.chipActive]}
          >
            <Text style={[styles.chipText, categoryFilter === 'all' && styles.chipTextActive]}>Todas</Text>
          </Pressable>
          {categoryOptions.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => setCategoryFilter(entry.id)}
              style={[styles.chip, categoryFilter === entry.id && styles.chipActive]}
            >
              <Text style={[styles.chipText, categoryFilter === entry.id && styles.chipTextActive]}>{entry.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.row, styles.topActions, compact && styles.rowCompact]}>
          <Pressable onPress={activateAll} style={[styles.actionBtn, styles.actionGood]}>
            <Text style={styles.actionTxt}>Activar todo</Text>
          </Pressable>
          <Pressable onPress={useRecommended} style={[styles.actionBtn, styles.actionNeutral]}>
            <Text style={styles.actionTxt}>Recomendadas</Text>
          </Pressable>
          <Pressable onPress={deactivateAll} style={[styles.actionBtn, styles.actionWarn]}>
            <Text style={styles.actionTxt}>Apagar todo</Text>
          </Pressable>
        </View>
        <View style={[styles.row, compact && styles.rowCompact]}>
          <Pressable onPress={activateFiltered} style={[styles.actionBtn, styles.actionGood]}>
            <Text style={styles.actionTxt}>Activar visibles</Text>
          </Pressable>
          <Pressable onPress={deactivateFiltered} style={[styles.actionBtn, styles.actionWarn]}>
            <Text style={styles.actionTxt}>Apagar visibles</Text>
          </Pressable>
        </View>

        <Text style={styles.helperText}>
          Capas activas: {activeLayers.length}/{availableLayers.length}
        </Text>

        <View style={styles.layerList}>
          {filteredLayers.map((layer) => {
            const stat = statsByLayer.get(layer.id);
            return (
              <View key={layer.id} style={styles.layerRow}>
                <View style={[styles.dot, { backgroundColor: layer.color }]} />
                <View style={styles.layerBody}>
                  <Text style={styles.layerTitle}>
                    {layer.name} · {layer.rarity}
                  </Text>
                  <Text style={styles.layerMeta}>{layer.description}</Text>
                  <Text style={styles.layerMeta}>
                    Loot: {layer.lootHint}
                    {hasSearched && stat ? ` | En mapa: ${stat.count} | Cercana: ${stat.nearest}b` : ''}
                  </Text>
                </View>
                <Switch onValueChange={() => toggleLayer(layer.id)} value={activeLayers.includes(layer.id)} />
              </View>
            );
          })}
        </View>

        <Pressable onPress={runSearch} style={styles.searchBtn}>
          <Text style={styles.searchBtnTxt}>Buscar estructuras con esta seed</Text>
        </Pressable>
      </SectionCard>

      <SectionCard
        subtitle={
          hasSearched
            ? `Centro X ${Math.round(applied.centerX)} / Z ${Math.round(applied.centerZ)} | Y ${Math.round(applied.centerY)}`
            : 'Primero pulsa "Buscar estructuras con esta seed"'
        }
        title="Mapa De Capas"
      >
        {!hasSearched ? (
          <Text style={styles.empty}>Aun no hay resultados cargados.</Text>
        ) : (
          <>
            <View style={styles.chips}>
              <Pressable onPress={() => setShowBiomes((v) => !v)} style={[styles.chip, showBiomes && styles.chipActive]}>
                <Text style={[styles.chipText, showBiomes && styles.chipTextActive]}>{showBiomes ? 'Biomas ON' : 'Biomas OFF'}</Text>
              </Pressable>
              <Pressable onPress={() => setShowGrid((v) => !v)} style={[styles.chip, showGrid && styles.chipActive]}>
                <Text style={[styles.chipText, showGrid && styles.chipTextActive]}>{showGrid ? 'Cuadricula ON' : 'Cuadricula OFF'}</Text>
              </Pressable>
              <Pressable onPress={() => setShowLabels((v) => !v)} style={[styles.chip, showLabels && styles.chipActive]}>
                <Text style={[styles.chipText, showLabels && styles.chipTextActive]}>{showLabels ? 'Etiquetas ON' : 'Etiquetas OFF'}</Text>
              </Pressable>
            </View>

            <View style={[styles.mapWrap, { height: mapSize + 8 }]}>
              <View style={[styles.mapCanvas, { height: mapSize, width: mapSize }]}>
                {showBiomes
                  ? biomeCells.map((cell) => (
                      <View
                        key={`biome-${cell.row}-${cell.col}`}
                        style={[
                          styles.biomeCell,
                          {
                            backgroundColor: cell.biomeColor,
                            height: biomeCellSize + 0.6,
                            left: cell.col * biomeCellSize,
                            top: cell.row * biomeCellSize,
                            width: biomeCellSize + 0.6,
                          },
                        ]}
                      />
                    ))
                  : null}
                {showGrid ? gridLines.map((line, i) => <View key={`h-${i}`} style={[styles.gridH, { top: line }]} />) : null}
                {showGrid ? gridLines.map((line, i) => <View key={`v-${i}`} style={[styles.gridV, { left: line }]} />) : null}

                <View style={[styles.axisH, { top: mapSize / 2 }]} />
                <View style={[styles.axisV, { left: mapSize / 2 }]} />

                {markers.map((marker) => (
                  <View key={marker.id}>
                    <Pressable onPress={() => setSelectedMarkerId(marker.id)} style={[styles.markerTouch, { left: marker.left - 10, top: marker.top - 10 }]}>
                      <View style={[styles.marker, selectedMarkerId === marker.id && styles.markerSelected, { backgroundColor: marker.color }]} />
                    </Pressable>
                    {showLabels ? (
                      <Text style={[styles.markerLabel, { left: marker.left + 8, top: marker.top - 6 }]}>{shortLabel(marker.layer.name)}</Text>
                    ) : null}
                  </View>
                ))}

                <View style={[styles.center, { left: mapSize / 2 - 7, top: mapSize / 2 - 7 }]} />
              </View>
            </View>

            <Text style={styles.helperText}>
              Escala aprox: {scalePerCell} bloques por division | Puntos: {markers.length}
              {centerBiome ? ` | Bioma centro: ${centerBiome.biomeName}` : ''}
            </Text>

            {showBiomes && biomeSummary.length ? (
              <View style={styles.biomeLegendWrap}>
                {biomeSummary.map((entry) => (
                  <View key={entry.biomeId} style={styles.biomeLegendChip}>
                    <View style={[styles.biomeLegendDot, { backgroundColor: entry.biomeColor }]} />
                    <Text style={styles.biomeLegendText}>
                      {entry.biomeName} {entry.percent}%
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            {selectedMarker ? (
              <View style={styles.selectedCard}>
                <Text style={styles.layerTitle}>{selectedMarker.layer.name}</Text>
                <Text style={styles.layerMeta}>
                  Categoria: {structureCategories.find((c) => c.id === selectedMarker.layer.category)?.label ?? 'N/A'} | Rareza:{' '}
                  {selectedMarker.layer.rarity}
                </Text>
                <Text style={styles.layerMeta}>
                  X {Math.round(selectedMarker.x)} / Z {Math.round(selectedMarker.z)} | Distancia: {selectedMarker.distance} bloques
                </Text>
                <Text style={styles.layerMeta}>Loot/utilidad: {selectedMarker.layer.lootHint}</Text>
                <Text style={styles.layerMeta}>Bioma local: {selectedBiome?.biomeName ?? 'Sin dato'}</Text>
                <Pressable onPress={focusMarker} style={[styles.actionBtn, styles.actionGood]}>
                  <Text style={styles.actionTxt}>Centrar mapa aqui</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.empty}>
                Bioma centro: {centerBiome?.biomeName ?? 'N/A'}. Toca un marcador para ver detalle completo.
              </Text>
            )}
          </>
        )}
      </SectionCard>

      <SectionCard subtitle="Ordenados por distancia desde tus coordenadas X/Z" title="Resultados Cercanos">
        {!hasSearched ? (
          <Text style={styles.empty}>No hay resultados aun.</Text>
        ) : nearest.length ? (
          <View style={styles.results}>
            {nearest.map((entry) => (
              <Pressable key={entry.id} onPress={() => setSelectedMarkerId(entry.id)} style={styles.resultRow}>
                <View style={[styles.dot, { backgroundColor: entry.color }]} />
                <View style={styles.layerBody}>
                  <Text style={styles.layerTitle}>{entry.layer.name}</Text>
                  <Text style={styles.layerMeta}>
                    X {Math.round(entry.x)} | Z {Math.round(entry.z)} | Distancia {entry.distance} bloques
                  </Text>
                  <Text style={styles.layerMeta}>Bioma: {entry.biome.biomeName}</Text>
                  <Text style={styles.layerMeta}>Loot/utilidad: {entry.layer.lootHint}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Sin resultados con este filtro. Activa mas capas o aumenta el radio.</Text>
        )}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { backgroundColor: palette.appBackground, flex: 1 },
  content: { gap: spacing.md, padding: spacing.md, paddingBottom: spacing.xl },
  contentCompact: { paddingHorizontal: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  rowCompact: { flexDirection: 'column' },
  label: { color: palette.text, fontFamily: font.display, fontSize: 12, marginTop: spacing.sm, marginBottom: spacing.xs },
  inputGroup: { flex: 1, gap: spacing.xs },
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
  inputCompact: { fontSize: 13 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  chip: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: '#DFF4E8', borderColor: palette.primary },
  chipActiveSecondary: { backgroundColor: '#FFF5E9', borderColor: '#F5D4A5' },
  chipText: { color: palette.muted, fontSize: 11, fontWeight: '600' },
  chipTextActive: { color: palette.primaryDark },
  chipTextActiveSecondary: { color: palette.secondary },
  topActions: { marginTop: spacing.xs },
  actionBtn: {
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 39,
    paddingHorizontal: spacing.sm,
  },
  actionTxt: { color: palette.text, fontFamily: font.display, fontSize: 11, textAlign: 'center' },
  actionGood: { backgroundColor: '#E8F6E9', borderColor: '#9FCC9A' },
  actionWarn: { backgroundColor: '#FEECE9', borderColor: '#E3A297' },
  actionNeutral: { backgroundColor: '#F2F2E9', borderColor: '#CDCDB6' },
  helperText: { color: palette.muted, fontSize: 11, marginTop: spacing.xs },
  layerList: { gap: spacing.xs, marginTop: spacing.sm },
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
  dot: { borderRadius: 6, height: 12, width: 12 },
  layerBody: { flex: 1, gap: 2, minWidth: 0 },
  layerTitle: { color: palette.text, fontFamily: font.display, fontSize: 12, flexShrink: 1 },
  layerMeta: { color: palette.muted, fontSize: 11, lineHeight: 15 },
  searchBtn: {
    alignItems: 'center',
    backgroundColor: '#E1F2E8',
    borderColor: '#91C7A8',
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 44,
  },
  searchBtnTxt: { color: palette.primaryDark, fontFamily: font.display, fontSize: 12 },
  mapWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  mapCanvas: {
    backgroundColor: '#102218',
    borderColor: '#3E5E45',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  biomeCell: {
    opacity: 0.72,
    position: 'absolute',
  },
  biomeLegendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  biomeLegendChip: {
    alignItems: 'center',
    backgroundColor: '#F4EFD7',
    borderColor: '#C8BA8F',
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  biomeLegendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  biomeLegendText: {
    color: palette.text,
    fontSize: 10,
  },
  gridH: { backgroundColor: 'rgba(255,255,255,0.14)', height: 1, left: 0, position: 'absolute', right: 0 },
  gridV: { backgroundColor: 'rgba(255,255,255,0.14)', width: 1, top: 0, bottom: 0, position: 'absolute' },
  axisH: { backgroundColor: '#E58C44', height: 1, left: 0, right: 0, position: 'absolute' },
  axisV: { backgroundColor: '#E58C44', width: 1, top: 0, bottom: 0, position: 'absolute' },
  center: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E58C44',
    borderRadius: 8,
    borderWidth: 2,
    height: 14,
    position: 'absolute',
    width: 14,
  },
  markerTouch: { width: 20, height: 20, position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  marker: { borderColor: '#FFFFFF', borderWidth: 1, borderRadius: 6, width: 12, height: 12 },
  markerSelected: { borderColor: '#FFE38A', borderWidth: 2, width: 14, height: 14 },
  markerLabel: { color: '#E9F8EE', fontSize: 9, fontWeight: '700', maxWidth: 90, position: 'absolute' },
  selectedCard: {
    backgroundColor: '#F8F4EA',
    borderColor: '#C2AF87',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 4,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  results: { gap: spacing.xs },
  resultRow: {
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
  empty: { color: palette.muted, fontSize: 12, marginTop: spacing.xs },
  zoomRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, marginTop: 1 },
  zoomBtn: {
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderColor: '#C8D2F1',
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  zoomTxt: { color: palette.text, fontFamily: font.display, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  zoomValue: { color: palette.text, fontFamily: font.display, fontSize: 12, minWidth: 42, textAlign: 'center' },
});
