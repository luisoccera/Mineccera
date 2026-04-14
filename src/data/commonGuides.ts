export interface CommonBuild {
  backupImageUrl?: string;
  id: string;
  imageCredit: string;
  imageUrl: string;
  materials: string[];
  name: string;
  purpose: string;
  references: GuideReference[];
}

export interface EnchantingRecipe {
  backupImageUrl?: string;
  id: string;
  imageCredit: string;
  imageUrl: string;
  recipe: string;
  references: GuideReference[];
  title: string;
  use: string;
}

export interface EssentialFarm {
  backupImageUrl?: string;
  id: string;
  imageCredit: string;
  imageUrl: string;
  keyMaterials: string[];
  name: string;
  output: string;
  references: GuideReference[];
  versions: string;
}

export interface GuideReference {
  label: string;
  url: string;
}

export const commonBuilds: CommonBuild[] = [
  {
    id: 'starter-house',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/oak_planks.png',
    imageCredit: 'PlanetMinecraft - Starter House (LeonisBuilds)',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2026/438/19522810_l.jpg',
    materials: ['Madera', 'Piedra', 'Vidrio', 'Cama', 'Cofres'],
    name: 'Casa inicial de supervivencia',
    purpose: 'Base real de early game con zona de crafteo, cama y almacenamiento.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/starter-house-6843438/' },
      { label: 'Minecraft Wiki: shelters', url: 'https://minecraft.wiki/w/Tutorials/Shelters' },
      { label: 'Beebom: ideas de casa', url: 'https://beebom.com/best-minecraft-house-ideas/' },
      { label: 'Comunidad Reddit r/Minecraftbuilds', url: 'https://www.reddit.com/r/Minecraftbuilds/' },
    ],
  },
  {
    id: 'storage-room',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/chest_front.png',
    imageCredit: 'PlanetMinecraft - Storage Room Tutorial (Gragbuilds)',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2024/612/18183737_l.jpg',
    materials: ['Cofres', 'Tolvas', 'Item frames', 'Tablones'],
    name: 'Sala de almacenamiento',
    purpose: 'Ejemplo real de sala para clasificar bloques, comida y drops.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/storage-room-tutorial-w-map/' },
      { label: 'Minecraft Wiki: Chest', url: 'https://minecraft.wiki/w/Chest' },
      { label: 'Sportskeeda: storage options', url: 'https://www.sportskeeda.com/minecraft/storage-options-minecraft-ranked-worst-best' },
      { label: 'Tutorial de almacenamiento (Minecraft Wiki)', url: 'https://minecraft.wiki/w/Tutorials/Organization' },
      { label: 'Storage Hall avanzado (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/storage-hall-6170520/' },
      { label: 'Storage House medieval (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/the-ultimate-storage-house-medieval-build/' },
      { label: 'Comunidad Reddit r/DetailCraft', url: 'https://www.reddit.com/r/DetailCraft/' },
    ],
  },
  {
    id: 'enchant-room',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/enchanting_table_side.png',
    imageCredit: 'PlanetMinecraft - Hidden Enchanting Setup',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2020/269/12707609_l.jpg',
    materials: ['Mesa de encantamientos', '15 libreros', 'Yunque'],
    name: 'Sala de encantamientos (nivel 30)',
    purpose: 'Diseño real con mesa + libreros para encantamientos de nivel alto.',
    references: [
      {
        label: 'Fuente de imagen (PlanetMinecraft)',
        url: 'https://www.planetminecraft.com/project/easy-fully-hidden-enchanting-setup-survival-friendly-redstone-enchanting-table/',
      },
      { label: 'Minecraft Wiki: enchanting mechanics', url: 'https://minecraft.wiki/w/Enchanting_mechanics' },
      { label: 'Lifewire: como armar mesa de encantamientos', url: 'https://www.lifewire.com/make-enchantment-table-in-minecraft-5220688' },
      { label: 'Ethereal library con setup 30 (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/ethereal-library/' },
    ],
  },
  {
    id: 'villager-hall',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/lectern_front.png',
    imageCredit: 'PlanetMinecraft - Villager Trading Hall',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2020/684/12752706_l.jpg',
    materials: ['Camas', 'Atriles', 'Vagonetas', 'Bloques de encierro'],
    name: 'Trading hall de aldeanos',
    purpose: 'Diseño real para aldeanos bibliotecarios y comercio estable.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/villager-trading-hall/' },
      { label: 'Minecraft Wiki: Trading', url: 'https://minecraft.wiki/w/Trading' },
      { label: 'Minecraft Wiki: Villager', url: 'https://minecraft.wiki/w/Villager' },
      { label: 'Comunidad Reddit r/technicalminecraft', url: 'https://www.reddit.com/r/technicalminecraft/' },
    ],
  },
  {
    id: 'nether-hub',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/obsidian.png',
    imageCredit: 'PlanetMinecraft - Nether Hub (nope_cat)',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2022/333/15880626_l.jpg',
    materials: ['Obsidiana', 'Hielo', 'Losas', 'Antorchas'],
    name: 'Hub del Nether',
    purpose: 'Ejemplo real de hub para conectar rutas y portales rapido.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/nether-hub-5644333/' },
      { label: 'Minecraft Wiki: Nether Portal', url: 'https://minecraft.wiki/w/Nether_portal' },
      { label: 'Minecraft Wiki: The Nether', url: 'https://minecraft.wiki/w/The_Nether' },
      { label: 'Nether hub adicional (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/nether-hub-6150826/' },
      { label: 'Ideas de comunidad en Reddit', url: 'https://www.reddit.com/r/Minecraft/' },
    ],
  },
  {
    id: 'super-smelter',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/blast_furnace_front.png',
    imageCredit: 'PlanetMinecraft - Super Smelter all Versions',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/120/19259436_l.jpg',
    materials: ['Hornos', 'Tolvas', 'Cofres', 'Combustible'],
    name: 'Super fundidora',
    purpose: 'Ejemplo real de super smelter para fundir en volumen.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/super-smelter-all-versions/' },
      { label: 'Minecraft Wiki: Furnace', url: 'https://minecraft.wiki/w/Furnace' },
      { label: 'Minecraft Wiki: Smelting', url: 'https://minecraft.wiki/w/Smelting' },
      {
        label: 'Times of India: guia super smelter',
        url: 'https://timesofindia.indiatimes.com/sports/esports/minecraft/how-to-make-an-automatic-super-smelter-in-minecraft/articleshow/121316507.cms',
      },
    ],
  },
];

