export type StructureMode = 'hollowShell' | 'solid' | 'wallsOnly';

export interface StructureResult {
  blocks: number;
  floorArea: number;
  shulkersNeeded: number;
  stacksAndRemainder: string;
}

export type PortalDirection = 'overworld_to_nether' | 'nether_to_overworld';

export interface PortalCoordinateResult {
  direction: PortalDirection;
  sourceX: number;
  sourceZ: number;
  targetX: number;
  targetZ: number;
  targetXRounded: number;
  targetZRounded: number;
}

export interface PortalFrameResult {
  cornersMode: 'full' | 'no_corners';
  frameHeight: number;
  frameWidth: number;
  innerHeight: number;
  innerWidth: number;
  obsidianBlocks: number;
  portalArea: number;
}

export type MegaProjectPreset = 'ba_sing_se' | 'the_wall';

export interface MegaProjectBreakdown {
  label: string;
  value: number;
}

export interface MegaProjectMaterial {
  blocks: number;
  label: string;
  stacks: string;
}

export interface MegaProjectResult {
  breakdown: MegaProjectBreakdown[];
  chunksAcross: number;
  estimatedDays: number;
  estimatedHours: number;
  materials: MegaProjectMaterial[];
  name: string;
  shulkersNeeded: number;
  stacksAndRemainder: string;
  totalBlocks: number;
}

export interface BaSingSeInput {
  blocksPerHour: number;
  gateCount: number;
  gateWidth: number;
  moatWidth: number;
  radius: number;
  ringRoads: number;
  towerCount: number;
  towerRadius: number;
  wallHeight: number;
  wallThickness: number;
}

export interface TheWallInput {
  blocksPerHour: number;
  buttressDepth: number;
  buttressSpacing: number;
  gateCount: number;
  gateWidth: number;
  length: number;
  towerHeight: number;
  towerSize: number;
  towerSpacing: number;
  wallHeight: number;
  wallThickness: number;
}

export type DiamondPiece =
  | 'axe'
  | 'boots'
  | 'chestplate'
  | 'helmet'
  | 'hoe'
  | 'leggings'
  | 'pickaxe'
  | 'shovel'
  | 'sword';

export const diamondCostByPiece: Record<DiamondPiece, number> = {
  axe: 3,
  boots: 4,
  chestplate: 8,
  helmet: 5,
  hoe: 2,
  leggings: 7,
  pickaxe: 3,
  shovel: 1,
  sword: 2,
};

const safeDimension = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
};

const safePositive = (value: number, fallback: number) => {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }
  return value;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toStacks = (blocks: number) => {
  const stacks = Math.floor(blocks / 64);
  const remainder = blocks % 64;

  if (stacks === 0) {
    return `${remainder} bloques`;
  }

  return `${stacks} stacks + ${remainder} bloques`;
};

const toMaterialRow = (label: string, blocks: number): MegaProjectMaterial => {
  const safe = Math.max(0, Math.round(blocks));
  return {
    blocks: safe,
    label,
    stacks: toStacks(safe),
  };
};

export function calculateStructureBlocks(
  lengthInput: number,
  widthInput: number,
  heightInput: number,
  mode: StructureMode,
): StructureResult {
  const length = safeDimension(lengthInput);
  const width = safeDimension(widthInput);
  const height = safeDimension(heightInput);

  const floorArea = length * width;
  const totalVolume = length * width * height;
  const innerVolume = Math.max(length - 2, 0) * Math.max(width - 2, 0) * Math.max(height - 2, 0);
  const wallsOnly = (2 * (length + width) - 4) * height;

  let blocks = totalVolume;
  if (mode === 'hollowShell') {
    blocks = totalVolume - innerVolume;
  } else if (mode === 'wallsOnly') {
    blocks = wallsOnly;
  }

  return {
    blocks,
    floorArea,
    shulkersNeeded: Math.ceil(blocks / 1728),
    stacksAndRemainder: toStacks(blocks),
  };
}

