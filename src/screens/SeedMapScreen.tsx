import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  generateBiomeCells,
  getFirstSpawnPoint,
  generateTerrainCells,
  generateStructurePoints,
  getBiomeAtPoint,
  getTerrainAtPoint,
  parseSeedValue,
  structureCategories,
  structureDistance,
  structureLayers,
  type BiomeCell,
  type SeedDimension,
  type SeedEdition,
  type StructureCategory,
  type StructureLayer,
  type TerrainCell,
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

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const shiftHexColor = (hex: string, amount: number) => {
  const safe = hex.replace('#', '');
  if (safe.length !== 6) {
    return hex;
  }

  const r = Number.parseInt(safe.slice(0, 2), 16);
  const g = Number.parseInt(safe.slice(2, 4), 16);
  const b = Number.parseInt(safe.slice(4, 6), 16);

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return hex;
  }

  const tone = clamp01(Math.abs(amount));
  const blend = (channel: number) => {
    if (amount >= 0) {
      return Math.round(channel + (255 - channel) * tone);
    }
    return Math.round(channel * (1 - tone));
  };

  const next = [blend(r), blend(g), blend(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('');

  return `#${next}`;
};

const cellNoise = (row: number, col: number, salt: number) => {
  let hash = salt ^ Math.imul((row + 17) * 374761393, (col + 29) * 668265263);
  hash = (hash ^ (hash >>> 13)) >>> 0;
  hash = Math.imul(hash, 1274126177) >>> 0;
  return (hash >>> 0) / 0xffffffff;
};

const isWaterLikeTerrain = (terrainId: string) =>
  terrainId === 'water' ||
  terrainId === 'river' ||
  terrainId === 'deep-ocean' ||
  terrainId === 'warm-ocean' ||
  terrainId === 'lava-sea';

const PAN_DRAG_THRESHOLD_PX = 8;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const ZOOM_STEP = 0.25;

const clampZoom = (value: number) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number(value.toFixed(2))));

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

interface TerrainSummary {
  count: number;
  percent: number;
  terrainColor: string;
  terrainId: string;
  terrainName: string;
}

interface CursorState {
  active: boolean;
  canvasX: number;
  canvasY: number;
  worldX: number;
  worldZ: number;
}

interface MapTooltip {
  left: number;
  subtitle: string;
  title: string;
  top: number;
}

interface StyledMapCell {
  color: string;
  col: number;
  row: number;
}

interface BoundaryLine {
  height: number;
  left: number;
  top: number;
  water: boolean;
  width: number;
}

