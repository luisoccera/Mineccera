export type ItemCategory =
  | 'axe'
  | 'boots'
  | 'bow'
  | 'brush'
  | 'carrot_on_a_stick'
  | 'chestplate'
  | 'crossbow'
  | 'elytra'
  | 'fishing_rod'
  | 'flint_and_steel'
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
  | 'turtle_shell'
  | 'warped_fungus_on_a_stick';

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
  'flint_and_steel',
  'carrot_on_a_stick',
  'warped_fungus_on_a_stick',
];

export const itemLabels: Record<ItemCategory, string> = {
  axe: 'Hacha',
  boots: 'Botas',
  bow: 'Arco',
  brush: 'Pincel',
  carrot_on_a_stick: 'Cana+Zanahoria',
  chestplate: 'Pechera',
  crossbow: 'Ballesta',
  elytra: 'Elytra',
  fishing_rod: 'Cana',
  flint_and_steel: 'Pedernal',
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
  warped_fungus_on_a_stick: 'Cana+Hongo',
};

const toProxyIcon = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//i, ''))}&w=96&h=96&fit=inside`;

export const itemIconByCategory: Record<ItemCategory, string> = {
  axe: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_axe.png'),
  boots: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_boots.png'),
  bow: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/bow.png'),
  brush: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/brush.png'),
  carrot_on_a_stick: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/carrot_on_a_stick.png'),
  chestplate: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_chestplate.png'),
  crossbow: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/crossbow_standby.png'),
  elytra: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/elytra.png'),
  fishing_rod: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/fishing_rod.png'),
  flint_and_steel: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/flint_and_steel.png'),
  helmet: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_helmet.png'),
  hoe: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_hoe.png'),
  leggings: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_leggings.png'),
  mace: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/mace.png'),
  pickaxe: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_pickaxe.png'),
  shears: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/shears.png'),
  shield: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/shield.png'),
  shovel: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_shovel.png'),
  sword: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/diamond_sword.png'),
  trident: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/trident.png'),
  turtle_shell: toProxyIcon('https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/turtle_helmet.png'),
  warped_fungus_on_a_stick: toProxyIcon(
    'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/warped_fungus_on_a_stick.png',
  ),
};

export const enchantmentNotesById: Record<string, string> = {
  aqua_affinity: 'Aumenta velocidad de minado bajo agua.',
  bane_arthropods: 'Mas daño contra arañas, silverfish y endermites.',
  blast_protection: 'Reduce daño por explosiones.',
  breach: 'Reduce armadura del objetivo al golpear con maza.',
  channeling: 'Invoca rayos durante tormenta con tridente.',
  curse_binding: 'El objeto no se puede quitar facilmente.',
  curse_vanishing: 'El item desaparece al morir.',
  density: 'Aumenta daño por impacto vertical de la maza.',
  depth_strider: 'Te mueves mas rapido en agua.',
  efficiency: 'Acelera minado o uso de herramienta.',
  feather_falling: 'Reduce daño por caida.',
  fire_aspect: 'Prende fuego al objetivo al golpear.',
  fire_protection: 'Reduce daño por fuego/lava.',
  flame: 'Flechas de arco incendiarias.',
  fortune: 'Mas drops en minerales/cosechas compatibles.',
  frost_walker: 'Congela agua al caminar.',
  impaling: 'Mas daño con tridente en objetivos acuaticos.',
  infinity: 'Disparo infinito con una flecha en inventario.',
  knockback: 'Empuja al objetivo al golpear.',
  looting: 'Incrementa drops de mobs.',
  loyalty: 'El tridente regresa al lanzarlo.',
  luck_of_the_sea: 'Mejora loot de pesca.',
  lure: 'Pesca mas rapido.',
  mending: 'Repara item usando experiencia.',
  multishot: 'Dispara 3 proyectiles en ballesta.',
  piercing: 'La flecha atraviesa entidades.',
  power: 'Mas daño de arco.',
  projectile_protection: 'Reduce daño de proyectiles.',
  protection: 'Proteccion general contra daño.',
  punch: 'Mayor empuje en flechas de arco.',
  quick_charge: 'Recarga mas rapida de ballesta.',
  respiration: 'Mas tiempo de respiracion bajo agua.',
  riptide: 'Te impulsa con tridente bajo lluvia/agua.',
  sharpness: 'Aumenta daño cuerpo a cuerpo.',
  silk_touch: 'Minado con bloque original.',
  smite: 'Mas daño contra no-muertos.',
  soul_speed: 'Mas velocidad en arena/alma soul soil.',
  swift_sneak: 'Aumenta velocidad agachado.',
  sweeping_edge: 'Mejora daño en barrido de espada.',
  thorns: 'Devuelve daño al atacante.',
  unbreaking: 'Reduce desgaste del objeto.',
  wind_burst: 'Impulso de viento al golpear con maza.',
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
  flint_and_steel: ['unbreaking', 'mending'],
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
  carrot_on_a_stick: ['unbreaking', 'mending'],
  warped_fungus_on_a_stick: ['unbreaking', 'mending'],
};

export const enchantmentNameById = enchantments.reduce<Record<string, string>>((acc, enchant) => {
  acc[enchant.id] = enchant.name;
  return acc;
}, {});

export const enchantmentWikiUrlById = enchantments.reduce<Record<string, string>>((acc, enchant) => {
  acc[enchant.id] = `https://minecraft.wiki/w/${encodeURIComponent(enchant.name.replace(/\s+/g, '_'))}`;
  return acc;
}, {});

export function getEnchantmentsForItem(category: ItemCategory) {
  return enchantments.filter((enchant) => enchant.categories.includes(category));
}
