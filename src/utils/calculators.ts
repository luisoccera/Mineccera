export type StructureMode = 'hollowShell' | 'solid' | 'wallsOnly';

export interface StructureResult {
  blocks: number;
  floorArea: number;
  shulkersNeeded: number;
  stacksAndRemainder: string;
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

const toStacks = (blocks: number) => {
  const stacks = Math.floor(blocks / 64);
  const remainder = blocks % 64;

  if (stacks === 0) {
    return `${remainder} bloques`;
  }

  return `${stacks} stacks + ${remainder} bloques`;
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
