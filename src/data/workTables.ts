export interface WorkTableRecipe {
  id: string;
  ingredients: string[];
  name: string;
  notes?: string;
  pattern: [string, string, string, string, string, string, string, string, string];
  purpose: string;
}

export const workTableRecipes: WorkTableRecipe[] = [
  {
    id: 'crafting_table',
    ingredients: ['4 tablones (cualquier madera)'],
    name: 'Mesa de trabajo',
    notes: 'Coloca los tablones en bloque 2x2.',
    pattern: ['Tablón', 'Tablón', '', 'Tablón', 'Tablón', '', '', '', ''],
    purpose: 'Bloque base para craftear en 3x3.',
  },
  {
    id: 'fletching_table',
    ingredients: ['2 pedernales', '4 tablones (cualquier madera)'],
    name: 'Mesa de flechas',
    pattern: ['Pedernal', 'Pedernal', '', 'Tablón', 'Tablón', '', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano flechero.',
  },
  {
    id: 'cartography_table',
    ingredients: ['2 papeles', '4 tablones (cualquier madera)'],
    name: 'Mesa de cartografía',
    pattern: ['Papel', 'Papel', '', 'Tablón', 'Tablón', '', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano cartógrafo.',
  },
  {
    id: 'smithing_table',
    ingredients: ['2 lingotes de hierro', '4 tablones (cualquier madera)'],
    name: 'Mesa de herrería',
    pattern: ['Hierro', 'Hierro', '', 'Tablón', 'Tablón', '', '', '', ''],
    purpose: 'Bloque de trabajo de herrero de herramientas y mejoras.',
  },
  {
    id: 'loom',
    ingredients: ['2 hilos', '2 tablones (cualquier madera)'],
    name: 'Telar',
    pattern: ['Hilo', 'Hilo', '', 'Tablón', 'Tablón', '', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano pastor.',
  },
  {
    id: 'grindstone',
    ingredients: ['2 palos', '1 losa de piedra', '2 tablones (cualquier madera)'],
    name: 'Afiladora',
    pattern: ['Palo', 'Losa piedra', 'Palo', 'Tablón', '', 'Tablón', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano armero de armas.',
  },
  {
    id: 'stonecutter',
    ingredients: ['3 piedras', '1 lingote de hierro'],
    name: 'Cortapiedras',
    pattern: ['Piedra', 'Piedra', 'Piedra', '', 'Hierro', '', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano cantero.',
  },
  {
    id: 'lectern',
    ingredients: ['1 librero', '4 losas de madera'],
    name: 'Atril',
    pattern: ['Losa', 'Losa', 'Losa', '', 'Librero', '', '', 'Losa', ''],
    purpose: 'Bloque de trabajo del aldeano bibliotecario.',
  },
  {
    id: 'composter',
    ingredients: ['7 losas de madera'],
    name: 'Compostador',
    pattern: ['Losa', '', 'Losa', 'Losa', '', 'Losa', 'Losa', 'Losa', 'Losa'],
    purpose: 'Bloque de trabajo del aldeano granjero.',
  },
  {
    id: 'barrel',
    ingredients: ['6 tablones', '2 losas de madera'],
    name: 'Barril',
    pattern: ['Tablón', 'Losa', 'Tablón', 'Tablón', '', 'Tablón', 'Tablón', 'Losa', 'Tablón'],
    purpose: 'Bloque de trabajo del aldeano pescador.',
  },
  {
    id: 'cauldron',
    ingredients: ['7 lingotes de hierro'],
    name: 'Caldero',
    pattern: ['Hierro', '', 'Hierro', 'Hierro', '', 'Hierro', 'Hierro', 'Hierro', 'Hierro'],
    purpose: 'Bloque de trabajo del aldeano curtidor.',
  },
  {
    id: 'blast_furnace',
    ingredients: ['1 horno', '5 lingotes de hierro', '3 piedras lisas'],
    name: 'Alto horno',
    pattern: ['Hierro', 'Hierro', 'Hierro', 'Hierro', 'Horno', 'Hierro', 'Piedra lisa', 'Piedra lisa', 'Piedra lisa'],
    purpose: 'Bloque de trabajo del aldeano herrero.',
  },
  {
    id: 'smoker',
    ingredients: ['1 horno', '4 troncos o madera'],
    name: 'Ahumador',
    pattern: ['', 'Tronco', '', 'Tronco', 'Horno', 'Tronco', '', 'Tronco', ''],
    purpose: 'Bloque de trabajo del aldeano carnicero.',
  },
  {
    id: 'brewing_stand',
    ingredients: ['1 vara de blaze', '3 roca o piedra negra'],
    name: 'Soporte para pociones',
    pattern: ['', 'Vara blaze', '', 'Roca', 'Roca', 'Roca', '', '', ''],
    purpose: 'Bloque de trabajo del aldeano clérigo.',
  },
];
