export interface CodexEntry {
  foundIn: string;
  id: string;
  name: string;
  notes: string;
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy raro';
}

export interface MonsterStatEntry extends CodexEntry {
  attack: string;
  backupImageUrl?: string;
  drops: string;
  health: string;
  imageUrl: string;
  spawn: string;
  xp: string;
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

const toProxyIcon = (url: string) =>
  `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//i, ''))}&w=128&h=128&fit=inside`;

const toMonsterItemTexture = (fileName: string) =>
  `https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/${fileName}`;

const toMonsterProxyTexture = (fileName: string) => toProxyIcon(toMonsterItemTexture(fileName));

export const monsterCodex: MonsterStatEntry[] = [
  {
    attack: 'Golpe melee: 2.5 / 3 / 4.5 HP (facil/normal/dificil).',
    drops: 'Carne podrida 0-2; raro: hierro, zanahoria o papa.',
    foundIn: 'Overworld noche, cuevas, spawners',
    health: '20 HP (10 corazones).',
    id: 'zombie',
    imageUrl: toMonsterItemTexture('zombie_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('zombie_spawn_egg.png'),
    name: 'Zombie',
    notes: 'Undead base para farm XP y drops tempranos.',
    rarity: 'Común',
    spawn: 'Luz 0. Puede aparecer en hordas.',
    xp: '5 XP (adulto) / 12 XP (baby).',
  },
  {
    attack: 'Arco a distancia: dano variable por carga/dificultad.',
    drops: 'Huesos 0-2, flechas 0-2; raro: arco.',
    foundIn: 'Overworld noche, cuevas, spawners',
    health: '20 HP (10 corazones).',
    id: 'skeleton',
    imageUrl: toMonsterItemTexture('skeleton_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('skeleton_spawn_egg.png'),
    name: 'Esqueleto',
    notes: 'Muy peligroso a distancia; clave para granja de flechas y hueso.',
    rarity: 'Común',
    spawn: 'Luz 0. Quema al sol si no esta protegido.',
    xp: '5 XP.',
  },
  {
    attack: 'Explosion de alto dano en corto alcance.',
    drops: 'Polvora 0-2; disco (si lo mata esqueleto), cabeza (charged creeper).',
    foundIn: 'Overworld noche, cuevas',
    health: '20 HP (10 corazones).',
    id: 'creeper',
    imageUrl: toMonsterItemTexture('creeper_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('creeper_spawn_egg.png'),
    name: 'Creeper',
    notes: 'Amenaza principal para construcciones por dano de explosion.',
    rarity: 'Común',
    spawn: 'Luz 0. Se activa al acercarte.',
    xp: '5 XP.',
  },
  {
    attack: 'Melee: 2 / 2 / 3 HP (facil/normal/dificil).',
    drops: 'Hilo 0-2, ojo de arana 0-1.',
    foundIn: 'Overworld noche, cuevas',
    health: '16 HP (8 corazones).',
    id: 'spider',
    imageUrl: toMonsterItemTexture('spider_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('spider_spawn_egg.png'),
    name: 'Araña',
    notes: 'Escala muros; neutral de dia, hostil de noche.',
    rarity: 'Común',
    spawn: 'Luz 0 y spawners de mina abandonada.',
    xp: '5 XP.',
  },
  {
    attack: 'Melee: 4 / 7 / 10 HP (facil/normal/dificil).',
    drops: 'Perla de Ender 0-1.',
    foundIn: 'Overworld noche, End',
    health: '40 HP (20 corazones).',
    id: 'enderman',
    imageUrl: toMonsterItemTexture('enderman_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('enderman_spawn_egg.png'),
    name: 'Enderman',
    notes: 'Clave para progreso al Stronghold y al End.',
    rarity: 'Raro',
    spawn: 'Luz 0 en Overworld. Muy comun en End.',
    xp: '5 XP.',
  },
  {
    attack: 'Pociones de dano/veneno/debilidad a distancia.',
    drops: 'Polvora, redstone, botellas, glowstone, palo, azucar.',
    foundIn: 'Pantanos, cabañas, raids',
    health: '26 HP (13 corazones).',
    id: 'witch',
    imageUrl: toMonsterItemTexture('witch_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('witch_spawn_egg.png'),
    name: 'Bruja',
    notes: 'Objetivo excelente para granjas de redstone y objetos de alquimia.',
    rarity: 'Poco común',
    spawn: 'Luz 0 (hostil) y cabaña de bruja.',
    xp: '5 XP.',
  },
  {
    attack: 'Golpe melee + efecto hambre.',
    drops: 'Carne podrida 0-2.',
    foundIn: 'Desiertos',
    health: '20 HP (10 corazones).',
    id: 'husk',
    imageUrl: toMonsterItemTexture('husk_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('husk_spawn_egg.png'),
    name: 'Husk',
    notes: 'Variante de zombie que no se quema con el sol.',
    rarity: 'Poco común',
    spawn: 'Desierto con luz 0.',
    xp: '5 XP.',
  },
  {
    attack: 'Melee y a veces tridente a distancia.',
    drops: 'Carne podrida, cobre; raro: tridente y concha nautilo.',
    foundIn: 'Oceanos y rios',
    health: '20 HP (10 corazones).',
    id: 'drowned',
    imageUrl: toMonsterItemTexture('drowned_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('drowned_spawn_egg.png'),
    name: 'Ahogado (Drowned)',
    notes: 'Importante para tridente y nautilo.',
    rarity: 'Poco común',
    spawn: 'Zonas acuaticas oscuras y conversion de zombie bajo agua.',
    xp: '5 XP.',
  },
  {
    attack: 'Ataque en picada: 3 / 4 / 6 HP (facil/normal/dificil).',
    drops: 'Membrana fantasma 0-1.',
    foundIn: 'Cielo nocturno',
    health: '20 HP (10 corazones).',
    id: 'phantom',
    imageUrl: toMonsterItemTexture('phantom_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('phantom_spawn_egg.png'),
    name: 'Phantom',
    notes: 'Aparece cuando no duermes; util para reparar Elytra.',
    rarity: 'Poco común',
    spawn: 'Tras 3 noches sin dormir.',
    xp: '5 XP.',
  },
  {
    attack: 'Dano variable por tamano (grande/mediano).',
    drops: 'Bolas de slime (al morir medianos/pequenos).',
    foundIn: 'Chunks de slime, pantano',
    health: 'Tamano dependiente (1 / 4 / 16 HP).',
    id: 'slime',
    imageUrl: toMonsterItemTexture('slime_spawn_egg.png'),
    backupImageUrl: toMonsterProxyTexture('slime_spawn_egg.png'),
    name: 'Slime',
    notes: 'Basico para pegamento (pistones, redstone, granjas).',
    rarity: 'Poco común',
    spawn: 'Swamp de noche y slime chunks bajo Y 40.',
    xp: '1-4 XP segun tamano.',
  },
];
