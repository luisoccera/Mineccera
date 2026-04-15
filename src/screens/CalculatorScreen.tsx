import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  calculateBaSingSeProject,
  calculateDiamondNeed,
  calculatePortalCoordinates,
  calculatePortalFrame,
  calculateStructureBlocks,
  calculateTheWallProject,
  DiamondPiece,
  diamondCostByPiece,
  MegaProjectPreset,
  PortalDirection,
  StructureMode,
} from '../utils/calculators';

const modes: Array<{ id: StructureMode; label: string }> = [
  { id: 'hollowShell', label: 'Hueca + Techo' },
  { id: 'wallsOnly', label: 'Solo Muros' },
  { id: 'solid', label: 'Solida' },
];

const pieces: Array<{ id: DiamondPiece; label: string }> = [
  { id: 'pickaxe', label: 'Pico (3)' },
  { id: 'sword', label: 'Espada (2)' },
  { id: 'axe', label: 'Hacha (3)' },
  { id: 'shovel', label: 'Pala (1)' },
  { id: 'hoe', label: 'Azada (2)' },
  { id: 'helmet', label: 'Casco (5)' },
  { id: 'chestplate', label: 'Pechera (8)' },
  { id: 'leggings', label: 'Pantalones (7)' },
  { id: 'boots', label: 'Botas (4)' },
];

const allPieces = pieces.map((piece) => piece.id);
const megaPresets: Array<{ id: MegaProjectPreset; label: string }> = [
  { id: 'ba_sing_se', label: 'Ba Sing Se (radio)' },
  { id: 'the_wall', label: 'Muralla Norte (largo)' },
];
const portalDirections: Array<{ id: PortalDirection; label: string }> = [
  { id: 'overworld_to_nether', label: 'Overworld ➜ Nether' },
  { id: 'nether_to_overworld', label: 'Nether ➜ Overworld' },
];
const portalCornersMode: Array<{ id: 'full' | 'no_corners'; label: string }> = [
  { id: 'full', label: 'Marco completo' },
  { id: 'no_corners', label: 'Sin esquinas' },
];
type MegaGuideId = 'ba_sing_se' | 'got_wall' | 'aot_wall' | 'zaun';

const megaGuides: Array<{ id: MegaGuideId; label: string }> = [
  { id: 'ba_sing_se', label: 'Ba Sing Se' },
  { id: 'got_wall', label: 'Muralla GoT' },
  { id: 'aot_wall', label: 'Murallas Shingeki' },
  { id: 'zaun', label: 'Zaun (Arcane)' },
];

const toPositiveNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toSignedNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function CalculatorScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('6');
  const [mode, setMode] = useState<StructureMode>('hollowShell');
  const [portalDirection, setPortalDirection] = useState<PortalDirection>('overworld_to_nether');
  const [portalSourceX, setPortalSourceX] = useState('120');
  const [portalSourceZ, setPortalSourceZ] = useState('-240');
  const [portalInnerWidth, setPortalInnerWidth] = useState('2');
  const [portalInnerHeight, setPortalInnerHeight] = useState('3');
  const [portalCorners, setPortalCorners] = useState<'full' | 'no_corners'>('no_corners');
  const [selectedPieces, setSelectedPieces] = useState<Record<DiamondPiece, boolean>>({
    axe: true,
    boots: true,
    chestplate: true,
    helmet: true,
    hoe: true,
    leggings: true,
    pickaxe: true,
    shovel: true,
    sword: true,
  });
  const [megaPreset, setMegaPreset] = useState<MegaProjectPreset>('ba_sing_se');
  const [megaGuide, setMegaGuide] = useState<MegaGuideId>('ba_sing_se');
  const [blocksPerHour, setBlocksPerHour] = useState('2400');
  const [megaRadius, setMegaRadius] = useState('900');
  const [megaLength, setMegaLength] = useState('2800');
  const [megaWallHeight, setMegaWallHeight] = useState('92');
  const [megaWallThickness, setMegaWallThickness] = useState('14');
  const [megaTowerCount, setMegaTowerCount] = useState('28');
  const [megaTowerRadius, setMegaTowerRadius] = useState('7');
  const [megaTowerSpacing, setMegaTowerSpacing] = useState('320');
  const [megaTowerSize, setMegaTowerSize] = useState('28');
  const [megaTowerHeight, setMegaTowerHeight] = useState('52');
  const [megaGateCount, setMegaGateCount] = useState('4');
  const [megaGateWidth, setMegaGateWidth] = useState('24');
  const [megaMoatWidth, setMegaMoatWidth] = useState('12');
  const [megaRingRoads, setMegaRingRoads] = useState('3');
  const [megaButtressSpacing, setMegaButtressSpacing] = useState('96');
  const [megaButtressDepth, setMegaButtressDepth] = useState('20');

  const structure = useMemo(
    () => calculateStructureBlocks(Number(length), Number(width), Number(height), mode),
    [height, length, mode, width],
  );

  const selectedPieceIds = useMemo(
    () => pieces.filter((piece) => selectedPieces[piece.id]).map((piece) => piece.id),
    [selectedPieces],
  );
  const diamondTotal = useMemo(() => calculateDiamondNeed(selectedPieceIds), [selectedPieceIds]);
  const portalCoordinates = useMemo(
    () => calculatePortalCoordinates(toSignedNumber(portalSourceX, 0), toSignedNumber(portalSourceZ, 0), portalDirection),
    [portalDirection, portalSourceX, portalSourceZ],
  );
  const portalFrame = useMemo(
    () => calculatePortalFrame(toPositiveNumber(portalInnerWidth, 2), toPositiveNumber(portalInnerHeight, 3), portalCorners),
    [portalCorners, portalInnerHeight, portalInnerWidth],
  );
  const megaProject = useMemo(() => {
    const bph = toPositiveNumber(blocksPerHour, 2400);
    if (megaPreset === 'ba_sing_se') {
      return calculateBaSingSeProject({
        blocksPerHour: bph,
        gateCount: toPositiveNumber(megaGateCount, 4),
        gateWidth: toPositiveNumber(megaGateWidth, 24),
        moatWidth: toPositiveNumber(megaMoatWidth, 12),
        radius: toPositiveNumber(megaRadius, 900),
        ringRoads: toPositiveNumber(megaRingRoads, 3),
        towerCount: toPositiveNumber(megaTowerCount, 28),
        towerRadius: toPositiveNumber(megaTowerRadius, 7),
        wallHeight: toPositiveNumber(megaWallHeight, 92),
        wallThickness: toPositiveNumber(megaWallThickness, 14),
      });
    }
    return calculateTheWallProject({
      blocksPerHour: bph,
      buttressDepth: toPositiveNumber(megaButtressDepth, 20),
      buttressSpacing: toPositiveNumber(megaButtressSpacing, 96),
      gateCount: toPositiveNumber(megaGateCount, 3),
      gateWidth: toPositiveNumber(megaGateWidth, 24),
      length: toPositiveNumber(megaLength, 2800),
      towerHeight: toPositiveNumber(megaTowerHeight, 52),
      towerSize: toPositiveNumber(megaTowerSize, 28),
      towerSpacing: toPositiveNumber(megaTowerSpacing, 320),
      wallHeight: toPositiveNumber(megaWallHeight, 180),
      wallThickness: toPositiveNumber(megaWallThickness, 26),
    });
  }, [
    blocksPerHour,
    megaButtressDepth,
    megaButtressSpacing,
    megaGateCount,
    megaGateWidth,
    megaLength,
    megaMoatWidth,
    megaPreset,
    megaRadius,
    megaRingRoads,
    megaTowerCount,
    megaTowerHeight,
    megaTowerRadius,
    megaTowerSize,
    megaTowerSpacing,
    megaWallHeight,
    megaWallThickness,
  ]);
  const guideContent = useMemo(() => {
    const radius = toPositiveNumber(megaRadius, 900);
    const lengthWall = toPositiveNumber(megaLength, 2800);
    const wallHeight = toPositiveNumber(megaWallHeight, megaPreset === 'ba_sing_se' ? 92 : 180);
    const wallThickness = toPositiveNumber(megaWallThickness, megaPreset === 'ba_sing_se' ? 14 : 26);
    const gateCount = toPositiveNumber(megaGateCount, megaPreset === 'ba_sing_se' ? 4 : 3);
    const gateWidth = toPositiveNumber(megaGateWidth, 24);
    const ringRoads = toPositiveNumber(megaRingRoads, 3);
    const towerCount = toPositiveNumber(megaTowerCount, 28);
    const towerRadius = toPositiveNumber(megaTowerRadius, 7);
    const towerSpacing = toPositiveNumber(megaTowerSpacing, 320);
    const towerHeight = toPositiveNumber(megaTowerHeight, 52);
    const buttressSpacing = toPositiveNumber(megaButtressSpacing, 96);
    const buttressDepth = toPositiveNumber(megaButtressDepth, 20);

    const outerAot = Math.max(1200, Math.round(radius * 1.3));
    const middleAot = Math.round(outerAot * 0.66);
    const innerAot = Math.round(outerAot * 0.34);
    const districtSize = Math.max(120, Math.round(wallThickness * 12));
    const zaunRadius = Math.max(280, Math.round(radius * 0.42));
    const zaunLevels = Math.max(3, Math.round(wallHeight / 24));

    const fmt = (value: number) => Math.round(value).toLocaleString('es-MX');

    if (megaGuide === 'ba_sing_se') {
      return {
        checklist: [
          'Confirma que cada cuarto de muralla tenga al menos una torre.',
          'Prueba rutas de patrulla de 2 bloques de ancho minimo.',
          'Ilumina entradas y puentes del foso para evitar mobs.',
        ],
        materials: [
          'Piedra profunda, ladrillo de piedra y andesita para muralla.',
          'Abeto/roble oscuro para puertas gigantes y torres.',
          'Faroles, estandartes verdes y cobre para detalles del Reino Tierra.',
        ],
        phases: [
          `Traza un circulo de radio ${fmt(radius)} y divide en 4 cuadrantes.`,
          `Levanta la muralla principal a ${fmt(wallHeight)} de alto y ${fmt(wallThickness)} de grosor en modulos de 32 bloques.`,
          `Coloca ${fmt(towerCount)} torres de radio ${fmt(towerRadius)} en puntos altos y accesos.`,
          `Abre ${fmt(gateCount)} puertas monumentales (ancho ${fmt(gateWidth)}) con puente sobre foso.`,
          `Construye ${fmt(ringRoads)} anillos internos para mercado, barrios y zona real.`,
          'Remata con almenas, puestos de vigilancia y jardin central estilo Ba Sing Se.',
        ],
        scale: `Escala sugerida: diametro ${fmt(radius * 2)} | altura ${fmt(wallHeight)} | puertas ${fmt(gateCount)}.`,
        title: 'Ba Sing Se (Avatar) - ciudad amurallada por anillos',
      };
    }

    if (megaGuide === 'got_wall') {
      return {
        checklist: [
          'Verifica que las torres se vean cada 12-20 chunks.',
          'Conecta pasarela superior continua para patrullaje.',
          'Deja salas internas para hornos, cofres y camas.',
        ],
        materials: [
          'Nieve, hielo compactado y hormigon blanco para cuerpo principal.',
          'Piedra y deepslate para base y contrafuertes.',
          'Madera oscura, cadenas y faroles para castillos de guardia.',
        ],
        phases: [
          `Marca el eje de la muralla con largo ${fmt(lengthWall)} en linea recta.`,
          `Sube el cuerpo principal a ${fmt(wallHeight)} de alto y ${fmt(wallThickness)} de grosor por tramos de 64.`,
          `Agrega torres cada ${fmt(towerSpacing)} bloques, tamano ${fmt(toPositiveNumber(megaTowerSize, 28))} y alto ${fmt(towerHeight)}.`,
          `Integra contrafuertes cada ${fmt(buttressSpacing)} bloques con profundidad ${fmt(buttressDepth)}.`,
          `Abre ${fmt(gateCount)} puertas (ancho ${fmt(gateWidth)}) y fortines laterales.`,
          'Texturiza con mezcla de blanco/gris para efecto de hielo viejo y viento.',
        ],
        scale: `Escala sugerida: largo ${fmt(lengthWall)} | alto ${fmt(wallHeight)} | torres ${fmt(Math.max(2, Math.floor(lengthWall / towerSpacing) + 1))}.`,
        title: 'Muralla Norte (Game of Thrones) - defensa lineal extrema',
      };
    }

    if (megaGuide === 'aot_wall') {
      return {
        checklist: [
          'Cada muro debe tener distrito saliente y doble puerta.',
          'Deja carreteras radiales entre Maria, Rose y Sina.',
          'Reserva espacio para cuarteles y puntos de maniobras 3D.',
        ],
        materials: [
          'Piedra lisa, ladrillo de piedra y calcita para muros titanicos.',
          'Roca, andesita y deepslate para base pesada.',
          'Madera, cadenas y cobre para distritos y maquinaria.',
        ],
        phases: [
          `Traza tres circulos concentricos: Maria ${fmt(outerAot)}, Rose ${fmt(middleAot)}, Sina ${fmt(innerAot)}.`,
          `Construye cada muro con altura minima ${fmt(Math.max(120, wallHeight))} y grosor ${fmt(Math.max(18, wallThickness))}.`,
          `En cada muro crea 4-8 distritos salientes de ancho ${fmt(districtSize)} para control militar.`,
          'Levanta puertas dobles, esclusas y tuneles de abastecimiento en cada distrito.',
          'Conecta anillos con caminos, vias de redstone y estaciones de guardianes.',
          'Completa barrios internos por capas: granjas exteriores, ciudad media y nucleo central.',
        ],
        scale: `Preset recomendado para calculadora: radio ${fmt(outerAot)} | alto ${fmt(Math.max(120, wallHeight))} | grosor ${fmt(Math.max(18, wallThickness))}.`,
        title: 'Murallas de Shingeki no Kyojin - sistema concentricos',
      };
    }

    return {
      checklist: [
        'Prueba rutas verticales: elevadores de agua + escaleras.',
        'Combina zonas limpias/contaminadas para narrativa visual.',
        'Mantiene iluminacion por capas para evitar zonas oscuras.',
      ],
      materials: [
        'Deepslate, toba, ladrillo de piedra y cobre oxidado.',
        'Cristal tintado, hierro, cadenas y rejillas industriales.',
        'Iluminacion cian/verde (ranas, faroles, sea lantern) para look quimico.',
      ],
      phases: [
        `Define crater principal de radio ${fmt(zaunRadius)} y al menos ${fmt(zaunLevels)} niveles verticales.`,
        'Crea base industrial con tuberias, calderas y talleres de quimicos.',
        'Conecta niveles con pasarelas, puentes metalicos y elevadores de carga.',
        `Levanta torres de ventilacion de ${fmt(Math.max(36, towerHeight))} bloques y chimeneas activas.`,
        'Agrega barrios bajos densos, mercados, laboratorios y vias de servicio.',
        'Aplica niebla visual con vidrio tintado y luces frias para atmosfera Arcane.',
      ],
      scale: `Preset recomendado: radio ${fmt(zaunRadius)} | alto ${fmt(Math.max(84, wallHeight))} | puertas ${fmt(Math.max(5, gateCount))}.`,
      title: 'Zaun (Arcane) - ciudad vertical industrial',
    };
  }, [
    megaButtressDepth,
    megaButtressSpacing,
    megaGateCount,
    megaGateWidth,
    megaGuide,
    megaLength,
    megaPreset,
    megaRadius,
    megaRingRoads,
    megaTowerCount,
    megaTowerHeight,
    megaTowerRadius,
    megaTowerSize,
    megaTowerSpacing,
    megaWallHeight,
    megaWallThickness,
  ]);

  const togglePiece = (piece: DiamondPiece) =>
    setSelectedPieces((previous) => ({
      ...previous,
      [piece]: !previous[piece],
    }));

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Mide bloques para casa, murallas o estructuras completas"
        title="Calculadora De Estructuras"
      >
        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Largo</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setLength}
              style={[styles.input, compact && styles.inputCompact]}
              value={length}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ancho</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setWidth}
              style={[styles.input, compact && styles.inputCompact]}
              value={width}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alto</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setHeight}
              style={[styles.input, compact && styles.inputCompact]}
              value={height}
            />
          </View>
        </View>

        <View style={styles.modes}>
          {modes.map((modeOption) => {
            const active = modeOption.id === mode;
            return (
              <Pressable
                key={modeOption.id}
                onPress={() => setMode(modeOption.id)}
                style={[styles.modeChip, active && styles.modeChipActive]}
              >
                <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{modeOption.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Bloques totales: {structure.blocks}</Text>
          <Text style={styles.resultLine}>Area de piso: {structure.floorArea} bloques</Text>
          <Text style={styles.resultLine}>Stacks: {structure.stacksAndRemainder}</Text>
          <Text style={styles.resultLine}>Shulkers aprox: {structure.shulkersNeeded}</Text>
        </View>
      </SectionCard>

      <SectionCard
        subtitle="Basada en la logica de CrafteosPE: convierte X/Z entre Overworld y Nether (relacion 8:1) y calcula obsidiana del marco"
        title="Calculadora De Portales Nether"
      >
        <View style={styles.modes}>
          {portalDirections.map((direction) => {
            const active = direction.id === portalDirection;
            return (
              <Pressable
                key={direction.id}
                onPress={() => setPortalDirection(direction.id)}
                style={[styles.modeChip, active && styles.modeChipActive]}
              >
                <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{direction.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Coordenada X</Text>
            <TextInput
              keyboardType="numbers-and-punctuation"
              onChangeText={setPortalSourceX}
              style={[styles.input, compact && styles.inputCompact]}
              value={portalSourceX}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Coordenada Z</Text>
            <TextInput
              keyboardType="numbers-and-punctuation"
              onChangeText={setPortalSourceZ}
              style={[styles.input, compact && styles.inputCompact]}
              value={portalSourceZ}
            />
          </View>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>
            {portalDirection === 'overworld_to_nether' ? 'Destino Nether' : 'Destino Overworld'} (redondeado):
            {' '}
            X {portalCoordinates.targetXRounded} | Z {portalCoordinates.targetZRounded}
          </Text>
          <Text style={styles.resultHint}>
            Coordenada exacta: X {portalCoordinates.targetX.toFixed(2)} | Z {portalCoordinates.targetZ.toFixed(2)}
          </Text>
          <Text style={styles.resultHint}>
            Tip: mantén la misma orientación del portal al construir el marco de destino.
          </Text>
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ancho interno (2-21)</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setPortalInnerWidth}
              style={[styles.input, compact && styles.inputCompact]}
              value={portalInnerWidth}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alto interno (3-21)</Text>
            <TextInput
              keyboardType="number-pad"
              onChangeText={setPortalInnerHeight}
              style={[styles.input, compact && styles.inputCompact]}
              value={portalInnerHeight}
            />
          </View>
        </View>

        <View style={styles.modes}>
          {portalCornersMode.map((modeOption) => {
            const active = modeOption.id === portalCorners;
            return (
              <Pressable
                key={modeOption.id}
                onPress={() => setPortalCorners(modeOption.id)}
                style={[styles.modeChip, active && styles.modeChipActive]}
              >
                <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{modeOption.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Obsidiana necesaria: {portalFrame.obsidianBlocks}</Text>
          <Text style={styles.resultHint}>
            Marco total: {portalFrame.frameWidth} x {portalFrame.frameHeight}
          </Text>
          <Text style={styles.resultHint}>
            Área activa del portal: {portalFrame.portalArea} bloques ({portalFrame.innerWidth} x {portalFrame.innerHeight})
          </Text>
        </View>
      </SectionCard>

      <SectionCard
        subtitle="Modo mega-pro: calcula proyectos gigantes por radio/largo, torres, puertas, foso, contrafuertes y tiempo de construccion"
        title="Calculadora De Mega Proyectos"
      >
        <View style={styles.modes}>
          {megaPresets.map((preset) => {
            const active = preset.id === megaPreset;
            return (
              <Pressable
                key={preset.id}
                onPress={() => {
                  setMegaPreset(preset.id);
                  setMegaGuide(preset.id === 'ba_sing_se' ? 'ba_sing_se' : 'got_wall');
                }}
                style={[styles.modeChip, active && styles.modeChipActive]}
              >
                <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>{preset.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          {megaPreset === 'ba_sing_se' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Radio ciudad</Text>
              <TextInput keyboardType="number-pad" onChangeText={setMegaRadius} style={[styles.input, compact && styles.inputCompact]} value={megaRadius} />
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Largo muralla</Text>
              <TextInput keyboardType="number-pad" onChangeText={setMegaLength} style={[styles.input, compact && styles.inputCompact]} value={megaLength} />
            </View>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alto muralla</Text>
            <TextInput keyboardType="number-pad" onChangeText={setMegaWallHeight} style={[styles.input, compact && styles.inputCompact]} value={megaWallHeight} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grosor muralla</Text>
            <TextInput keyboardType="number-pad" onChangeText={setMegaWallThickness} style={[styles.input, compact && styles.inputCompact]} value={megaWallThickness} />
          </View>
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          {megaPreset === 'ba_sing_se' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Torres</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaTowerCount} style={[styles.input, compact && styles.inputCompact]} value={megaTowerCount} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Radio torre</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaTowerRadius} style={[styles.input, compact && styles.inputCompact]} value={megaTowerRadius} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Foso ancho</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaMoatWidth} style={[styles.input, compact && styles.inputCompact]} value={megaMoatWidth} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Anillos internos</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaRingRoads} style={[styles.input, compact && styles.inputCompact]} value={megaRingRoads} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Espaciado torres</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaTowerSpacing} style={[styles.input, compact && styles.inputCompact]} value={megaTowerSpacing} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tamano torre</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaTowerSize} style={[styles.input, compact && styles.inputCompact]} value={megaTowerSize} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Alto torre</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaTowerHeight} style={[styles.input, compact && styles.inputCompact]} value={megaTowerHeight} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Espaciado contrafuerte</Text>
                <TextInput keyboardType="number-pad" onChangeText={setMegaButtressSpacing} style={[styles.input, compact && styles.inputCompact]} value={megaButtressSpacing} />
              </View>
            </>
          )}
        </View>

        <View style={[styles.row, compact && styles.rowCompact]}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Puertas</Text>
            <TextInput keyboardType="number-pad" onChangeText={setMegaGateCount} style={[styles.input, compact && styles.inputCompact]} value={megaGateCount} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ancho puerta</Text>
            <TextInput keyboardType="number-pad" onChangeText={setMegaGateWidth} style={[styles.input, compact && styles.inputCompact]} value={megaGateWidth} />
          </View>
          {megaPreset === 'the_wall' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prof. contrafuerte</Text>
              <TextInput keyboardType="number-pad" onChangeText={setMegaButtressDepth} style={[styles.input, compact && styles.inputCompact]} value={megaButtressDepth} />
            </View>
          ) : null}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bloques por hora</Text>
            <TextInput keyboardType="number-pad" onChangeText={setBlocksPerHour} style={[styles.input, compact && styles.inputCompact]} value={blocksPerHour} />
          </View>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>{megaProject.name}</Text>
          <Text style={styles.resultLine}>Bloques totales: {megaProject.totalBlocks}</Text>
          <Text style={styles.resultLine}>Stacks: {megaProject.stacksAndRemainder}</Text>
          <Text style={styles.resultLine}>Shulkers aprox: {megaProject.shulkersNeeded}</Text>
          <Text style={styles.resultLine}>Chunks de cobertura: {megaProject.chunksAcross}</Text>
          <Text style={styles.resultLine}>
            Tiempo estimado: {megaProject.estimatedHours} h (aprox {megaProject.estimatedDays} dias de 6h)
          </Text>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Desglose principal</Text>
          {megaProject.breakdown.map((entry) => (
            <Text key={entry.label} style={styles.resultHint}>
              • {entry.label}: {entry.value.toLocaleString('es-MX')} bloques
            </Text>
          ))}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Materiales recomendados</Text>
          {megaProject.materials.map((material) => (
            <Text key={material.label} style={styles.resultHint}>
              • {material.label}: {material.blocks.toLocaleString('es-MX')} ({material.stacks})
            </Text>
          ))}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Guia De Construccion Inspirada</Text>
          <Text style={styles.resultHint}>Selecciona el proyecto para ver pasos completos en Minecraft.</Text>

          <View style={styles.modes}>
            {megaGuides.map((guide) => {
              const active = guide.id === megaGuide;
              return (
                <Pressable
                  key={guide.id}
                  onPress={() => setMegaGuide(guide.id)}
                  style={[styles.guideChip, active && styles.guideChipActive]}
                >
                  <Text style={[styles.guideChipText, active && styles.guideChipTextActive]}>{guide.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.guidePanel}>
            <Text style={styles.guideTitle}>{guideContent.title}</Text>
            <Text style={styles.guideScale}>{guideContent.scale}</Text>

            <Text style={styles.guideSubtitle}>Fases recomendadas</Text>
            {guideContent.phases.map((phase, index) => (
              <Text key={`${guideContent.title}-phase-${index}`} style={styles.guideLine}>
                {index + 1}) {phase}
              </Text>
            ))}

            <Text style={styles.guideSubtitle}>Materiales clave</Text>
            {guideContent.materials.map((material, index) => (
              <Text key={`${guideContent.title}-material-${index}`} style={styles.guideLine}>
                {index + 1}) {material}
              </Text>
            ))}

            <Text style={styles.guideSubtitle}>Checklist final</Text>
            {guideContent.checklist.map((item, index) => (
              <Text key={`${guideContent.title}-check-${index}`} style={styles.guideLine}>
                {index + 1}) {item}
              </Text>
            ))}
          </View>
        </View>
      </SectionCard>

      <SectionCard
        subtitle="Marca las piezas que quieres craftear y calcula diamantes"
        title="Calculadora De Diamantes"
      >
        <View style={[styles.actionsRow, compact && styles.actionsRowCompact]}>
          <Pressable
            onPress={() =>
              setSelectedPieces(
                allPieces.reduce<Record<DiamondPiece, boolean>>(
                  (acc, piece) => ({ ...acc, [piece]: true }),
                  {} as Record<DiamondPiece, boolean>,
                ),
              )
            }
            style={styles.quickButton}
          >
            <Text style={styles.quickButtonText}>Set Completo</Text>
          </Pressable>
          <Pressable
            onPress={() =>
              setSelectedPieces(
                allPieces.reduce<Record<DiamondPiece, boolean>>(
                  (acc, piece) => ({ ...acc, [piece]: false }),
                  {} as Record<DiamondPiece, boolean>,
                ),
              )
            }
            style={styles.quickButton}
          >
            <Text style={styles.quickButtonText}>Limpiar</Text>
          </Pressable>
        </View>

        <View style={styles.pieceList}>
          {pieces.map((piece) => {
            const active = selectedPieces[piece.id];
            return (
              <Pressable
                key={piece.id}
                onPress={() => togglePiece(piece.id)}
                style={[styles.pieceRow, active && styles.pieceRowActive]}
              >
                <Text style={[styles.pieceLabel, active && styles.pieceLabelActive]}>{piece.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLine}>Diamantes totales: {diamondTotal}</Text>
          <Text style={styles.resultHint}>
            Formula: {selectedPieceIds.map((piece) => diamondCostByPiece[piece]).join(' + ') || '0'}
          </Text>
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionsRowCompact: {
    flexDirection: 'column',
  },
  content: {
    alignSelf: 'center',
    gap: spacing.md,
    maxWidth: 1240,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    width: '100%',
  },
  contentCompact: {
    paddingHorizontal: spacing.sm,
  },
  input: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  inputCompact: {
    fontSize: 13,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  label: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
  },
  modeChip: {
    backgroundColor: palette.stone,
    borderColor: palette.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  modeChipActive: {
    backgroundColor: '#DFECE3',
    borderColor: palette.primary,
  },
  modeChipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  modeChipTextActive: {
    color: palette.primaryDark,
  },
  guideChip: {
    backgroundColor: '#EDE3D7',
    borderColor: palette.woodSoft,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  guideChipActive: {
    backgroundColor: '#DFECE3',
    borderColor: palette.primary,
  },
  guideChipText: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  guideChipTextActive: {
    color: palette.primaryDark,
  },
  guidePanel: {
    backgroundColor: '#F0ECE4',
    borderColor: '#CDBEA8',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
    marginTop: spacing.sm,
    padding: spacing.sm,
  },
  guideTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 13,
    fontWeight: '700',
  },
  guideScale: {
    color: palette.secondary,
    fontSize: 12,
  },
  guideSubtitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  guideLine: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  modes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  pieceLabel: {
    color: palette.text,
    fontSize: 13,
  },
  pieceLabelActive: {
    color: palette.primaryDark,
    fontWeight: '700',
  },
  pieceList: {
    gap: spacing.xs,
  },
  pieceRow: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  pieceRowActive: {
    backgroundColor: '#DEECE3',
    borderColor: palette.primary,
  },
  quickButton: {
    backgroundColor: '#EDE3D7',
    borderColor: palette.woodSoft,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  quickButtonText: {
    color: palette.secondary,
    fontFamily: font.display,
    fontSize: 12,
  },
  resultBox: {
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 6,
    marginTop: spacing.md,
    padding: spacing.sm,
  },
  resultHint: {
    color: palette.muted,
    fontSize: 12,
  },
  resultLine: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowCompact: {
    flexDirection: 'column',
  },
});
