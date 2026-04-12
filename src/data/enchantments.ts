export type ItemCategory =
  | 'axe'
  | 'boots'
  | 'bow'
  | 'brush'
  | 'chestplate'
  | 'crossbow'
  | 'elytra'
  | 'fishing_rod'
  | 'helmet'
  | 'hoe'
  | 'leggings'
  | 'mace'
  | 'pickaxe'
  | 'shears'
  | 'shield'
  | 'shovel'
  | 'sword'
  | 'trident'
  | 'turtle_shell';

export interface EnchantmentDefinition {
  categories: ItemCategory[];
  id: string;
  incompatibleWith?: string[];
  maxLevel: number;
  multiplier: number;
  name: string;
}

export interface SelectedEnchantment {
  id: string;
  level: number;
  multiplier: number;
  name: string;
}

const allTools: ItemCategory[] = ['pickaxe', 'axe', 'shovel', 'hoe'];
const allArmor: ItemCategory[] = ['helmet', 'chestplate', 'leggings', 'boots', 'turtle_shell'];
const allGear: ItemCategory[] = [
  'pickaxe',
  'axe',
  'shovel',
  'hoe',
  'sword',
  'mace',
  'helmet',
  'chestplate',
  'leggings',
  'boots',
  'turtle_shell',
  'elytra',
  'bow',
  'crossbow',
  'trident',
  'fishing_rod',
  'shield',
  'shears',
  'brush',
];

export const itemLabels: Record<ItemCategory, string> = {
  axe: 'Hacha',
  boots: 'Botas',
  bow: 'Arco',
  brush: 'Pincel',
  chestplate: 'Pechera',
  crossbow: 'Ballesta',
  elytra: 'Elytra',
  fishing_rod: 'Cana',
  helmet: 'Casco',
  hoe: 'Azada',
  leggings: 'Pantalones',
  mace: 'Maza',
  pickaxe: 'Pico',
  shears: 'Tijeras',
  shield: 'Escudo',
  shovel: 'Pala',
  sword: 'Espada',
  trident: 'Tridente',
  turtle_shell: 'Caparazon',
};

