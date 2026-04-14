export interface FarmGuideReference {
  label: string;
  url: string;
}

export interface FarmGuide {
  backupImageUrl?: string;
  biomes: string[];
  difficulty: 'Alta' | 'Baja' | 'Media';
  id: string;
  imageUrl: string;
  keyMaterials: string[];
  name: string;
  notes: string[];
  output: string;
  steps: string[];
  tags: string[];
  versions: 'Bedrock' | 'Java' | 'Java y Bedrock';
  wikiSource: FarmGuideReference;
  extraSources: FarmGuideReference[];
}

export const farmGuides: FarmGuide[] = [
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/iron_ingot.png',
    biomes: ['Cualquier bioma seguro (sobre suelo firme)'],
    difficulty: 'Media',
    extraSources: [
      { label: 'Minecraft Wiki: Iron Golem', url: 'https://minecraft.wiki/w/Iron_Golem' },
      { label: 'Pro Game Guides (layout)', url: 'https://progameguides.com/minecraft/how-to-make-an-iron-farm-in-minecraft/' },
    ],
    id: 'iron-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/439/19326770-image_l.jpg',
    keyMaterials: ['3 aldeanos', '3 camas', '1 zombie (Java)', 'Tolvas + cofres', 'Bloques de construccion'],
    name: 'Granja de hierro',
    notes: [
      'En Bedrock la deteccion de aldeanos/camas cambia, usa diseno especifico Bedrock.',
      'Ilumina y aísla bien para evitar spawns fuera de camara de granja.',
    ],
    output: 'Lingotes de hierro + amapolas de forma continua.',
    steps: [
      'Construye una plataforma elevada y encierra a 3 aldeanos vinculados a sus camas.',
      'Asegura linea de vision al zombie (Java) o usa diseno Bedrock con aldeanos/camas optimizados.',
      'Canaliza el spawn del golem hacia lava/caida y colecta con tolvas.',
      'Conecta cofres y verifica ciclos de spawn constantes.',
    ],
    tags: ['hierro', 'golem', 'automatizada', 'early', 'midgame'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Iron golem farming', url: 'https://minecraft.wiki/w/Tutorial%3AIron_golem_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/gunpowder.png',
    biomes: ['Sobre oceano o alto en cielo para mejorar tasas'],
    difficulty: 'Alta',
    extraSources: [
      { label: 'Minecraft Wiki: Creeper', url: 'https://minecraft.wiki/w/Creeper' },
      { label: 'Beebom: farms recomendadas', url: 'https://beebom.com/best-minecraft-farms/' },
    ],
    id: 'creeper-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/942/18788770_l.jpg',
    keyMaterials: ['Trapdoors', 'Gatos', 'Alfombras/botones para filtrar mobs', 'Tolvas + cofres'],
    name: 'Granja de creepers',
    notes: [
      'La altura de construccion y el spawnproofing externo afecta mucho el rendimiento.',
      'Ideal para polvora de cohetes si juegas con Elytra.',
    ],
    output: 'Polvora masiva para cohetes y TNT.',
    steps: [
      'Crea plataformas oscuras con altura interna que descarte otros mobs.',
      'Coloca gatos para empujar creepers hacia canal de caida.',
      'Usa agua/tolvas en zona de muerte para recoger drops.',
      'Haz spawnproof en entorno cercano para subir eficiencia.',
    ],
    tags: ['polvora', 'cohetes', 'elytra', 'pvp'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Creeper farming', url: 'https://minecraft.wiki/w/Tutorial%3ACreeper_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/emerald.png',
    biomes: ['Aldea + zona de tierra cultivable'],
    difficulty: 'Media',
    extraSources: [
      { label: 'Minecraft Wiki: Villager', url: 'https://minecraft.wiki/w/Villager' },
      { label: 'Minecraft Wiki: Trading', url: 'https://minecraft.wiki/w/Trading' },
    ],
    id: 'villager-crop-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2020/837/12651006-front_l.jpg',
    keyMaterials: ['Aldeanos granjeros', 'Compostador', 'Camas', 'Tolvas y cofres', 'Agua y cultivos'],
    name: 'Granja de cultivos con aldeanos',
    notes: [
      'Excelente para trigo/zanahoria/papa automáticos y comercio de esmeraldas.',
      'Necesita proteccion contra zombis/raids para operación estable.',
    ],
    output: 'Comida automatizada + base para trading hall.',
    steps: [
      'Delimita parcela y humedece tierra con agua central.',
      'Asigna al aldeano granjero con compostador.',
      'Canaliza cosecha con vagoneta con tolva o aldeano recolector.',
      'Conecta almacenamiento y ordena por item.',
    ],
    tags: ['aldeanos', 'comida', 'esmeraldas', 'automatizada'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Crop farming', url: 'https://minecraft.wiki/w/Tutorial%3ACrop_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/sugar_cane.png',
    biomes: ['Cerca de agua en Overworld'],
    difficulty: 'Baja',
    extraSources: [
      { label: 'Beebom: sugar cane farm', url: 'https://beebom.com/how-make-sugar-cane-farm-minecraft/' },
      { label: 'Sportskeeda 1.21', url: 'https://www.sportskeeda.com/minecraft/how-make-minecraft-1-21-sugarcane-farm' },
    ],
    id: 'sugar-cane-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2024/038/17545524-image_l.jpg',
    keyMaterials: ['Observers', 'Pistones', 'Redstone', 'Arena/tierra', 'Tolvas + cofres'],
    name: 'Granja de cana de azucar',
    notes: [
      'Clave para papel (cohetes/mapas/libros).',
      'Escala horizontal modular para throughput alto.',
    ],
    output: 'Papel y azucar de forma continua.',
    steps: [
      'Siembra cana junto a fila de agua.',
      'Pon observers detectando crecimiento y pistones para corte.',
      'Conecta drops a corriente de agua y tolvas.',
      'Extiende modulos en paralelo para mejorar produccion.',
    ],
    tags: ['papel', 'cohetes', 'libros', 'redstone'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Sugar cane farming', url: 'https://minecraft.wiki/w/Tutorial%3ASugar_Cane_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/ender_pearl.png',
    biomes: ['Nether roofs/plataformas seguras'],
    difficulty: 'Alta',
    extraSources: [
      { label: 'Minecraft Wiki: Enderman', url: 'https://minecraft.wiki/w/Enderman' },
      { label: 'Comunidad technicalminecraft', url: 'https://www.reddit.com/r/technicalminecraft/' },
    ],
    id: 'enderman-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2024/383/17827595-image_l.jpg',
    keyMaterials: ['Hojas o bloques anti-spawn', 'Nombre tag para endermite (Java)', 'Tolvas/cofres'],
    name: 'Granja de enderman',
    notes: [
      'Ideal para XP rapido y perlas de End.',
      'Generalmente se construye en End por eficiencia maxima.',
    ],
    output: 'XP alto + perlas de End.',
    steps: [
      'Construye plataforma de spawn lejos de isla principal.',
      'Usa mecanismo de atraccion (endermite en Java).',
      'Canaliza mobs a zona de un-golpe y recoleccion.',
      'Asegura techo/contorno para no perder entidades.',
    ],
    tags: ['xp', 'end', 'perlas', 'midgame', 'endgame'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Enderman farming', url: 'https://minecraft.wiki/w/Tutorial%3AEnderman_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/blaze_rod.png',
    biomes: ['Nether Fortress'],
    difficulty: 'Media',
    extraSources: [
      { label: 'Minecraft Wiki: Blaze', url: 'https://minecraft.wiki/w/Blaze' },
      { label: 'Minecraft Wiki: Brewing stand', url: 'https://minecraft.wiki/w/Brewing_Stand' },
    ],
    id: 'blaze-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2022/622/16588289-image_l.jpg',
    keyMaterials: ['Spawner de blaze', 'Losas/trampillas', 'Pocion resistencia al fuego', 'Tolvas/cofres'],
    name: 'Granja de blaze',
    notes: [
      'Fundamental para varas de blaze y polvos de pociones.',
      'Hazla con proteccion de fuego para trabajar seguro.',
    ],
    output: 'Varas de blaze + XP.',
    steps: [
      'Limpia area del spawner y spawnproof alrededor.',
      'Canaliza blazes con agua (Bedrock) o embudo de IA (Java).',
      'Define camara de golpe y recoleccion automatica.',
      'Monta almacenamiento y seguridad de acceso.',
    ],
    tags: ['nether', 'pociones', 'xp', 'blaze'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Blaze farming', url: 'https://minecraft.wiki/w/Tutorial%3ABlaze_farming' },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/gold_ingot.png',
    biomes: ['Nether (bioma amplio para portales)'],
    difficulty: 'Alta',
    extraSources: [
      { label: 'Minecraft Wiki: Zombified piglin', url: 'https://minecraft.wiki/w/Zombified_Piglin' },
      { label: 'Pro Game Guides: gold farm', url: 'https://progameguides.com/minecraft/how-to-build-a-gold-farm-in-minecraft/' },
    ],
    id: 'gold-farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2022/420/15746948_l.jpg',
    keyMaterials: ['Portales', 'Huevo de tortuga/señuelo', 'Tolvas + cofres', 'Mecanica de kill chamber'],
    name: 'Granja de oro',
    notes: [
      'Excelente para lingotes + XP + trueque piglin.',
      'En Bedrock/Java hay variantes de ticking y pathfinding.',
    ],
    output: 'Oro masivo, pepitas y experiencia.',
    steps: [
      'Construye plataforma de portales y area de atraccion.',
      'Canaliza piglins zombificados a camara de daño.',
      'Automatiza recoleccion y clasifica drops.',
      'Conecta oro a sistema de trading con piglins si lo deseas.',
    ],
    tags: ['oro', 'xp', 'piglin', 'nether'],
    versions: 'Java y Bedrock',
    wikiSource: {
      label: 'Minecraft Wiki: Zombified piglin farming',
      url: 'https://minecraft.wiki/w/Tutorial%3AZombified_piglin_farming',
    },
  },
  {
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/experience_bottle.png',
    biomes: ['Sky / ocean / cualquier zona spawnproof'],
    difficulty: 'Media',
    extraSources: [
      { label: 'Minecraft Wiki: Mob', url: 'https://minecraft.wiki/w/Mob' },
      { label: 'TheSpike: mob farm guide', url: 'https://www.thespike.gg/minecraft/all-mobs-guide/mob-farm-guide' },
    ],
    id: 'mob-farm-general',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/560/19097777_l.jpg',
    keyMaterials: ['Plataformas oscuras', 'Trapdoors', 'Canales de agua', 'Tolvas + cofres'],
    name: 'Granja general de mobs',
    notes: [
      'Da huesos, redstone, cuerda y algo de XP.',
      'Muy util como primera granja automatica multiuso.',
    ],
    output: 'Drops variados de mobs hostiles.',
    steps: [
      'Crea torre de plataformas oscuras con alturas validas de spawn.',
      'Empuja mobs a canal de caida/muerte.',
      'Recolecta drops con tolvas y cofres.',
      'Mejora rendimiento con spawnproof del area externa.',
    ],
    tags: ['xp', 'huesos', 'redstone', 'general'],
    versions: 'Java y Bedrock',
    wikiSource: { label: 'Minecraft Wiki: Mob farm', url: 'https://minecraft.wiki/w/Tutorial%3AMob_farm' },
  },
];