export const enchantingRecipes: EnchantingRecipe[] = [
  {
    id: 'enchanting-table',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/enchanting_table_top.png',
    imageCredit: 'DigMinecraft - receta de crafteo',
    imageUrl: 'https://www.digminecraft.com/basic_recipes/images/make_enchantment_table.png',
    recipe: '4 obsidiana + 2 diamantes + 1 libro',
    references: [
      { label: 'Receta visual (DigMinecraft)', url: 'https://www.digminecraft.com/basic_recipes/make_enchantment_table.php' },
      { label: 'Lifewire: enchantment table', url: 'https://www.lifewire.com/make-enchantment-table-in-minecraft-5220688' },
      { label: 'Pro Game Guides: enchanting table', url: 'https://progameguides.com/minecraft/how-to-make-an-enchanting-table-in-minecraft/' },
      { label: 'Minecraft Wiki: Enchanting table', url: 'https://minecraft.wiki/w/Enchanting_Table' },
    ],
    title: 'Mesa de encantamientos',
    use: 'Encantar objetos con lapislazuli y niveles.',
  },
  {
    id: 'anvil',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/anvil_top.png',
    imageCredit: 'DigMinecraft - receta de crafteo',
    imageUrl: 'https://www.digminecraft.com/decoration_recipes/images/make_anvil.png',
    recipe: '3 bloques de hierro + 4 lingotes de hierro',
    references: [
      { label: 'Receta visual (DigMinecraft)', url: 'https://www.digminecraft.com/decoration_recipes/make_anvil.php' },
      { label: 'Beebom: como hacer yunque', url: 'https://beebom.com/how-make-anvil-minecraft/' },
      { label: 'GameSpot: anvil recipe', url: 'https://www.gamespot.com/articles/how-to-make-an-anvil-in-minecraft/1100-6524993/' },
      { label: 'Minecraft Wiki: Anvil', url: 'https://minecraft.wiki/w/Anvil' },
    ],
    title: 'Yunque',
    use: 'Combinar encantamientos, reparar y renombrar.',
  },
  {
    id: 'bookshelf',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/bookshelf.png',
    imageCredit: 'DigMinecraft - receta de crafteo',
    imageUrl: 'https://www.digminecraft.com/block_recipes/images/make_bookshelf.png',
    recipe: '6 tablones + 3 libros',
    references: [
      { label: 'Receta visual (DigMinecraft)', url: 'https://www.digminecraft.com/block_recipes/make_bookshelf.php' },
      { label: 'GameSpot: bookshelf recipe', url: 'https://www.gamespot.com/articles/how-to-make-a-bookshelf-in-minecraft/1100-6526073/' },
      { label: 'Pro Game Guides: bookshelf', url: 'https://progameguides.com/minecraft/how-to-make-a-bookshelf-in-minecraft/' },
      { label: 'Minecraft Wiki: Bookshelf', url: 'https://minecraft.wiki/w/Bookshelf' },
    ],
    title: 'Librero',
    use: 'Subir poder de encantamiento hasta nivel 30 (15 libreros).',
  },
  {
    id: 'grindstone',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/grindstone_side.png',
    imageCredit: 'DigMinecraft - receta de crafteo',
    imageUrl: 'https://www.digminecraft.com/basic_recipes/images/make_grindstone.png',
    recipe: '2 palos + 2 tablones + 1 losa de piedra',
    references: [
      { label: 'Receta visual (DigMinecraft)', url: 'https://www.digminecraft.com/basic_recipes/make_grindstone.php' },
      {
        label: 'Pro Game Guides: grindstone',
        url: 'https://progameguides.com/minecraft/how-to-make-and-use-a-grindstone-in-minecraft/',
      },
      { label: 'Minecraft Wiki: Grindstone', url: 'https://minecraft.wiki/w/Grindstone' },
      { label: 'Comparativa yunque vs muela', url: 'https://beebom.com/how-make-anvil-minecraft/' },
    ],
    title: 'Muela',
    use: 'Quitar encantamientos y recuperar parte de XP.',
  },
  {
    id: 'lectern',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/lectern_front.png',
    imageCredit: 'DigMinecraft - receta de crafteo',
    imageUrl: 'https://www.digminecraft.com/basic_recipes/images/make_lectern.png',
    recipe: '1 librero + 4 losas de madera',
    references: [
      { label: 'Receta visual (DigMinecraft)', url: 'https://www.digminecraft.com/basic_recipes/make_lectern.php' },
      { label: 'Beebom: como hacer atril', url: 'https://beebom.com/how-make-lectern-minecraft/' },
      { label: 'Pro Game Guides: lectern', url: 'https://progameguides.com/minecraft/how-to-make-and-use-a-lectern-in-minecraft/' },
      { label: 'Minecraft Wiki: Lectern', url: 'https://minecraft.wiki/w/Lectern' },
    ],
    title: 'Atril',
    use: 'Asignar profesion de bibliotecario a aldeanos.',
  },
];