export function calculateDiamondNeed(pieces: DiamondPiece[]) {
  return pieces.reduce((acc, piece) => acc + diamondCostByPiece[piece], 0);
}

export function calculatePortalCoordinates(
  sourceXInput: number,
  sourceZInput: number,
  direction: PortalDirection,
): PortalCoordinateResult {
  const sourceX = Number.isFinite(sourceXInput) ? sourceXInput : 0;
  const sourceZ = Number.isFinite(sourceZInput) ? sourceZInput : 0;
  const factor = direction === 'overworld_to_nether' ? 1 / 8 : 8;
  const targetX = sourceX * factor;
  const targetZ = sourceZ * factor;

  return {
    direction,
    sourceX,
    sourceZ,
    targetX,
    targetXRounded: Math.round(targetX),
    targetZ,
    targetZRounded: Math.round(targetZ),
  };
}

export function calculatePortalFrame(
  innerWidthInput: number,
  innerHeightInput: number,
  cornersMode: 'full' | 'no_corners',
): PortalFrameResult {
  const innerWidth = clamp(Math.floor(safePositive(innerWidthInput, 2)), 2, 21);
  const innerHeight = clamp(Math.floor(safePositive(innerHeightInput, 3)), 3, 21);
  const frameWidth = innerWidth + 2;
  const frameHeight = innerHeight + 2;
  const perimeter = frameWidth * 2 + (frameHeight - 2) * 2;
  const obsidianBlocks = cornersMode === 'no_corners' ? Math.max(0, perimeter - 4) : perimeter;

  return {
    cornersMode,
    frameHeight,
    frameWidth,
    innerHeight,
    innerWidth,
    obsidianBlocks,
    portalArea: innerWidth * innerHeight,
  };
}

export function calculateBaSingSeProject(input: BaSingSeInput): MegaProjectResult {
  const radius = safePositive(input.radius, 800);
  const wallHeight = safePositive(input.wallHeight, 64);
  const wallThickness = safePositive(input.wallThickness, 8);
  const towerCount = Math.max(0, Math.floor(safePositive(input.towerCount, 24)));
  const towerRadius = safePositive(input.towerRadius, 6);
  const gateCount = Math.max(1, Math.floor(safePositive(input.gateCount, 4)));
  const gateWidth = safePositive(input.gateWidth, 18);
  const moatWidth = safePositive(input.moatWidth, 10);
  const ringRoads = Math.max(0, Math.floor(safePositive(input.ringRoads, 3)));
  const blocksPerHour = safePositive(input.blocksPerHour, 2200);

  const circumference = 2 * Math.PI * radius;
  const wallBody = circumference * wallHeight * wallThickness;
  const wallTopWalk = circumference * Math.max(2, wallThickness - 2);
  const towerVolume = towerCount * Math.PI * towerRadius * towerRadius * (wallHeight * 1.15);
  const gateComplex = gateCount * gateWidth * wallHeight * Math.max(3, wallThickness * 0.55);
  const moatExcavation = 2 * Math.PI * (radius + wallThickness + moatWidth / 2) * moatWidth * 5;
  const ringRoadVolume = ringRoads * (2 * Math.PI * (radius * 0.68)) * 3;
  const defenseCrenel = circumference * Math.max(2, wallThickness * 0.6);

  const totalBlocks = Math.round(
    wallBody + wallTopWalk + towerVolume + gateComplex + moatExcavation + ringRoadVolume + defenseCrenel,
  );
  const estimatedHours = Number((totalBlocks / blocksPerHour).toFixed(1));
  const estimatedDays = Number((estimatedHours / 6).toFixed(1));

  const materialPlan = [
    toMaterialRow('Ladrillos de piedra / piedra profunda', totalBlocks * 0.56),
    toMaterialRow('Piedra lisa / andesita', totalBlocks * 0.2),
    toMaterialRow('Madera (vigas y puertas)', totalBlocks * 0.11),
    toMaterialRow('Iluminacion y decoracion', totalBlocks * 0.06),
    toMaterialRow('Cristal, hierro y detalles', totalBlocks * 0.07),
  ];

  return {
    breakdown: [
      { label: 'Muralla principal', value: Math.round(wallBody + wallTopWalk) },
      { label: 'Torres de vigilancia', value: Math.round(towerVolume) },
      { label: 'Puertas monumentales', value: Math.round(gateComplex) },
      { label: 'Foso / excavacion', value: Math.round(moatExcavation) },
      { label: 'Caminos circulares internos', value: Math.round(ringRoadVolume + defenseCrenel) },
    ],
    chunksAcross: Math.max(1, Math.ceil((radius * 2) / 16)),
    estimatedDays,
    estimatedHours,
    materials: materialPlan,
    name: 'Ba Sing Se (ciudad amurallada)',
    shulkersNeeded: Math.ceil(totalBlocks / 1728),
    stacksAndRemainder: toStacks(totalBlocks),
    totalBlocks,
  };
}

