import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  calculateBaSingSeProject,
  calculateDiamondNeed,
  calculateStructureBlocks,
  calculateTheWallProject,
  DiamondPiece,
  diamondCostByPiece,
  MegaProjectPreset,
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

const toPositiveNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export function CalculatorScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('6');
  const [mode, setMode] = useState<StructureMode>('hollowShell');
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
        subtitle="Modo mega-pro: calcula proyectos gigantes por radio/largo, torres, puertas, foso, contrafuertes y tiempo de construccion"
        title="Calculadora De Mega Proyectos"
      >
        <View style={styles.modes}>
          {megaPresets.map((preset) => {
            const active = preset.id === megaPreset;
            return (
              <Pressable
                key={preset.id}
                onPress={() => setMegaPreset(preset.id)}
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
