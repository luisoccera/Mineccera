export interface CodexEntry {
  foundIn: string;
  id: string;
  name: string;
  notes: string;
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy raro';
}

export const biomeCodex: CodexEntry[] = [
  {
    foundIn: 'Overworld',
    id: 'plains',
    name: 'Llanuras',
    notes: 'Ideal para base inicial, aldeas y ganado.',
    rarity: 'Común',
  },
  {
    foundIn: 'Overworld',
    id: 'forest',
    name: 'Bosque',
    notes: 'Madera abundante y fauna temprana.',
    rarity: 'Común',
  },
  {
    foundIn: 'Overworld',
    id: 'badlands',
    name: 'Badlands',
    notes: 'Terracota y oro abundante.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Overworld',
    id: 'mangrove-swamp',
    name: 'Pantano de manglar',
    notes: 'Fango, ranas y mangle.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Overworld',
    id: 'cherry-grove',
    name: 'Cherry Grove',
    notes: 'Bioma de cerezos en montanas.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Overworld',
    id: 'deep-dark',
    name: 'Deep Dark',
    notes: 'Skulk, sensores y Ancient City.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Overworld',
    id: 'mushroom-fields',
    name: 'Campos de hongos',
    notes: 'Sin mobs hostiles naturales de noche.',
    rarity: 'Muy raro',
  },
  {
    foundIn: 'End',
    id: 'end-highlands',
    name: 'End Highlands',
    notes: 'Ciudades del End y Elytra.',
    rarity: 'Raro',
  },
];

export const creatureCodex: CodexEntry[] = [
  {
    foundIn: 'Bosques/Taiga/Nieve',
    id: 'wolf-variants',
    name: 'Lobo (9 variantes)',
    notes: 'Variantes por bioma: boscoso, nevado, ashen, etc.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Aldeas',
    id: 'villager-cleric',
    name: 'Aldeano clerigo (monje)',
    notes: 'Comercio de redstone, lapis y botellas.',
    rarity: 'Común',
  },
  {
    foundIn: 'Aldeas (domesticado)',
    id: 'cat-variants',
    name: 'Gato (11 skins)',
    notes: 'Cada aldea puede dar variantes distintas.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Cuevas/Nocturno',
    id: 'zombie',
    name: 'Zombie',
    notes: 'Hostil base; puede soltar hierro y zanahoria/papa.',
    rarity: 'Común',
  },
  {
    foundIn: 'Desierto',
    id: 'husk',
    name: 'Husk',
    notes: 'Variante del zombie sin quemarse al sol.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Oceanos y rios',
    id: 'drowned',
    name: 'Drowned',
    notes: 'Puede soltar tridente o concha de nautilo.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Overworld de noche',
    id: 'enderman',
    name: 'Enderman',
    notes: 'Perlas de End para progreso a Stronghold.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Lush caves',
    id: 'axolotl-blue',
    name: 'Ajolote azul',
    notes: 'Variante extremadamente rara por crianza.',
    rarity: 'Muy raro',
  },
];

export const floraCodex: CodexEntry[] = [
  {
    foundIn: 'Llanuras/Bosques',
    id: 'oak-tree',
    name: 'Roble',
    notes: 'Madera base mas util para early game.',
    rarity: 'Común',
  },
  {
    foundIn: 'Llanuras',
    id: 'wheat',
    name: 'Trigo',
    notes: 'Comida y crianza de animales.',
    rarity: 'Común',
  },
  {
    foundIn: 'Pantanos',
    id: 'sugar-cane',
    name: 'Cana de azucar',
    notes: 'Papel para cohetes y mapas.',
    rarity: 'Común',
  },
  {
    foundIn: 'Jungla / Bamboo Jungle',
    id: 'bamboo',
    name: 'Bambu',
    notes: 'Combustible, scaffolding y madera de bambu.',
    rarity: 'Poco común',
  },
  {
    foundIn: 'Lush caves',
    id: 'spore-blossom',
    name: 'Spore Blossom',
    notes: 'Decoracion ambiental de cuevas frondosas.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Sniffer (huevo + excavacion)',
    id: 'torchflower',
    name: 'Torchflower',
    notes: 'Planta antigua exclusiva del Sniffer.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Sniffer (huevo + excavacion)',
    id: 'pitcher-plant',
    name: 'Pitcher Plant',
    notes: 'Otra planta antigua del Sniffer.',
    rarity: 'Raro',
  },
  {
    foundIn: 'Campos de hongos',
    id: 'giant-mushroom',
    name: 'Hongo gigante',
    notes: 'Granjas de comida/combustible en bioma raro.',
    rarity: 'Muy raro',
  },
];