export const enchantments: EnchantmentDefinition[] = [
  { categories: allGear, id: 'mending', maxLevel: 1, multiplier: 4, name: 'Mending' },
  { categories: allGear, id: 'unbreaking', maxLevel: 3, multiplier: 2, name: 'Unbreaking' },
  { categories: allGear, id: 'curse_vanishing', maxLevel: 1, multiplier: 8, name: 'Curse of Vanishing' },
  {
    categories: ['helmet', 'chestplate', 'leggings', 'boots', 'turtle_shell', 'elytra'],
    id: 'curse_binding',
    maxLevel: 1,
    multiplier: 8,
    name: 'Curse of Binding',
  },

  {
    categories: allArmor,
    id: 'protection',
    incompatibleWith: ['blast_protection', 'fire_protection', 'projectile_protection'],
    maxLevel: 4,
    multiplier: 1,
    name: 'Protection',
  },
  {
    categories: allArmor,
    id: 'fire_protection',
    incompatibleWith: ['protection', 'blast_protection', 'projectile_protection'],
    maxLevel: 4,
    multiplier: 2,
    name: 'Fire Protection',
  },
  {
    categories: allArmor,
    id: 'blast_protection',
    incompatibleWith: ['protection', 'fire_protection', 'projectile_protection'],
    maxLevel: 4,
    multiplier: 4,
    name: 'Blast Protection',
  },
  {
    categories: allArmor,
    id: 'projectile_protection',
    incompatibleWith: ['protection', 'fire_protection', 'blast_protection'],
    maxLevel: 4,
    multiplier: 2,
    name: 'Projectile Protection',
  },
  { categories: ['helmet', 'chestplate', 'leggings', 'boots'], id: 'thorns', maxLevel: 3, multiplier: 8, name: 'Thorns' },
  { categories: ['helmet', 'turtle_shell'], id: 'respiration', maxLevel: 3, multiplier: 4, name: 'Respiration' },
  { categories: ['helmet', 'turtle_shell'], id: 'aqua_affinity', maxLevel: 1, multiplier: 4, name: 'Aqua Affinity' },
  { categories: ['leggings'], id: 'swift_sneak', maxLevel: 3, multiplier: 8, name: 'Swift Sneak' },
  { categories: ['boots'], id: 'feather_falling', maxLevel: 4, multiplier: 2, name: 'Feather Falling' },
  {
    categories: ['boots'],
    id: 'depth_strider',
    incompatibleWith: ['frost_walker'],
    maxLevel: 3,
    multiplier: 4,
    name: 'Depth Strider',
  },
  {
    categories: ['boots'],
    id: 'frost_walker',
    incompatibleWith: ['depth_strider'],
    maxLevel: 2,
    multiplier: 4,
    name: 'Frost Walker',
  },
  { categories: ['boots'], id: 'soul_speed', maxLevel: 3, multiplier: 8, name: 'Soul Speed' },

  { categories: [...allTools, 'shears'], id: 'efficiency', maxLevel: 5, multiplier: 1, name: 'Efficiency' },
  {
    categories: allTools,
    id: 'fortune',
    incompatibleWith: ['silk_touch'],
    maxLevel: 3,
    multiplier: 4,
    name: 'Fortune',
  },
  {
    categories: allTools,
    id: 'silk_touch',
    incompatibleWith: ['fortune'],
    maxLevel: 1,
    multiplier: 8,
    name: 'Silk Touch',
  },

  {
    categories: ['sword', 'axe'],
    id: 'sharpness',
    incompatibleWith: ['smite', 'bane_arthropods'],
    maxLevel: 5,
    multiplier: 1,
    name: 'Sharpness',
  },
  {
    categories: ['sword', 'axe'],
    id: 'smite',
    incompatibleWith: ['sharpness', 'bane_arthropods'],
    maxLevel: 5,
    multiplier: 2,
    name: 'Smite',
  },
  {
    categories: ['sword', 'axe'],
    id: 'bane_arthropods',
    incompatibleWith: ['sharpness', 'smite'],
    maxLevel: 5,
    multiplier: 2,
    name: 'Bane of Arthropods',
  },
  { categories: ['sword'], id: 'knockback', maxLevel: 2, multiplier: 2, name: 'Knockback' },
  { categories: ['sword'], id: 'fire_aspect', maxLevel: 2, multiplier: 4, name: 'Fire Aspect' },
  { categories: ['sword'], id: 'looting', maxLevel: 3, multiplier: 4, name: 'Looting' },
  { categories: ['sword'], id: 'sweeping_edge', maxLevel: 3, multiplier: 4, name: 'Sweeping Edge' },

  {
    categories: ['mace'],
    id: 'density',
    incompatibleWith: ['breach'],
    maxLevel: 5,
    multiplier: 1,
    name: 'Density',
  },
  {
    categories: ['mace'],
    id: 'breach',
    incompatibleWith: ['density'],
    maxLevel: 4,
    multiplier: 4,
    name: 'Breach',
  },
  { categories: ['mace'], id: 'wind_burst', maxLevel: 3, multiplier: 4, name: 'Wind Burst' },

  { categories: ['bow'], id: 'power', maxLevel: 5, multiplier: 1, name: 'Power' },
  { categories: ['bow'], id: 'punch', maxLevel: 2, multiplier: 4, name: 'Punch' },
  { categories: ['bow'], id: 'flame', maxLevel: 1, multiplier: 4, name: 'Flame' },
  {
    categories: ['bow'],
    id: 'infinity',
    incompatibleWith: ['mending'],
    maxLevel: 1,
    multiplier: 8,
    name: 'Infinity',
  },

  {
    categories: ['crossbow'],
    id: 'multishot',
    incompatibleWith: ['piercing'],
    maxLevel: 1,
    multiplier: 4,
    name: 'Multishot',
  },
  {
    categories: ['crossbow'],
    id: 'piercing',
    incompatibleWith: ['multishot'],
    maxLevel: 4,
    multiplier: 1,
    name: 'Piercing',
  },
  { categories: ['crossbow'], id: 'quick_charge', maxLevel: 3, multiplier: 2, name: 'Quick Charge' },

  { categories: ['trident'], id: 'impaling', maxLevel: 5, multiplier: 4, name: 'Impaling' },
  {
    categories: ['trident'],
    id: 'loyalty',
    incompatibleWith: ['riptide'],
    maxLevel: 3,
    multiplier: 1,
    name: 'Loyalty',
  },
  {
    categories: ['trident'],
    id: 'riptide',
    incompatibleWith: ['loyalty', 'channeling'],
    maxLevel: 3,
    multiplier: 4,
    name: 'Riptide',
  },
  {
    categories: ['trident'],
    id: 'channeling',
    incompatibleWith: ['riptide'],
    maxLevel: 1,
    multiplier: 8,
    name: 'Channeling',
  },

  { categories: ['fishing_rod'], id: 'lure', maxLevel: 3, multiplier: 4, name: 'Lure' },
  { categories: ['fishing_rod'], id: 'luck_of_the_sea', maxLevel: 3, multiplier: 4, name: 'Luck of the Sea' },
];

export const recommendedPreset: Record<ItemCategory, string[]> = {
  axe: ['efficiency', 'unbreaking', 'mending', 'sharpness'],
  boots: ['protection', 'unbreaking', 'mending', 'feather_falling', 'depth_strider', 'soul_speed'],
  bow: ['power', 'flame', 'punch', 'unbreaking', 'mending'],
  brush: ['unbreaking', 'mending'],
  chestplate: ['protection', 'thorns', 'unbreaking', 'mending'],
  crossbow: ['quick_charge', 'multishot', 'unbreaking', 'mending'],
  elytra: ['unbreaking', 'mending'],
  fishing_rod: ['lure', 'luck_of_the_sea', 'unbreaking', 'mending'],
  helmet: ['protection', 'respiration', 'aqua_affinity', 'unbreaking', 'mending'],
  hoe: ['efficiency', 'fortune', 'unbreaking', 'mending'],
  leggings: ['protection', 'swift_sneak', 'unbreaking', 'mending'],
  mace: ['density', 'wind_burst', 'unbreaking', 'mending'],
  pickaxe: ['efficiency', 'fortune', 'unbreaking', 'mending'],
  shears: ['efficiency', 'unbreaking', 'mending'],
  shield: ['unbreaking', 'mending'],
  shovel: ['efficiency', 'silk_touch', 'unbreaking', 'mending'],
  sword: ['sharpness', 'looting', 'fire_aspect', 'sweeping_edge', 'unbreaking', 'mending'],
  trident: ['impaling', 'loyalty', 'channeling', 'unbreaking', 'mending'],
  turtle_shell: ['protection', 'respiration', 'aqua_affinity', 'unbreaking', 'mending'],
};

export function getEnchantmentsForItem(category: ItemCategory) {
  return enchantments.filter((enchant) => enchant.categories.includes(category));
}
