export type SeedEdition = 'bedrock_1_21' | 'java_1_21';
export type SeedDimension = 'end' | 'nether' | 'overworld';
export type StructureCategory = 'exploracion' | 'loot' | 'progreso' | 'recursos' | 'seguridad';

export interface StructureCategoryMeta {
  description: string;
  id: StructureCategory;
  label: string;
}

export interface StructureLayer {
  aliases: string[];
  category: StructureCategory;
  chance: number;
  color: string;
  defaultEnabled: boolean;
  description: string;
  dimension: SeedDimension;
  id: string;
  lootHint: string;
  name: string;
  rarity: 'Comun' | 'Muy rara' | 'Poco comun' | 'Rara';
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

export interface BiomeCell {
  biomeColor: string;
  biomeId: string;
  biomeName: string;
  col: number;
  row: number;
  x: number;
  z: number;
}

export interface TerrainCell {
  col: number;
  row: number;
  terrainColor: string;
  terrainId: string;
  terrainName: string;
  x: number;
  z: number;
}

interface BiomeDefinition {
  color: string;
  id: string;
  name: string;
}

const layerSeedSalt = 0x9e3779b9;

export const structureCategories: StructureCategoryMeta[] = [
  {
    description: 'Acelera llegada a Nether/End y avances clave.',
    id: 'progreso',
    label: 'Progreso',
  },
  {
    description: 'Obtencion de botin y equipamiento.',
    id: 'loot',
    label: 'Loot',
  },
  {
    description: 'Materiales o recursos continuos.',
    id: 'recursos',
    label: 'Recursos',
  },
  {
    description: 'Ubicaciones para base y control de zona.',
    id: 'seguridad',
    label: 'Seguridad',
  },
  {
    description: 'Puntos para explorar biomas y contenido adicional.',
    id: 'exploracion',
    label: 'Exploracion',
  },
];

export const structureLayers: StructureLayer[] = [
  {
    aliases: ['aldea', 'village', 'villager', 'pueblo'],
    category: 'seguridad',
    chance: 0.94,
    color: '#53A548',
    defaultEnabled: true,
    description: 'Aldeas para camas, comercio y comida.',
    dimension: 'overworld',
    id: 'village',
    lootHint: 'Comida, camas, aldeanos para trading.',
    name: 'Aldea',
    rarity: 'Comun',
    spacingBedrock: 512,
    spacingJava: 384,
  },
  {
    aliases: ['mansion', 'woodland mansion', 'evocador'],
    category: 'loot',
    chance: 0.42,
    color: '#A02E2A',
    defaultEnabled: false,
    description: 'Mansion del bosque oscuro.',
    dimension: 'overworld',
    id: 'mansion',
    lootHint: 'Totems y loot de exploracion.',
    name: 'Mansion',
    rarity: 'Rara',
    spacingBedrock: 1536,
    spacingJava: 1280,
  },
  {
    aliases: ['monumento', 'ocean monument', 'guardian'],
    category: 'progreso',
    chance: 0.52,
    color: '#2A6FA0',
    defaultEnabled: false,
    description: 'Monumento oceanico para prismarina.',
    dimension: 'overworld',
    id: 'monument',
    lootHint: 'Esponjas y bloques de prismarina.',
    name: 'Monumento oceanico',
    rarity: 'Poco comun',
    spacingBedrock: 1024,
    spacingJava: 1024,
  },
  {
    aliases: ['outpost', 'pillager', 'saqueador'],
    category: 'loot',
    chance: 0.62,
    color: '#7A5A3A',
    defaultEnabled: true,
    description: 'Outpost saqueador con capitanes.',
    dimension: 'overworld',
    id: 'outpost',
    lootHint: 'Botin temprano y farm de raids.',
    name: 'Outpost',
    rarity: 'Poco comun',
    spacingBedrock: 640,
    spacingJava: 512,
  },
  {
    aliases: ['shipwreck', 'barco', 'naufragio'],
    category: 'loot',
    chance: 0.72,
    color: '#E2C54E',
    defaultEnabled: false,
    description: 'Barcos hundidos con cofres de loot.',
    dimension: 'overworld',
    id: 'shipwreck',
    lootHint: 'Mapas del tesoro, hierro y esmeraldas.',
    name: 'Shipwreck',
    rarity: 'Comun',
    spacingBedrock: 512,
    spacingJava: 512,
  },
  {
    aliases: ['ruined portal', 'portal arruinado', 'portal en ruinas'],
    category: 'progreso',
    chance: 0.56,
    color: '#9F6AC9',
    defaultEnabled: true,
    description: 'Portales en ruinas para acceso temprano al Nether.',
    dimension: 'overworld',
    id: 'ruined-portal',
    lootHint: 'Obsidiana, pedernal y oro.',
    name: 'Portal en ruinas',
    rarity: 'Poco comun',
    spacingBedrock: 512,
    spacingJava: 512,
  },
  {
    aliases: ['trial', 'trial chamber', 'camara de pruebas'],
    category: 'loot',
    chance: 0.44,
    color: '#CC6E3D',
    defaultEnabled: true,
    description: 'Trial chambers para botin y llaves.',
    dimension: 'overworld',
    id: 'trial-chamber',
    lootHint: 'Loot nuevo 1.21 y llaves de trial.',
    name: 'Trial Chamber',
    rarity: 'Poco comun',
    spacingBedrock: 640,
    spacingJava: 640,
  },
  {
    aliases: ['ancient city', 'ciudad antigua', 'deep dark'],
    category: 'loot',
    chance: 0.38,
    color: '#3E7A70',
    defaultEnabled: false,
    description: 'Ancient City en Deep Dark.',
    dimension: 'overworld',
    id: 'ancient-city',
    lootHint: 'Catalyst, discos y botin raro.',
    name: 'Ancient City',
    rarity: 'Rara',
    spacingBedrock: 1024,
    spacingJava: 768,
  },
  {
    aliases: ['stronghold', 'fortaleza', 'end portal'],
    category: 'progreso',
    chance: 1,
    color: '#2449A8',
    defaultEnabled: true,
    description: 'Strongholds para llegar al End.',
    dimension: 'overworld',
    id: 'stronghold',
    lootHint: 'Biblioteca, portal al End y loot de cofres.',
    name: 'Stronghold',
    rarity: 'Rara',
    spacingBedrock: 1536,
    spacingJava: 1408,
  },
  {
    aliases: ['mineshaft', 'mina abandonada', 'spawner cave spider'],
    category: 'recursos',
    chance: 0.76,
    color: '#9B7447',
    defaultEnabled: false,
    description: 'Mina abandonada con madera, rieles y spawners.',
    dimension: 'overworld',
    id: 'mineshaft',
    lootHint: 'Rieles, menas y loot de cofres.',
    name: 'Mina abandonada',
    rarity: 'Comun',
    spacingBedrock: 448,
    spacingJava: 384,
  },
  {
    aliases: ['desert pyramid', 'templo desierto', 'piramide'],
    category: 'loot',
    chance: 0.62,
    color: '#D7B26D',
    defaultEnabled: false,
    description: 'Templo del desierto con TNT y cofres.',
    dimension: 'overworld',
    id: 'desert-pyramid',
    lootHint: 'Diamantes, oro, huesos y encantados.',
    name: 'Templo desierto',
    rarity: 'Poco comun',
    spacingBedrock: 768,
    spacingJava: 736,
  },
  {
    aliases: ['jungle temple', 'templo jungla'],
    category: 'loot',
    chance: 0.46,
    color: '#5A8A49',
    defaultEnabled: false,
    description: 'Templo de jungla con redstone/trampas.',
    dimension: 'overworld',
    id: 'jungle-temple',
    lootHint: 'Cofres con oro/diamantes.',
    name: 'Templo jungla',
    rarity: 'Rara',
    spacingBedrock: 864,
    spacingJava: 768,
  },
  {
    aliases: ['swamp hut', 'witch hut', 'choza bruja'],
    category: 'recursos',
    chance: 0.44,
    color: '#557069',
    defaultEnabled: false,
    description: 'Choza de bruja para granjas de drops.',
    dimension: 'overworld',
    id: 'swamp-hut',
    lootHint: 'Polvora, redstone, glowstone y botellas.',
    name: 'Choza de bruja',
    rarity: 'Rara',
    spacingBedrock: 832,
    spacingJava: 768,
  },
  {
    aliases: ['igloo', 'sotano aldeano', 'snow structure'],
    category: 'exploracion',
    chance: 0.32,
    color: '#AED6E9',
    defaultEnabled: false,
    description: 'Igloo de nieve; algunos tienen sotano.',
    dimension: 'overworld',
    id: 'igloo',
    lootHint: 'Pociones y loot menor.',
    name: 'Igloo',
    rarity: 'Rara',
    spacingBedrock: 1024,
    spacingJava: 896,
  },
  {
    aliases: ['ocean ruin', 'ruinas oceanicas'],
    category: 'exploracion',
    chance: 0.66,
    color: '#6BA4C4',
    defaultEnabled: false,
    description: 'Ruinas con bloques y loot simple.',
    dimension: 'overworld',
    id: 'ocean-ruin',
    lootHint: 'Carbones, esmeraldas y objetos menores.',
    name: 'Ruinas oceanicas',
    rarity: 'Poco comun',
    spacingBedrock: 640,
    spacingJava: 640,
  },
  {
    aliases: ['buried treasure', 'tesoro enterrado'],
    category: 'loot',
    chance: 0.72,
    color: '#DAA63E',
    defaultEnabled: false,
    description: 'Tesoro enterrado en playas y costas.',
    dimension: 'overworld',
    id: 'buried-treasure',
    lootHint: 'Corazon del mar, hierro, oro y prismarina.',
    name: 'Tesoro enterrado',
    rarity: 'Poco comun',
    spacingBedrock: 512,
    spacingJava: 512,
  },
  {
    aliases: ['trail ruins', 'ruinas sendero', 'arqueologia'],
    category: 'exploracion',
    chance: 0.34,
    color: '#B37C55',
    defaultEnabled: false,
    description: 'Ruinas para arqueologia.',
    dimension: 'overworld',
    id: 'trail-ruins',
    lootHint: 'Shards, plantillas y decoracion.',
    name: 'Trail Ruins',
    rarity: 'Rara',
    spacingBedrock: 896,
    spacingJava: 832,
  },
  {
    aliases: ['nether fortress', 'fortaleza nether', 'blaze'],
    category: 'progreso',
    chance: 0.58,
    color: '#A13D39',
    defaultEnabled: true,
    description: 'Fortaleza del Nether para blaze rods.',
    dimension: 'nether',
    id: 'nether-fortress',
    lootHint: 'Blaze rods y nether wart.',
    name: 'Fortaleza del Nether',
    rarity: 'Poco comun',
    spacingBedrock: 768,
    spacingJava: 640,
  },
  {
    aliases: ['bastion', 'bastion remnant', 'piglin'],
    category: 'loot',
    chance: 0.5,
    color: '#B5752D',
    defaultEnabled: true,
    description: 'Bastion remnant para lingotes/netherite.',
    dimension: 'nether',
    id: 'bastion',
    lootHint: 'Lingotes, loot de netherite y oro.',
    name: 'Bastion',
    rarity: 'Poco comun',
    spacingBedrock: 768,
    spacingJava: 640,
  },
  {
    aliases: ['ruined portal nether', 'portal ruinas nether'],
    category: 'exploracion',
    chance: 0.56,
    color: '#C07BD9',
    defaultEnabled: false,
    description: 'Portales en ruinas dentro del Nether.',
    dimension: 'nether',
    id: 'nether-ruined-portal',
    lootHint: 'Obsidiana, oro y herramientas danadas.',
    name: 'Portal en ruinas (Nether)',
    rarity: 'Poco comun',
    spacingBedrock: 704,
    spacingJava: 704,
  },
  {
    aliases: ['nether fossil', 'fosil nether'],
    category: 'exploracion',
    chance: 0.28,
    color: '#7A5D49',
    defaultEnabled: false,
    description: 'Fosiles en biomas soul sand valley.',
    dimension: 'nether',
    id: 'nether-fossil',
    lootHint: 'Principalmente valor visual/exploracion.',
    name: 'Fosil del Nether',
    rarity: 'Muy rara',
    spacingBedrock: 1024,
    spacingJava: 960,
  },
  {
    aliases: ['end city', 'elytra', 'shulker'],
    category: 'progreso',
    chance: 0.52,
    color: '#7B7FD9',
    defaultEnabled: true,
    description: 'End cities con elytra y shulkers.',
    dimension: 'end',
    id: 'end-city',
    lootHint: 'Elytra, shulker shells y diamante encantado.',
    name: 'End City',
    rarity: 'Poco comun',
    spacingBedrock: 1024,
    spacingJava: 896,
  },
  {
    aliases: ['end gateway', 'gateway', 'portal end externo'],
    category: 'exploracion',
    chance: 0.3,
    color: '#9EA4E8',
    defaultEnabled: false,
    description: 'Gateway del End para acceso a islas externas.',
    dimension: 'end',
    id: 'end-gateway',
    lootHint: 'Movilidad entre islas del End.',
    name: 'Gateway del End',
    rarity: 'Rara',
    spacingBedrock: 1536,
    spacingJava: 1408,
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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const hash2D = (seed: number, x: number, z: number, salt: number) => {
  let h =
    seed ^
    Math.imul((x ^ salt) + 0x7feb352d, 0x9e3779b1) ^
    Math.imul((z + salt) ^ 0x846ca68b, 0x85ebca77);
  h = (h ^ (h >>> 16)) >>> 0;
  h = Math.imul(h, 0x7feb352d) >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  h = Math.imul(h, 0x846ca68b) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
};

const valueNoise = (seed: number, x: number, z: number, scale: number, salt: number) => {
  const scaledX = x / scale;
  const scaledZ = z / scale;
  const x0 = Math.floor(scaledX);
  const z0 = Math.floor(scaledZ);
  const x1 = x0 + 1;
  const z1 = z0 + 1;
  const fx = smoothstep(scaledX - x0);
  const fz = smoothstep(scaledZ - z0);

  const v00 = hash2D(seed, x0, z0, salt) / 0xffffffff;
  const v10 = hash2D(seed, x1, z0, salt) / 0xffffffff;
  const v01 = hash2D(seed, x0, z1, salt) / 0xffffffff;
  const v11 = hash2D(seed, x1, z1, salt) / 0xffffffff;

  const top = lerp(v00, v10, fx);
  const bottom = lerp(v01, v11, fx);
  return lerp(top, bottom, fz);
};

const overworldBiomes: BiomeDefinition[] = [
  { color: '#87AE50', id: 'plains', name: 'Plains' },
  { color: '#3F8F41', id: 'forest', name: 'Forest' },
  { color: '#78B85D', id: 'birch-forest', name: 'Birch Forest' },
  { color: '#55734E', id: 'taiga', name: 'Taiga' },
  { color: '#D8ECF8', id: 'snowy-plains', name: 'Snowy Plains' },
  { color: '#BFE4FF', id: 'ice-spikes', name: 'Ice Spikes' },
  { color: '#E4CD7B', id: 'desert', name: 'Desert' },
  { color: '#C2A854', id: 'savanna', name: 'Savanna' },
  { color: '#2C8D49', id: 'jungle', name: 'Jungle' },
  { color: '#4B6A42', id: 'swamp', name: 'Swamp' },
  { color: '#C27A4F', id: 'badlands', name: 'Badlands' },
  { color: '#D9A2C7', id: 'cherry-grove', name: 'Cherry Grove' },
  { color: '#98A58F', id: 'windswept', name: 'Windswept Hills' },
  { color: '#E4EEF5', id: 'frozen-peaks', name: 'Frozen Peaks' },
  { color: '#3D73B5', id: 'ocean', name: 'Ocean' },
  { color: '#4E9DCD', id: 'warm-ocean', name: 'Warm Ocean' },
  { color: '#2A4E84', id: 'deep-ocean', name: 'Deep Ocean' },
];

const netherBiomes: BiomeDefinition[] = [
  { color: '#8A3B2F', id: 'nether-wastes', name: 'Nether Wastes' },
  { color: '#A52747', id: 'crimson-forest', name: 'Crimson Forest' },
  { color: '#2D978C', id: 'warped-forest', name: 'Warped Forest' },
  { color: '#75717B', id: 'soul-sand-valley', name: 'Soul Sand Valley' },
  { color: '#5E5050', id: 'basalt-deltas', name: 'Basalt Deltas' },
  { color: '#C54A1E', id: 'lava-sea', name: 'Lava Sea' },
];

const endBiomes: BiomeDefinition[] = [
  { color: '#C8C192', id: 'end-highlands', name: 'End Highlands' },
  { color: '#B4AF82', id: 'end-midlands', name: 'End Midlands' },
  { color: '#9C9772', id: 'end-barrens', name: 'End Barrens' },
  { color: '#8A8568', id: 'small-end-islands', name: 'Small End Islands' },
  { color: '#3E374C', id: 'void', name: 'The Void' },
];

const biomeById = new Map<string, BiomeDefinition>(
  [...overworldBiomes, ...netherBiomes, ...endBiomes].map((biome) => [biome.id, biome])
);

const getBiome = (id: string) =>
  biomeById.get(id) || {
    color: '#5D5D5D',
    id: 'unknown',
    name: 'Unknown',
  };

const overworldBiomeAt = (seedValue: number, x: number, z: number): BiomeDefinition => {
  const continentalness = valueNoise(seedValue, x, z, 1850, 0x1234);
  const temperature = valueNoise(seedValue, x, z, 1200, 0x2345);
  const humidity = valueNoise(seedValue, x, z, 1120, 0x3456);
  const erosion = valueNoise(seedValue, x, z, 860, 0x4567);
  const weirdness = valueNoise(seedValue, x, z, 560, 0x5678);

  if (continentalness < 0.24) {
    if (continentalness < 0.12) {
      return getBiome('deep-ocean');
    }
    if (temperature > 0.67) {
      return getBiome('warm-ocean');
    }
    return getBiome('ocean');
  }

  if (erosion > 0.83) {
    if (temperature < 0.36) {
      return getBiome('frozen-peaks');
    }
    return getBiome('windswept');
  }

  if (temperature < 0.2) {
    if (humidity < 0.48) {
      return getBiome('snowy-plains');
    }
    return weirdness > 0.72 ? getBiome('ice-spikes') : getBiome('taiga');
  }

  if (temperature < 0.38) {
    if (humidity > 0.66) {
      return getBiome('taiga');
    }
    return weirdness > 0.64 ? getBiome('birch-forest') : getBiome('forest');
  }

  if (temperature < 0.62) {
    if (humidity > 0.74) {
      return getBiome('swamp');
    }
    if (weirdness > 0.7) {
      return getBiome('cherry-grove');
    }
    return humidity > 0.52 ? getBiome('forest') : getBiome('plains');
  }

  if (temperature < 0.78) {
    if (humidity > 0.72) {
      return getBiome('jungle');
    }
    return humidity > 0.42 ? getBiome('savanna') : getBiome('plains');
  }

  if (humidity > 0.66) {
    return getBiome('jungle');
  }

  return humidity < 0.28 ? getBiome('badlands') : getBiome('desert');
};

const netherBiomeAt = (seedValue: number, x: number, z: number): BiomeDefinition => {
  const heat = valueNoise(seedValue, x, z, 900, 0x6789);
  const ash = valueNoise(seedValue, x, z, 620, 0x789a);
  const fungus = valueNoise(seedValue, x, z, 560, 0x89ab);

  if (heat < 0.18) {
    return getBiome('lava-sea');
  }
  if (ash > 0.74) {
    return getBiome('basalt-deltas');
  }
  if (fungus > 0.72) {
    return getBiome('warped-forest');
  }
  if (heat > 0.76 && fungus < 0.42) {
    return getBiome('crimson-forest');
  }
  if (ash > 0.56 && heat < 0.55) {
    return getBiome('soul-sand-valley');
  }
  return getBiome('nether-wastes');
};

const endBiomeAt = (seedValue: number, x: number, z: number): BiomeDefinition => {
  const distanceFromOrigin = Math.sqrt(x * x + z * z);
  const islands = valueNoise(seedValue, x, z, 1200, 0x9abc);
  const ridges = valueNoise(seedValue, x, z, 700, 0xabcd);

  if (distanceFromOrigin < 850) {
    return getBiome('void');
  }
  if (islands < 0.23) {
    return getBiome('small-end-islands');
  }
  if (ridges > 0.75) {
    return getBiome('end-highlands');
  }
  if (ridges > 0.48) {
    return getBiome('end-midlands');
  }
  return getBiome('end-barrens');
};

export const getBiomeAtPoint = ({
  dimension,
  edition,
  seed,
  x,
  z,
}: {
  dimension: SeedDimension;
  edition: SeedEdition;
  seed: string;
  x: number;
  z: number;
}) => {
  const seedValue = parseSeedValue(seed) ^ (edition === 'java_1_21' ? 0x1337babe : 0x5eedbabe);
  let biome: BiomeDefinition;

  if (dimension === 'nether') {
    biome = netherBiomeAt(seedValue, x, z);
  } else if (dimension === 'end') {
    biome = endBiomeAt(seedValue, x, z);
  } else {
    biome = overworldBiomeAt(seedValue, x, z);
  }

  return {
    biomeColor: biome.color,
    biomeId: biome.id,
    biomeName: biome.name,
    x,
    z,
  };
};

export const getTerrainAtPoint = ({
  dimension,
  edition,
  seed,
  x,
  z,
}: {
  dimension: SeedDimension;
  edition: SeedEdition;
  seed: string;
  x: number;
  z: number;
}) => {
  const seedValue = parseSeedValue(seed) ^ (edition === 'java_1_21' ? 0x43e917aa : 0x4b1dca72);
  const broad = valueNoise(seedValue, x, z, 950, 0x2f31);
  const local = valueNoise(seedValue, x, z, 380, 0x31a7);
  const riverNoise = valueNoise(seedValue, x, z, 560, 0x49bf);
  const heat = valueNoise(seedValue, x, z, 840, 0x63d4);
  const roughness = valueNoise(seedValue, x, z, 270, 0x7cf1);
  const elevation = broad * 0.62 + local * 0.38;

  if (dimension === 'nether') {
    if (elevation < 0.2) {
      return { terrainColor: '#C94B22', terrainId: 'lava-sea', terrainName: 'Mar de lava', x, z };
    }
    if (roughness > 0.78) {
      return { terrainColor: '#6C5D5B', terrainId: 'basalt-ridges', terrainName: 'Risco de basalto', x, z };
    }
    if (heat > 0.72) {
      return { terrainColor: '#8E2A3F', terrainId: 'hot-zone', terrainName: 'Zona caliente', x, z };
    }
    return { terrainColor: '#7A3D30', terrainId: 'nether-land', terrainName: 'Tierra del Nether', x, z };
  }

  if (dimension === 'end') {
    const dist = Math.sqrt(x * x + z * z);
    if (dist < 850) {
      return { terrainColor: '#453E59', terrainId: 'void', terrainName: 'Vacio', x, z };
    }
    if (elevation < 0.23) {
      return { terrainColor: '#7D775D', terrainId: 'small-islands', terrainName: 'Islas pequenas', x, z };
    }
    if (elevation > 0.72) {
      return { terrainColor: '#D0C798', terrainId: 'high-islands', terrainName: 'Islas altas', x, z };
    }
    return { terrainColor: '#B8B082', terrainId: 'main-islands', terrainName: 'Islas del End', x, z };
  }

  const riverBand = Math.abs(riverNoise - 0.5);
  if (elevation < 0.24) {
    return { terrainColor: '#2E67A7', terrainId: 'water', terrainName: 'Agua profunda', x, z };
  }
  if (riverBand < 0.036 && elevation < 0.68) {
    return { terrainColor: '#63B0E7', terrainId: 'river', terrainName: 'Rio', x, z };
  }
  if (elevation > 0.82 || (elevation > 0.74 && roughness > 0.66)) {
    return { terrainColor: '#BFC3CC', terrainId: 'mountain', terrainName: 'Montana', x, z };
  }
  if (elevation > 0.66) {
    return { terrainColor: '#85946A', terrainId: 'hills', terrainName: 'Colinas', x, z };
  }
  if (heat > 0.72 && elevation > 0.3 && roughness < 0.55) {
    return { terrainColor: '#D4B26E', terrainId: 'dry-plains', terrainName: 'Planicie seca', x, z };
  }
  if (roughness < 0.28 && elevation > 0.34 && elevation < 0.62) {
    return { terrainColor: '#5F8457', terrainId: 'flat-plains', terrainName: 'Planicie', x, z };
  }
  return { terrainColor: '#4E7D4B', terrainId: 'mixed-land', terrainName: 'Terreno mixto', x, z };
};

export const generateBiomeCells = ({
  centerX,
  centerZ,
  dimension,
  edition,
  radius,
  samplesPerSide,
  seed,
}: {
  centerX: number;
  centerZ: number;
  dimension: SeedDimension;
  edition: SeedEdition;
  radius: number;
  samplesPerSide: number;
  seed: string;
}) => {
  const cells: BiomeCell[] = [];
  const span = radius * 2;

  for (let row = 0; row < samplesPerSide; row += 1) {
    for (let col = 0; col < samplesPerSide; col += 1) {
      const normalizedX = (col + 0.5) / samplesPerSide;
      const normalizedZ = (row + 0.5) / samplesPerSide;
      const x = centerX - radius + span * normalizedX;
      const z = centerZ - radius + span * normalizedZ;
      const biome = getBiomeAtPoint({ dimension, edition, seed, x, z });

      cells.push({
        biomeColor: biome.biomeColor,
        biomeId: biome.biomeId,
        biomeName: biome.biomeName,
        col,
        row,
        x,
        z,
      });
    }
  }

  return cells;
};

export const generateTerrainCells = ({
  centerX,
  centerZ,
  dimension,
  edition,
  radius,
  samplesPerSide,
  seed,
}: {
  centerX: number;
  centerZ: number;
  dimension: SeedDimension;
  edition: SeedEdition;
  radius: number;
  samplesPerSide: number;
  seed: string;
}) => {
  const cells: TerrainCell[] = [];
  const span = radius * 2;

  for (let row = 0; row < samplesPerSide; row += 1) {
    for (let col = 0; col < samplesPerSide; col += 1) {
      const normalizedX = (col + 0.5) / samplesPerSide;
      const normalizedZ = (row + 0.5) / samplesPerSide;
      const x = centerX - radius + span * normalizedX;
      const z = centerZ - radius + span * normalizedZ;
      const terrain = getTerrainAtPoint({ dimension, edition, seed, x, z });

      cells.push({
        col,
        row,
        terrainColor: terrain.terrainColor,
        terrainId: terrain.terrainId,
        terrainName: terrain.terrainName,
        x,
        z,
      });
    }
  }

  return cells;
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
