export interface VillagerCoreRule {
  id: string;
  title: string;
  value: string;
}

export interface VillagerJobGuide {
  buysForEmeralds: string[];
  id: string;
  notes: string[];
  profession: string;
  sellsHighlights: string[];
  workstation: string;
  workstationId?: string;
}

export const villagerCoreRules: VillagerCoreRule[] = [
  {
    id: 'levels',
    title: 'Niveles de trabajo',
    value: 'Principiante, Aprendiz, Oficial, Experto y Maestro.',
  },
  {
    id: 'restock',
    title: 'Reabastecimiento',
    value: 'Pueden reabastecer comercios hasta 2 veces por día al trabajar en su estación.',
  },
  {
    id: 'job-lock',
    title: 'Bloqueo de profesión',
    value: 'Después del primer trade, el trabajo queda bloqueado y ya no cambia.',
  },
  {
    id: 'discount',
    title: 'Descuentos',
    value: 'Curar aldeano zombi y tener reputación positiva baja los precios.',
  },
  {
    id: 'breeding',
    title: 'Reproducción',
    value: 'Necesitas camas libres + comida (pan, zanahoria, papa o remolacha).',
  },
];

export const villagerJobGuides: VillagerJobGuide[] = [
  {
    buysForEmeralds: ['No comercia hasta reclamar una estación.'],
    id: 'unemployed',
    notes: ['Puede tomar cualquier profesión disponible (excepto simplón).'],
    profession: 'Desempleado',
    sellsHighlights: ['Sin ofertas.'],
    workstation: 'Ninguna',
  },
  {
    buysForEmeralds: ['No comercia nunca.'],
    id: 'nitwit',
    notes: ['No puede tener trabajo ni comerciar.'],
    profession: 'Simplón',
    sellsHighlights: ['Sin ofertas.'],
    workstation: 'Ninguna',
  },
  {
    buysForEmeralds: ['Carbón, hierro, lava (cubeta), diamante (niveles altos).'],
    id: 'armorer',
    notes: ['Ideal para conseguir armadura de diamante encantada en late game.'],
    profession: 'Armero',
    sellsHighlights: ['Armadura de hierro/diamante, campana, escudo.'],
    workstation: 'Alto horno',
    workstationId: 'blast_furnace',
  },
  {
    buysForEmeralds: ['Carbón, hierro, pedernal.'],
    id: 'weaponsmith',
    notes: ['Buena fuente de espadas/hachas encantadas.'],
    profession: 'Herrero de armas',
    sellsHighlights: ['Espadas y hachas encantadas, campana.'],
    workstation: 'Afiladora',
    workstationId: 'grindstone',
  },
  {
    buysForEmeralds: ['Carbón, hierro, pedernal, diamante (niveles altos).'],
    id: 'toolsmith',
    notes: ['Muy útil para picos/herramientas encantadas en serie.'],
    profession: 'Herrero de herramientas',
    sellsHighlights: ['Picos, palas, hachas y azadas encantadas.'],
    workstation: 'Mesa de herrería',
    workstationId: 'smithing_table',
  },
  {
    buysForEmeralds: ['Carne cruda de pollo, cerdo o conejo.'],
    id: 'butcher',
    notes: ['Con granja de animales, produce esmeraldas constante.'],
    profession: 'Carnicero',
    sellsHighlights: ['Carnes cocidas y estofado de conejo.'],
    workstation: 'Ahumador',
    workstationId: 'smoker',
  },
  {
    buysForEmeralds: ['Papel y paneles de vidrio.'],
    id: 'cartographer',
    notes: ['Clave para mapas de explorador (océano y bosque).'],
    profession: 'Cartógrafo',
    sellsHighlights: ['Mapas de exploración, brújula, estandartes.'],
    workstation: 'Mesa de cartografía',
    workstationId: 'cartography_table',
  },
  {
    buysForEmeralds: ['Carne podrida, oro, pata de conejo, redstone.'],
    id: 'cleric',
    notes: ['Trade clásico: carne podrida -> esmeraldas temprano.'],
    profession: 'Clérigo',
    sellsHighlights: ['Polvo de redstone, lapislázuli, botellas, Ender Pearl.'],
    workstation: 'Soporte para pociones',
    workstationId: 'brewing_stand',
  },
  {
    buysForEmeralds: ['Trigo, papa, zanahoria, remolacha, calabaza, melón.'],
    id: 'farmer',
    notes: ['Uno de los mejores para granjas automáticas y esmeraldas tempranas.'],
    profession: 'Granjero',
    sellsHighlights: ['Pan, pastel, galletas, manzana dorada sospechosa (según versión).'],
    workstation: 'Compostador',
    workstationId: 'composter',
  },
  {
    buysForEmeralds: ['Hilo, carbón, pescado, cuerda.'],
    id: 'fisherman',
    notes: ['Combina bien con granja de pesca y cuerda.'],
    profession: 'Pescador',
    sellsHighlights: ['Caña, pescado cocido, bote encantado.'],
    workstation: 'Barril',
    workstationId: 'barrel',
  },
  {
    buysForEmeralds: ['Palos, pedernal, plumas, hilo.'],
    id: 'fletcher',
    notes: ['Trade top early game: palos -> esmeraldas.'],
    profession: 'Flechero',
    sellsHighlights: ['Flechas, arco, ballesta, flecha con efecto (niveles altos).'],
    workstation: 'Mesa de flechas',
    workstationId: 'fletching_table',
  },
  {
    buysForEmeralds: ['Papel, libros, tinta, plumas (según nivel).'],
    id: 'librarian',
    notes: ['Profesión más buscada para libros encantados y etiqueta de nombre.'],
    profession: 'Bibliotecario',
    sellsHighlights: ['Libros encantados, etiqueta de nombre, cristal, linterna.'],
    workstation: 'Atril',
    workstationId: 'lectern',
  },
  {
    buysForEmeralds: ['Cuero, pedernal, piel de conejo, escama de tortuga.'],
    id: 'leatherworker',
    notes: ['En Bedrock/Java trabaja con cualquier caldero accesible.'],
    profession: 'Peletero',
    sellsHighlights: ['Armadura de cuero, silla de montar, armadura de caballo de cuero.'],
    workstation: 'Caldero',
    workstationId: 'cauldron',
  },
  {
    buysForEmeralds: ['Arcilla, piedra, andesita/diorita/granito, cuarzo (niveles altos).'],
    id: 'mason',
    notes: ['Excelente para construir y convertir recursos de piedra en esmeraldas.'],
    profession: 'Albañil / Cantero',
    sellsHighlights: ['Ladrillos, bloques decorativos de piedra, terracota.'],
    workstation: 'Cortapiedras',
    workstationId: 'stonecutter',
  },
  {
    buysForEmeralds: ['Lana, hilo, tintes.'],
    id: 'shepherd',
    notes: ['Muy rentable con granja de ovejas o granja de lana automatizada.'],
    profession: 'Pastor',
    sellsHighlights: ['Lana de colores, camas, cuadros, estandartes.'],
    workstation: 'Telar',
    workstationId: 'loom',
  },
];