export const essentialFarms: EssentialFarm[] = [
  {
    id: 'iron-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/iron_ingot.png',
    imageCredit: 'PlanetMinecraft - Extremely Efficient Iron Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/439/19326770-image_l.jpg',
    keyMaterials: ['3 aldeanos', '3 camas', '1 zombie', 'Tolvas + cofres'],
    name: 'Granja de hierro',
    output: 'Hierro ilimitado para herramientas y redstone.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/extremely-efficient-iron-farm/' },
      { label: 'Pro Game Guides: iron farm', url: 'https://progameguides.com/minecraft/how-to-make-an-iron-farm-in-minecraft/' },
      { label: 'Minecraft Wiki: Iron Golem', url: 'https://minecraft.wiki/w/Iron_Golem' },
    ],
    versions: 'Java: Si | Bedrock: Si (diseno especifico)',
  },
  {
    id: 'food-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/wheat.png',
    imageCredit: 'PlanetMinecraft - Big Carrot/Wheat/Potato Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2020/837/12651006-front_l.jpg',
    keyMaterials: ['Tierra cultivada', 'Agua', 'Semillas', 'Aldeano granjero (opcional)'],
    name: 'Granja de cultivos/comida',
    output: 'Trigo, zanahoria y papa para comida estable.',
    references: [
      {
        label: 'Fuente de imagen (PlanetMinecraft)',
        url: 'https://www.planetminecraft.com/project/big-carrot-wheat-potato-farm-schematica/',
      },
      { label: 'Minecraft Wiki: crop farming', url: 'https://minecraft.wiki/w/Tutorial%3ACrop_farming' },
      { label: 'Beebom: granjas utiles', url: 'https://beebom.com/best-minecraft-farms/' },
    ],
    versions: 'Java: Si | Bedrock: Si',
  },
  {
    id: 'sugar-cane-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/sugar_cane.png',
    imageCredit: 'PlanetMinecraft - Efficient Sugar Cane Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2024/038/17545524-image_l.jpg',
    keyMaterials: ['Observers', 'Pistones', 'Redstone', 'Agua'],
    name: 'Granja de cana de azucar',
    output: 'Papel para cohetes y mesa de cartografia.',
    references: [
      {
        label: 'Fuente de imagen (PlanetMinecraft)',
        url: 'https://www.planetminecraft.com/project/efficient-sugar-cane-farm-1-20-4/',
      },
      { label: 'Minecraft Wiki: tutorial sugar cane', url: 'https://minecraft.wiki/w/Tutorial%3ASugar_Cane_farming' },
      { label: 'Beebom: sugar cane farm', url: 'https://beebom.com/how-make-sugar-cane-farm-minecraft/' },
      { label: 'Sportskeeda: sugar cane 1.21', url: 'https://www.sportskeeda.com/minecraft/how-make-minecraft-1-21-sugarcane-farm' },
    ],
    versions: 'Java: Si | Bedrock: Si',
  },
  {
    id: 'bamboo-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/bamboo.png',
    imageCredit: 'PlanetMinecraft - Fastest Bamboo Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2022/235/16369955_l.jpg',
    keyMaterials: ['Observers', 'Pistones', 'Tolvas', 'Cofres'],
    name: 'Granja de bambu',
    output: 'Combustible y madera procesada.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/fastest-bamboo-farm-in-minecraft/' },
      { label: 'Minecraft Wiki: tutorial bamboo', url: 'https://minecraft.wiki/w/Tutorial%3ABamboo_farming' },
      { label: 'Beebom: bamboo farm', url: 'https://beebom.com/how-make-bamboo-farm-minecraft/' },
      { label: 'Sportskeeda: bamboo como fuel farm', url: 'https://www.sportskeeda.com/minecraft/how-make-automatic-fuel-farm-minecraft' },
    ],
    versions: 'Java: Si | Bedrock: Si',
  },
  {
    id: 'mob-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/block/spawner.png',
    imageCredit: 'PlanetMinecraft - Mobs Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/560/19097777_l.jpg',
    keyMaterials: ['Plataformas oscuras', 'Trapdoors', 'Agua', 'Tolvas'],
    name: 'Granja general de mobs',
    output: 'XP, polvo de redstone, huesos, cuerda.',
    references: [
      { label: 'Fuente de imagen (PlanetMinecraft)', url: 'https://www.planetminecraft.com/project/mobs-farm-litematica-world-map/' },
      { label: 'Minecraft Wiki: tutorial mob farm', url: 'https://minecraft.wiki/w/Tutorial%3AMob_farm' },
      { label: 'TheSpike: guia paso a paso', url: 'https://www.thespike.gg/minecraft/all-mobs-guide/mob-farm-guide' },
    ],
    versions: 'Java: Si | Bedrock: Si (rates diferentes)',
  },
  {
    id: 'creeper-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/gunpowder.png',
    imageCredit: 'PlanetMinecraft - Highly Efficient Creeper Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2025/942/18788770_l.jpg',
    keyMaterials: ['Trapdoors', 'Gatos', 'Tolvas + cofres'],
    name: 'Granja de creepers',
    output: 'Polvora para cohetes y TNT.',
    references: [
      {
        label: 'Fuente de imagen (PlanetMinecraft)',
        url: 'https://www.planetminecraft.com/project/highly-efficient-creeper-farm-litematic/',
      },
      { label: 'Minecraft Wiki: creeper farming', url: 'https://minecraft.wiki/w/Tutorial%3ACreeper_farming' },
      { label: 'Beebom: granjas recomendadas', url: 'https://beebom.com/best-minecraft-farms/' },
    ],
    versions: 'Java: Muy buena | Bedrock: Funciona con disenos dedicados',
  },
  {
    id: 'gold-farm',
    backupImageUrl: 'https://mcasset.cloud/1.21.7/assets/minecraft/textures/item/gold_ingot.png',
    imageCredit: 'PlanetMinecraft - Ilmango Gold Farm',
    imageUrl: 'https://static.planetminecraft.com/files/image/minecraft/project/2022/420/15746948_l.jpg',
    keyMaterials: ['Portales', 'Huevo de tortuga o señuelo', 'Tolvas'],
    name: 'Granja de oro',
    output: 'Oro y XP para intercambio piglin.',
    references: [
      {
        label: 'Fuente de imagen (PlanetMinecraft)',
        url: 'https://www.planetminecraft.com/project/ilmango-s-gold-farm-auto-storage-sorter-schematic/',
      },
      { label: 'Pro Game Guides: gold farm', url: 'https://progameguides.com/minecraft/how-to-build-a-gold-farm-in-minecraft/' },
      { label: 'Minecraft Wiki: zombified piglin farming', url: 'https://minecraft.wiki/w/Tutorial%3AZombified_piglin_farming' },
      { label: 'Beebom: granjas recomendadas', url: 'https://beebom.com/best-minecraft-farms/' },
    ],
    versions: 'Java: Si | Bedrock: Si (portal ticking)',
  },
];
