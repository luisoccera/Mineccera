export type SeedEdition = 'bedrock_1_21' | 'java_1_21';
export type SeedDimension = 'end' | 'nether' | 'overworld';

export interface StructureLayer {
  chance: number;
  color: string;
  description: string;
  dimension: SeedDimension;
  id: string;
  name: string;
  spacingBedrock: number;
  spacingJava: number;
}

export interface StructurePoint {
  id: string;
  layerId: string;
  layerName: string;
  x: number;
  z: number;
}

const layerSeedSalt = 0x9e3779b9;

export const structureLayers: StructureLayer[] = [
  {
    chance: 0.94,
    color: '#53A548',
    description: 'Aldeas para camas, comercio y comida.',
    dimension: 'overworld',
    id: 'village',
    name: 'Aldea',
    spacingBedrock: 512,
    spacingJava: 384,
  },
  {
    chance: 0.42,
    color: '#A02E2A',
    description: 'Mansion del bosque oscuro.',
    dimension: 'overworld',
    id: 'mansion',
    name: 'Mansion',
    spacingBedrock: 1536,
    spacingJava: 1280,
  },
  {
    chance: 0.52,
    color: '#2A6FA0',
    description: 'Monumento oceanico para prismarina.',
    dimension: 'overworld',
    id: 'monument',
    name: 'Monumento oceanico',
    spacingBedrock: 1024,
    spacingJava: 1024,
  },
  {
    chance: 0.62,
    color: '#7A5A3A',
    description: 'Outpost saqueador con capitanes.',
    dimension: 'overworld',
    id: 'outpost',
    name: 'Outpost',
    spacingBedrock: 640,
    spacingJava: 512,
  },
  {
    chance: 0.72,
    color: '#E2C54E',
    description: 'Barcos hundidos con cofres de loot.',
    dimension: 'overworld',
    id: 'shipwreck',
    name: 'Shipwreck',
    spacingBedrock: 512,
    spacingJava: 512,
  },
  {
    chance: 0.56,
    color: '#9F6AC9',
    description: 'Portales en ruinas para acceso temprano al Nether.',
    dimension: 'overworld',
    id: 'ruined-portal',
    name: 'Portal en ruinas',
    spacingBedrock: 512,
    spacingJava: 512,
  },
  {
    chance: 0.44,
    color: '#CC6E3D',
    description: 'Trial chambers para botin y llaves.',
    dimension: 'overworld',
    id: 'trial-chamber',
    name: 'Trial Chamber',
    spacingBedrock: 640,
    spacingJava: 640,
  },
  {
    chance: 0.38,
    color: '#3E7A70',
    description: 'Ancient City en Deep Dark.',
    dimension: 'overworld',
    id: 'ancient-city',
    name: 'Ancient City',
    spacingBedrock: 1024,
    spacingJava: 768,
  },
  {
    chance: 1,
    color: '#2449A8',
    description: 'Strongholds para llegar al End.',
    dimension: 'overworld',
    id: 'stronghold',
    name: 'Stronghold',
    spacingBedrock: 1536,
    spacingJava: 1408,
  },
  {
    chance: 0.58,
    color: '#A13D39',
    description: 'Fortaleza del Nether para blaze rods.',
    dimension: 'nether',
    id: 'nether-fortress',
    name: 'Fortaleza del Nether',
    spacingBedrock: 768,
    spacingJava: 640,
  },
  {
    chance: 0.5,
    color: '#B5752D',
    description: 'Bastion remnant para lingotes/netherite.',
    dimension: 'nether',
    id: 'bastion',
    name: 'Bastion',
    spacingBedrock: 768,
    spacingJava: 640,
  },
  {
    chance: 0.52,
    color: '#7B7FD9',
    description: 'End cities con elytra y shulkers.',
    dimension: 'end',
    id: 'end-city',
    name: 'End City',
    spacingBedrock: 1024,
    spacingJava: 896,
  },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const hashString = (input: string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

export const parseSeedValue = (rawSeed: string) => {
  const trimmed = rawSeed.trim();
  if (!trimmed) {
    return 0x1234abcd;
  }

  if (/^-?\d+$/.test(trimmed)) {
    try {
      const big = BigInt(trimmed);
      const normalized = Number(big & BigInt(0xffffffff));
      return normalized >>> 0;
    } catch {
      return hashString(trimmed);
    }
  }

  return hashString(trimmed.toLowerCase());
};

const createRng = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
};

const distanceSq = (x1: number, z1: number, x2: number, z2: number) => {
  const dx = x1 - x2;
  const dz = z1 - z2;
  return dx * dx + dz * dz;
};

let pointCounter = 0;

const createPoint = (layer: StructureLayer, x: number, z: number): StructurePoint => {
  pointCounter += 1;
  return {
    id: `${layer.id}-${pointCounter}`,
    layerId: layer.id,
    layerName: layer.name,
    x,
    z,
  };
};

const strongholdPoints = (
  layer: StructureLayer,
  seedValue: number,
  centerX: number,
  centerZ: number,
  radius: number
) => {
  const rng = createRng(seedValue ^ hashString(layer.id));
  const points: StructurePoint[] = [];
  const rings = [3, 6, 10, 15, 21];
  const baseRadius = 1100;

  let generated = 0;
  for (let ring = 0; ring < rings.length; ring += 1) {
    const ringCount = rings[ring];
    const ringRadius = baseRadius + ring * 1050 + Math.floor(rng() * 220);
    const angleOffset = rng() * Math.PI * 2;

    for (let i = 0; i < ringCount; i += 1) {
      const angle = angleOffset + (i / ringCount) * Math.PI * 2 + (rng() - 0.5) * 0.12;
      const x = Math.round(Math.cos(angle) * (ringRadius + Math.floor(rng() * 90)));
      const z = Math.round(Math.sin(angle) * (ringRadius + Math.floor(rng() * 90)));
      generated += 1;

      if (distanceSq(x, z, centerX, centerZ) <= radius * radius * 1.5) {
        points.push(createPoint(layer, x, z));
      }

      if (generated > 60) {
        break;
      }
    }
  }

  return points;
};

export const generateStructurePoints = ({
  activeLayers,
  centerX,
  centerZ,
  dimension,
  edition,
  radius,
  seed,
}: {
  activeLayers: string[];
  centerX: number;
  centerZ: number;
  dimension: SeedDimension;
  edition: SeedEdition;
  radius: number;
  seed: string;
}) => {
  pointCounter = 0;
  const seedValue = parseSeedValue(seed);
  const layers = structureLayers.filter((layer) => activeLayers.includes(layer.id) && layer.dimension === dimension);
  const points: StructurePoint[] = [];

  for (const layer of layers) {
    if (layer.id === 'stronghold' && dimension === 'overworld') {
      points.push(...strongholdPoints(layer, seedValue, centerX, centerZ, radius));
      continue;
    }

    const spacing = edition === 'java_1_21' ? layer.spacingJava : layer.spacingBedrock;
    const separation = clamp(Math.floor(spacing * 0.28), 8, spacing - 8);
    const maxOffset = Math.max(1, spacing - separation);

    const minRegionX = Math.floor((centerX - radius) / spacing) - 1;
    const maxRegionX = Math.floor((centerX + radius) / spacing) + 1;
    const minRegionZ = Math.floor((centerZ - radius) / spacing) - 1;
    const maxRegionZ = Math.floor((centerZ + radius) / spacing) + 1;

    for (let regionX = minRegionX; regionX <= maxRegionX; regionX += 1) {
      for (let regionZ = minRegionZ; regionZ <= maxRegionZ; regionZ += 1) {
        const regionSeed =
          seedValue ^
          Math.imul(regionX + 0x7f4a7c15, 0x27d4eb2d) ^
          Math.imul(regionZ + 0x165667b1, 0x85ebca6b) ^
          (hashString(layer.id) + layerSeedSalt);
        const rng = createRng(regionSeed >>> 0);

        if (rng() > layer.chance) {
          continue;
        }

        const offsetX = Math.floor(rng() * maxOffset);
        const offsetZ = Math.floor(rng() * maxOffset);
        const x = regionX * spacing + offsetX;
        const z = regionZ * spacing + offsetZ;

        if (distanceSq(x, z, centerX, centerZ) <= radius * radius * 1.25) {
          points.push(createPoint(layer, x, z));
        }
      }
    }
  }

  return points;
};

export const structureDistance = (x1: number, z1: number, x2: number, z2: number) => {
  const dx = x1 - x2;
  const dz = z1 - z2;
  return Math.round(Math.sqrt(dx * dx + dz * dz));
};