export function calculateTheWallProject(input: TheWallInput): MegaProjectResult {
  const length = safePositive(input.length, 2600);
  const wallHeight = safePositive(input.wallHeight, 180);
  const wallThickness = safePositive(input.wallThickness, 26);
  const buttressSpacing = safePositive(input.buttressSpacing, 96);
  const buttressDepth = safePositive(input.buttressDepth, 18);
  const gateCount = Math.max(1, Math.floor(safePositive(input.gateCount, 3)));
  const gateWidth = safePositive(input.gateWidth, 24);
  const towerSpacing = safePositive(input.towerSpacing, 320);
  const towerSize = safePositive(input.towerSize, 28);
  const towerHeight = safePositive(input.towerHeight, 48);
  const blocksPerHour = safePositive(input.blocksPerHour, 2400);

  const wallBody = length * wallHeight * wallThickness;
  const buttressCount = Math.max(2, Math.floor(length / buttressSpacing));
  const buttressVolume = buttressCount * (wallHeight * buttressDepth * Math.max(6, wallThickness * 0.6));
  const gateComplex = gateCount * gateWidth * wallHeight * Math.max(6, wallThickness * 0.8);
  const towerCount = Math.max(2, Math.floor(length / towerSpacing) + 1);
  const towerVolume = towerCount * towerSize * towerSize * towerHeight * 0.82;
  const tunnelService = length * Math.max(3, wallThickness * 0.28) * Math.max(3, wallHeight * 0.16);
  const battlement = length * Math.max(3, wallThickness * 0.45);

  const totalBlocks = Math.round(wallBody + buttressVolume + gateComplex + towerVolume + tunnelService + battlement);
  const estimatedHours = Number((totalBlocks / blocksPerHour).toFixed(1));
  const estimatedDays = Number((estimatedHours / 6).toFixed(1));

  const materialPlan = [
    toMaterialRow('Hielo compactado / nieve (cuerpo principal)', totalBlocks * 0.64),
    toMaterialRow('Piedra y deep slate (base y refuerzo)', totalBlocks * 0.18),
    toMaterialRow('Madera (puertas, torres, interiores)', totalBlocks * 0.09),
    toMaterialRow('Iluminacion y redstone', totalBlocks * 0.04),
    toMaterialRow('Decoracion, hierro y cristal', totalBlocks * 0.05),
  ];

  return {
    breakdown: [
      { label: 'Muralla principal', value: Math.round(wallBody) },
      { label: 'Contrafuertes', value: Math.round(buttressVolume) },
      { label: 'Puertas y fortines', value: Math.round(gateComplex) },
      { label: 'Torres', value: Math.round(towerVolume) },
      { label: 'Pasajes internos y almenas', value: Math.round(tunnelService + battlement) },
    ],
    chunksAcross: Math.max(1, Math.ceil(length / 16)),
    estimatedDays,
    estimatedHours,
    materials: materialPlan,
    name: 'Muralla Norte (fantasia tipo GOT)',
    shulkersNeeded: Math.ceil(totalBlocks / 1728),
    stacksAndRemainder: toStacks(totalBlocks),
    totalBlocks,
  };
}