interface PanAnchor {
  centerX: number;
  centerZ: number;
  pointerX: number;
  pointerY: number;
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
  const [openAtSpawn, setOpenAtSpawn] = useState(true);
  const [panEnabled, setPanEnabled] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showBiomes, setShowBiomes] = useState(false);
  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [showRelief, setShowRelief] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<CursorState>({
    active: false,
    canvasX: 0,
    canvasY: 0,
    worldX: 0,
    worldZ: 0,
  });
  const [applied, setApplied] = useState<AppliedSearch>({
    centerX: 0,
    centerY: 64,
    centerZ: 0,
    radius: 2500,
    seed: '0',
  });
  const panAnchorRef = useRef<PanAnchor | null>(null);
  const panMovedRef = useRef(false);
  const centerRef = useRef({ centerX: 0, centerZ: 0 });

  const [activeLayers, setActiveLayers] = useState<string[]>(() =>
    structureLayers.filter((layer) => layer.dimension === 'overworld' && layer.defaultEnabled).map((layer) => layer.id)
  );

  const availableLayers = useMemo(
    () => structureLayers.filter((layer) => layer.dimension === dimension),
    [dimension]
  );

  const spawnPoint = useMemo(
    () =>
      getFirstSpawnPoint({
        dimension,
        edition,
        seed: seed.trim() || '0',
      }),
    [dimension, edition, seed]
  );

  useEffect(() => {
    centerRef.current = {
      centerX: applied.centerX,
      centerZ: applied.centerZ,
    };
  }, [applied.centerX, applied.centerZ]);

  useEffect(() => {
    if (!openAtSpawn) {
      return;
    }
    setX(spawnPoint.x.toString());
    setY(spawnPoint.y.toString());
    setZ(spawnPoint.z.toString());
  }, [openAtSpawn, spawnPoint.x, spawnPoint.y, spawnPoint.z]);

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
  const biomeCellsPerSide = compact ? 36 : 56;
  const biomeCellSize = mapSize / biomeCellsPerSide;

  const effectiveRadius = Math.max(80, Math.round(applied.radius / zoom));
  const mapMinX = applied.centerX - effectiveRadius;
  const mapMaxX = applied.centerX + effectiveRadius;
  const mapMinZ = applied.centerZ - effectiveRadius;
  const mapMaxZ = applied.centerZ + effectiveRadius;

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

  const terrainCells = useMemo<TerrainCell[]>(
    () =>
      hasSearched
        ? generateTerrainCells({
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

  const visualSeed = useMemo(() => parseSeedValue(applied.seed), [applied.seed]);

  const terrainRenderCells = useMemo<StyledMapCell[]>(() => {
    if (!terrainCells.length) {
      return [];
    }

    return terrainCells.map((cell) => {
      const noise = cellNoise(cell.row, cell.col, visualSeed);
      let tone = (noise - 0.5) * 0.24;

      if (cell.terrainId === 'mountain' || cell.terrainId === 'high-islands' || cell.terrainId === 'basalt-ridges') {
        tone += 0.09;
      }
      if (isWaterLikeTerrain(cell.terrainId)) {
        tone -= 0.08;
      }
      if (cell.terrainId === 'flat-plains' || cell.terrainId === 'dry-plains') {
        tone += 0.02;
      }

      return {
        col: cell.col,
        color: showRelief ? shiftHexColor(cell.terrainColor, tone) : cell.terrainColor,
        row: cell.row,
      };
    });
  }, [showRelief, terrainCells, visualSeed]);

  const biomeRenderCells = useMemo<StyledMapCell[]>(() => {
    if (!biomeCells.length) {
      return [];
    }

    return biomeCells.map((cell) => {
      const noise = cellNoise(cell.row, cell.col, visualSeed ^ 0x55aa11);
      const tone = (noise - 0.5) * 0.12;

      return {
        col: cell.col,
        color: showRelief ? shiftHexColor(cell.biomeColor, tone) : cell.biomeColor,
        row: cell.row,
      };
    });
  }, [biomeCells, showRelief, visualSeed]);

  const terrainBoundaries = useMemo<BoundaryLine[]>(() => {
    if (!terrainCells.length) {
      return [];
    }

    const lines: BoundaryLine[] = [];

    for (let row = 0; row < biomeCellsPerSide; row += 1) {
      for (let col = 0; col < biomeCellsPerSide; col += 1) {
        const current = terrainCells[row * biomeCellsPerSide + col];
        if (!current) {
          continue;
        }

        if (col < biomeCellsPerSide - 1) {
          const right = terrainCells[row * biomeCellsPerSide + (col + 1)];
          if (right && current.terrainId !== right.terrainId) {
            lines.push({
              height: biomeCellSize + 0.7,
              left: (col + 1) * biomeCellSize - 0.5,
              top: row * biomeCellSize,
              water: isWaterLikeTerrain(current.terrainId) !== isWaterLikeTerrain(right.terrainId),
              width: 1,
            });
          }
        }

        if (row < biomeCellsPerSide - 1) {
          const down = terrainCells[(row + 1) * biomeCellsPerSide + col];
          if (down && current.terrainId !== down.terrainId) {
            lines.push({
              height: 1,
              left: col * biomeCellSize,
              top: (row + 1) * biomeCellSize - 0.5,
              water: isWaterLikeTerrain(current.terrainId) !== isWaterLikeTerrain(down.terrainId),
              width: biomeCellSize + 0.7,
            });
          }
        }
      }
    }

    return lines;
  }, [biomeCellSize, biomeCellsPerSide, terrainCells]);

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

  const markerLabelIds = useMemo(() => {
    const top = [...markers]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, compact ? 16 : 26)
      .map((marker) => marker.id);
    return new Set(top);
  }, [compact, markers]);

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
          terrain: getTerrainAtPoint({
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
  const hoveredMarker = useMemo(
    () => markers.find((marker) => marker.id === hoveredMarkerId) ?? null,
    [hoveredMarkerId, markers]
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
  const centerTerrain = useMemo(
    () =>
      hasSearched
        ? getTerrainAtPoint({
            dimension,
            edition,
            seed: applied.seed,
            x: applied.centerX,
            z: applied.centerZ,
          })
        : null,
    [applied.centerX, applied.centerZ, applied.seed, dimension, edition, hasSearched]
  );
  const selectedTerrain = useMemo(
    () =>
      selectedMarker
        ? getTerrainAtPoint({
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

  const terrainSummary = useMemo<TerrainSummary[]>(() => {
    if (!terrainCells.length) {
      return [];
    }

    const grouped = new Map<string, TerrainSummary>();
    for (const cell of terrainCells) {
      const current = grouped.get(cell.terrainId);
      if (!current) {
        grouped.set(cell.terrainId, {
          count: 1,
          percent: 0,
          terrainColor: cell.terrainColor,
          terrainId: cell.terrainId,
          terrainName: cell.terrainName,
        });
      } else {
        current.count += 1;
        grouped.set(cell.terrainId, current);
      }
    }

    const total = terrainCells.length;
    return [...grouped.values()]
      .map((entry) => ({
        ...entry,
        percent: Math.max(1, Math.round((entry.count / total) * 100)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [terrainCells]);

  useEffect(() => {
    if (selectedMarkerId && !markers.some((marker) => marker.id === selectedMarkerId)) {
      setSelectedMarkerId(null);
    }
  }, [markers, selectedMarkerId]);
  useEffect(() => {
    if (hoveredMarkerId && !markers.some((marker) => marker.id === hoveredMarkerId)) {
      setHoveredMarkerId(null);
    }
  }, [hoveredMarkerId, markers]);

  const gridLines = useMemo(() => {
    const lines: number[] = [];
    for (let i = 0; i <= 8; i += 1) {
      lines.push((i / 8) * mapSize);
    }
    return lines;
  }, [mapSize]);
  const rulerTicks = useMemo(
    () => gridLines.filter((_, index) => index % 2 === 0),
    [gridLines]
  );

  const pointerToWorld = (canvasX: number, canvasY: number) => {
    const clampedX = Math.max(0, Math.min(mapSize, canvasX));
    const clampedY = Math.max(0, Math.min(mapSize, canvasY));
    const worldX = mapMinX + (clampedX / mapSize) * (mapMaxX - mapMinX);
    const worldZ = mapMinZ + (clampedY / mapSize) * (mapMaxZ - mapMinZ);
    return { clampedX, clampedY, worldX, worldZ };
  };

  const updateCursor = (canvasX: number, canvasY: number, active = true) => {
    const mapped = pointerToWorld(canvasX, canvasY);
    setCursor({
      active,
      canvasX: mapped.clampedX,
      canvasY: mapped.clampedY,
      worldX: mapped.worldX,
      worldZ: mapped.worldZ,
    });
  };

  const blocksPerPixel = (effectiveRadius * 2) / mapSize;

  const buildTooltipPosition = (anchorLeft: number, anchorTop: number) => ({
    left: Math.max(6, Math.min(mapSize - 176, anchorLeft)),
    top: Math.max(6, Math.min(mapSize - 70, anchorTop)),
  });

  const beginPan = (pointerX: number, pointerY: number) => {
    if (!panEnabled || !hasSearched) {
      return false;
    }
    panAnchorRef.current = {
      centerX: centerRef.current.centerX,
      centerZ: centerRef.current.centerZ,
      pointerX,
      pointerY,
    };
    panMovedRef.current = false;
    setIsPanning(false);
    updateCursor(pointerX, pointerY, true);
    return true;
  };

  const movePan = (pointerX: number, pointerY: number) => {
    const anchor = panAnchorRef.current;
    if (!panEnabled || !anchor) {
      return;
    }

    const deltaX = pointerX - anchor.pointerX;
    const deltaY = pointerY - anchor.pointerY;

    if (!panMovedRef.current) {
      if (Math.abs(deltaX) < PAN_DRAG_THRESHOLD_PX && Math.abs(deltaY) < PAN_DRAG_THRESHOLD_PX) {
        updateCursor(pointerX, pointerY, true);
        return;
      }
      panMovedRef.current = true;
      setIsPanning(true);
      setOpenAtSpawn(false);
      setHoveredMarkerId(null);
      setCursor((prev) => ({ ...prev, active: false }));
    }

    const nextCenterX = Number((anchor.centerX - deltaX * blocksPerPixel).toFixed(2));
    const nextCenterZ = Number((anchor.centerZ - deltaY * blocksPerPixel).toFixed(2));

    setApplied((prev) => ({
      ...prev,
      centerX: nextCenterX,
      centerZ: nextCenterZ,
    }));
  };

  const endPan = (pointerX: number, pointerY: number) => {
    if (!panAnchorRef.current) {
      return;
    }
    const moved = panMovedRef.current;
    panAnchorRef.current = null;
    panMovedRef.current = false;
    setIsPanning(false);
    if (moved) {
      setX(Math.round(centerRef.current.centerX).toString());
      setZ(Math.round(centerRef.current.centerZ).toString());
      setCursor({
        active: false,
        canvasX: mapSize / 2,
        canvasY: mapSize / 2,
        worldX: centerRef.current.centerX,
        worldZ: centerRef.current.centerZ,
      });
      return;
    }
    updateCursor(pointerX, pointerY, true);
  };

  const cursorCellInfo = useMemo(() => {
    if (!hasSearched || !biomeCells.length || !terrainCells.length) {
      return null;
    }
    const col = Math.max(0, Math.min(biomeCellsPerSide - 1, Math.floor(cursor.canvasX / biomeCellSize)));
    const row = Math.max(0, Math.min(biomeCellsPerSide - 1, Math.floor(cursor.canvasY / biomeCellSize)));
    const index = row * biomeCellsPerSide + col;
    const biome = biomeCells[index];
    const terrain = terrainCells[index];

    return {
      biomeName: biome?.biomeName ?? 'N/A',
      terrainName: terrain?.terrainName ?? 'N/A',
    };
  }, [biomeCellSize, biomeCells, biomeCellsPerSide, cursor.canvasX, cursor.canvasY, hasSearched, terrainCells]);

  const markerNearCursor = useMemo<Marker | null>(() => {
    if (!cursor.active || isPanning) {
      return null;
    }
    let nearest: Marker | null = null;
    let minDistance = Number.POSITIVE_INFINITY;
    for (const marker of markers) {
      const dx = marker.left - cursor.canvasX;
      const dy = marker.top - cursor.canvasY;
      const distance = Math.hypot(dx, dy);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = marker;
      }
    }
    return minDistance <= 16 ? nearest : null;
  }, [cursor.active, cursor.canvasX, cursor.canvasY, isPanning, markers]);

  const markerTooltip = useMemo<MapTooltip | null>(() => {
    const marker = hoveredMarker ?? selectedMarker ?? markerNearCursor;
    if (!marker) {
      return null;
    }
    const pos = buildTooltipPosition(marker.left + 12, marker.top - 56);
    return {
      left: pos.left,
      subtitle: `X ${Math.round(marker.x)} | Y ${Math.round(applied.centerY)} | Z ${Math.round(marker.z)}`,
      title: marker.layer.name,
      top: pos.top,
    };
  }, [applied.centerY, hoveredMarker, markerNearCursor, selectedMarker]);

  const cursorTooltip = useMemo<MapTooltip | null>(() => {
    if (!cursor.active || isPanning || hoveredMarker) {
      return null;
    }
    const pos = buildTooltipPosition(cursor.canvasX + 12, cursor.canvasY + 12);
    return {
      left: pos.left,
      subtitle: `X ${Math.round(cursor.worldX)} | Y ${Math.round(applied.centerY)} | Z ${Math.round(cursor.worldZ)}`,
      title: 'Coordenada exacta',
      top: pos.top,
    };
  }, [applied.centerY, cursor.active, cursor.canvasX, cursor.canvasY, cursor.worldX, cursor.worldZ, hoveredMarker, isPanning]);

  const mapTooltip = markerTooltip ?? cursorTooltip;

  const zoomOut = () => setZoom((value) => clampZoom(value - ZOOM_STEP));
  const zoomIn = () => setZoom((value) => clampZoom(value + ZOOM_STEP));
  const resetZoom = () => setZoom(1);

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
    const spawnCenter = spawnPoint;
    const nextCenterX = openAtSpawn ? spawnCenter.x : parseCoordinate(x);
    const nextCenterY = openAtSpawn ? spawnCenter.y : parseCoordinate(y);
    const nextCenterZ = openAtSpawn ? spawnCenter.z : parseCoordinate(z);

    if (openAtSpawn) {
      setX(nextCenterX.toString());
      setY(nextCenterY.toString());
      setZ(nextCenterZ.toString());
    }

    setApplied({
      centerX: nextCenterX,
      centerY: nextCenterY,
      centerZ: nextCenterZ,
      radius: parseRadius(radiusInput),
      seed: seed.trim() || '0',
    });
    setHasSearched(true);
    setSelectedMarkerId(null);
    setCursor({
      active: false,
      canvasX: mapSize / 2,
      canvasY: mapSize / 2,
      worldX: nextCenterX,
      worldZ: nextCenterZ,
    });
  };

  const focusMarker = () => {
    if (!selectedMarker) {
      return;
    }
    setOpenAtSpawn(false);
    setX(Math.round(selectedMarker.x).toString());
    setZ(Math.round(selectedMarker.z).toString());
    setApplied((prev) => ({ ...prev, centerX: selectedMarker.x, centerZ: selectedMarker.z }));
    setCursor({
      active: true,
      canvasX: mapSize / 2,
      canvasY: mapSize / 2,
      worldX: selectedMarker.x,
      worldZ: selectedMarker.z,
    });
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
              <Pressable onPress={zoomOut} style={styles.zoomBtn}>
                <Text style={styles.zoomTxt}>-</Text>
              </Pressable>
              <Text style={styles.zoomValue}>{zoom.toFixed(1)}x</Text>
              <Pressable onPress={zoomIn} style={styles.zoomBtn}>
                <Text style={styles.zoomTxt}>+</Text>
              </Pressable>
              <Pressable onPress={resetZoom} style={[styles.zoomBtn, styles.zoomResetBtn]}>
                <Text style={styles.zoomResetTxt}>1x</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Centro inicial</Text>
        <View style={styles.chips}>
          <Pressable onPress={() => setOpenAtSpawn((value) => !value)} style={[styles.chip, openAtSpawn && styles.chipActive]}>
            <Text style={[styles.chipText, openAtSpawn && styles.chipTextActive]}>
              {openAtSpawn ? 'Spawn ON' : 'Spawn OFF'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpenAtSpawn(true);
              setX(spawnPoint.x.toString());
              setY(spawnPoint.y.toString());
              setZ(spawnPoint.z.toString());
              if (hasSearched) {
                setApplied((prev) => ({
                  ...prev,
                  centerX: spawnPoint.x,
                  centerY: spawnPoint.y,
                  centerZ: spawnPoint.z,
                }));
              }
            }}
            style={[styles.chip, styles.chipActiveSecondary]}
          >
            <Text style={[styles.chipText, styles.chipTextActiveSecondary]}>Ir a spawn</Text>
          </Pressable>
          <Pressable onPress={() => setPanEnabled((value) => !value)} style={[styles.chip, panEnabled && styles.chipActive]}>
            <Text style={[styles.chipText, panEnabled && styles.chipTextActive]}>
              {panEnabled ? 'Mover mapa ON' : 'Mover mapa OFF'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.helperText}>
          Spawn aprox: X {spawnPoint.x} / Y {spawnPoint.y} / Z {spawnPoint.z} | {spawnPoint.biomeName} |{' '}
          {spawnPoint.terrainName}
        </Text>

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
              <Pressable onPress={() => setShowRelief((v) => !v)} style={[styles.chip, showRelief && styles.chipActive]}>
                <Text style={[styles.chipText, showRelief && styles.chipTextActive]}>
                  {showRelief ? 'Relieve ON' : 'Relieve OFF'}
                </Text>
              </Pressable>
              <Pressable onPress={() => setShowTerrain((v) => !v)} style={[styles.chip, showTerrain && styles.chipActive]}>
                <Text style={[styles.chipText, showTerrain && styles.chipTextActive]}>
                  {showTerrain ? 'Terreno ON' : 'Terreno OFF'}
                </Text>
              </Pressable>
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
            <Text style={styles.helperText}>
              {panEnabled
                ? 'Arrastra el mapa con el dedo/mouse para moverlo libremente.'
                : 'Activa "Mover mapa ON" para desplazarte como en Google Maps.'}
            </Text>

            <View style={styles.mapFrame}>
              <View style={[styles.topRuler, { width: mapSize }]}>
                <Text style={styles.axisTitleTop}>X</Text>
                {rulerTicks.map((line, index) => (
                  <Text
                    key={`x-tick-${index}`}
                    style={[
                      styles.rulerText,
                      { left: Math.max(0, Math.min(mapSize - 52, line - 26)) },
                    ]}
                  >
                    {Math.round(mapMinX + (line / mapSize) * (mapMaxX - mapMinX))}
                  </Text>
                ))}
              </View>

              <View style={styles.mapRowWrap}>
                <View style={[styles.leftRuler, { height: mapSize }]}>
                  <Text style={styles.axisTitleLeft}>Z</Text>
                  {rulerTicks.map((line, index) => (
                    <Text
                      key={`z-tick-${index}`}
                      style={[
                        styles.rulerTextVertical,
                        { top: Math.max(0, Math.min(mapSize - 13, line - 6)) },
                      ]}
                    >
                      {Math.round(mapMinZ + (line / mapSize) * (mapMaxZ - mapMinZ))}
                    </Text>
                  ))}
                </View>

                <View
                  onMoveShouldSetResponder={() => true}
                  onPointerMove={(event) => {
                    if (panEnabled && panAnchorRef.current) {
                      return;
                    }
                    const native = event.nativeEvent as unknown as { offsetX?: number; offsetY?: number };
                    updateCursor(native.offsetX ?? mapSize / 2, native.offsetY ?? mapSize / 2, true);
                  }}
                  onPointerLeave={() => {
                    if (!panAnchorRef.current) {
                      setCursor((prev) => ({ ...prev, active: false }));
                      setHoveredMarkerId(null);
                    }
                  }}
                  onResponderGrant={(event) => {
                    if (beginPan(event.nativeEvent.locationX, event.nativeEvent.locationY)) {
                      return;
                    }
                    updateCursor(event.nativeEvent.locationX, event.nativeEvent.locationY, true);
                  }}
                  onResponderMove={(event) => {
                    if (panEnabled && panAnchorRef.current) {
                      movePan(event.nativeEvent.locationX, event.nativeEvent.locationY);
                      return;
                    }
                    updateCursor(event.nativeEvent.locationX, event.nativeEvent.locationY, true);
                  }}
                  onResponderRelease={(event) => {
                    if (panEnabled && panAnchorRef.current) {
                      movePan(event.nativeEvent.locationX, event.nativeEvent.locationY);
                      endPan(event.nativeEvent.locationX, event.nativeEvent.locationY);
                      return;
                    }
                    updateCursor(event.nativeEvent.locationX, event.nativeEvent.locationY, true);
                  }}
                  onResponderTerminate={() => {
                    if (panEnabled && panAnchorRef.current) {
                      endPan(mapSize / 2, mapSize / 2);
                      return;
                    }
                    setCursor((prev) => ({ ...prev, active: false }));
                  }}
                  onStartShouldSetResponder={() => true}
                  style={[styles.mapCanvas, isPanning && styles.mapCanvasPanning, { height: mapSize, width: mapSize }]}
                >
                  {showTerrain
                    ? terrainRenderCells.map((cell) => (
                        <View
                          key={`terrain-${cell.row}-${cell.col}`}
                          style={[
                            styles.terrainCell,
                            {
                              backgroundColor: cell.color,
                              height: biomeCellSize + 0.6,
                              left: cell.col * biomeCellSize,
                              top: cell.row * biomeCellSize,
                              width: biomeCellSize + 0.6,
                            },
                          ]}
                        />
                      ))
                    : null}

                  {showBiomes
                    ? biomeRenderCells.map((cell) => (
                        <View
                          key={`biome-${cell.row}-${cell.col}`}
                          style={[
                            styles.biomeCell,
                            {
                              backgroundColor: cell.color,
                              height: biomeCellSize + 0.6,
                              left: cell.col * biomeCellSize,
                              opacity: showTerrain ? 0.33 : 0.82,
                              top: cell.row * biomeCellSize,
                              width: biomeCellSize + 0.6,
                            },
                          ]}
                        />
                      ))
                    : null}

                  {showTerrain
                    ? terrainBoundaries.map((line, index) => (
                        <View
                          key={`tb-${index}`}
                          style={[
                            styles.terrainBoundary,
                            line.water && styles.terrainBoundaryWater,
                            {
                              height: line.height,
                              left: line.left,
                              top: line.top,
                              width: line.width,
                            },
                          ]}
                        />
                      ))
                    : null}

                  {showGrid ? gridLines.map((line, i) => <View key={`h-${i}`} style={[styles.gridH, { top: line }]} />) : null}
                  {showGrid ? gridLines.map((line, i) => <View key={`v-${i}`} style={[styles.gridV, { left: line }]} />) : null}

                  <View style={[styles.axisH, { top: mapSize / 2 }]} />
                  <View style={[styles.axisV, { left: mapSize / 2 }]} />

                  {cursor.active ? <View style={[styles.cursorLineVertical, { left: cursor.canvasX }]} /> : null}
                  {cursor.active ? <View style={[styles.cursorLineHorizontal, { top: cursor.canvasY }]} /> : null}

                  {markers.map((marker) => (
                    <View key={marker.id}>
                      <Pressable
                        onHoverIn={() => setHoveredMarkerId(marker.id)}
                        onHoverOut={() => setHoveredMarkerId((prev) => (prev === marker.id ? null : prev))}
                        onPress={() => {
                          setSelectedMarkerId(marker.id);
                          setHoveredMarkerId(marker.id);
                        }}
                        onPressOut={() => setHoveredMarkerId((prev) => (prev === marker.id ? null : prev))}
                        style={[styles.markerTouch, { left: marker.left - 10, top: marker.top - 10 }]}
                      >
                        <View style={[styles.marker, selectedMarkerId === marker.id && styles.markerSelected, { backgroundColor: marker.color }]} />
                      </Pressable>
                      {showLabels && markerLabelIds.has(marker.id) ? (
                        <Text style={[styles.markerLabel, { left: marker.left + 8, top: marker.top - 6 }]}>{shortLabel(marker.layer.name)}</Text>
                      ) : null}
                    </View>
                  ))}

                  {mapTooltip ? (
                    <View pointerEvents="none" style={[styles.mapTooltip, { left: mapTooltip.left, top: mapTooltip.top }]}>
                      <Text numberOfLines={1} style={styles.mapTooltipTitle}>
                        {mapTooltip.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.mapTooltipCoords}>
                        {mapTooltip.subtitle}
                      </Text>
                    </View>
                  ) : null}

                  <View style={[styles.center, { left: mapSize / 2 - 7, top: mapSize / 2 - 7 }]} />
                </View>
              </View>
            </View>

            <View style={styles.cursorBar}>
              <Text style={styles.cursorText}>
                Modo: {panEnabled ? (isPanning ? 'Moviendo mapa' : 'Mover mapa') : 'Cursor'} |{' '}
                Cursor X: {Math.round(cursor.worldX)} | Cursor Z: {Math.round(cursor.worldZ)} | Altura Y: {Math.round(applied.centerY)} | Bioma:{' '}
                {cursorCellInfo?.biomeName ?? centerBiome?.biomeName ?? 'N/A'} | Terreno:{' '}
                {cursorCellInfo?.terrainName ?? centerTerrain?.terrainName ?? 'N/A'}
              </Text>
            </View>

            <Text style={styles.helperText}>
              Escala aprox: {scalePerCell} bloques por division | Resolucion: {biomeCellsPerSide}x{biomeCellsPerSide} | Puntos: {markers.length}
              {centerBiome ? ` | Bioma centro: ${centerBiome.biomeName}` : ''}
              {centerTerrain ? ` | Terreno centro: ${centerTerrain.terrainName}` : ''}
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

            {showTerrain && terrainSummary.length ? (
              <View style={styles.terrainLegendWrap}>
                {terrainSummary.map((entry) => (
                  <View key={entry.terrainId} style={styles.terrainLegendChip}>
                    <View style={[styles.terrainLegendDot, { backgroundColor: entry.terrainColor }]} />
                    <Text style={styles.terrainLegendText}>
                      {entry.terrainName} {entry.percent}%
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
                <Text style={styles.layerMeta}>Terreno local: {selectedTerrain?.terrainName ?? 'Sin dato'}</Text>
                <Pressable onPress={focusMarker} style={[styles.actionBtn, styles.actionGood]}>
                  <Text style={styles.actionTxt}>Centrar mapa aqui</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.empty}>
                Bioma centro: {centerBiome?.biomeName ?? 'N/A'} | Terreno centro: {centerTerrain?.terrainName ?? 'N/A'}.
                Toca un marcador para ver detalle completo.
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
                  <Text style={styles.layerMeta}>Terreno: {entry.terrain.terrainName}</Text>
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
  mapFrame: {
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    width: '100%',
  },
  mapRowWrap: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  topRuler: {
    backgroundColor: '#F4EFD7',
    borderColor: '#C8BA8F',
    borderRadius: radius.md,
    borderWidth: 1,
    height: 28,
    position: 'relative',
  },
  leftRuler: {
    backgroundColor: '#F4EFD7',
    borderColor: '#C8BA8F',
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 62,
    position: 'relative',
    width: 62,
  },
  axisTitleTop: {
    color: palette.secondary,
    fontFamily: font.display,
    fontSize: 10,
    left: 6,
    position: 'absolute',
    top: 6,
  },
  axisTitleLeft: {
    color: palette.secondary,
    fontFamily: font.display,
    fontSize: 10,
    left: 6,
    position: 'absolute',
    top: 6,
  },
  rulerText: {
    color: palette.text,
    fontSize: 9,
    position: 'absolute',
    top: 13,
  },
  rulerTextVertical: {
    color: palette.text,
    fontSize: 9,
    left: 7,
    position: 'absolute',
  },
  mapCanvas: {
    backgroundColor: '#162920',
    borderColor: '#4D6A56',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapCanvasPanning: {
    borderColor: '#E4C27B',
    borderWidth: 2,
  },
  biomeCell: {
    position: 'absolute',
  },
  terrainCell: {
    opacity: 0.96,
    position: 'absolute',
  },
  terrainBoundary: {
    backgroundColor: 'rgba(40,58,44,0.28)',
    position: 'absolute',
  },
  terrainBoundaryWater: {
    backgroundColor: 'rgba(204,236,255,0.38)',
  },
  cursorLineHorizontal: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  cursorLineVertical: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  cursorBar: {
    backgroundColor: '#F4EFD7',
    borderColor: '#C8BA8F',
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  cursorText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 10,
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
  terrainLegendWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  terrainLegendChip: {
    alignItems: 'center',
    backgroundColor: '#ECE8D3',
    borderColor: '#BEB18A',
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  terrainLegendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  terrainLegendText: {
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
  markerLabel: {
    color: '#F1FFF4',
    fontSize: 9,
    fontWeight: '700',
    maxWidth: 90,
    position: 'absolute',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 2,
  },
  mapTooltip: {
    backgroundColor: 'rgba(33,44,36,0.94)',
    borderColor: '#A6D3B4',
    borderRadius: radius.sm,
    borderWidth: 1,
    maxWidth: 170,
    paddingHorizontal: 8,
    paddingVertical: 6,
    position: 'absolute',
    zIndex: 50,
  },
  mapTooltipTitle: {
    color: '#F5FFF8',
    fontFamily: font.display,
    fontSize: 9,
  },
  mapTooltipCoords: {
    color: '#D8F2DF',
    fontSize: 9,
    marginTop: 2,
  },
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
  zoomResetBtn: {
    backgroundColor: '#E6F5EA',
    borderColor: '#A4CCAF',
    width: 40,
  },
  zoomResetTxt: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 10,
  },
  zoomTxt: { color: palette.text, fontFamily: font.display, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  zoomValue: { color: palette.text, fontFamily: font.display, fontSize: 12, minWidth: 42, textAlign: 'center' },
});
