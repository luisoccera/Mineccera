import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';
import {
  calculateDiamondNeed,
  calculateStructureBlocks,
  DiamondPiece,
  diamondCostByPiece,
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

  const structure = useMemo(
    () => calculateStructureBlocks(Number(length), Number(width), Number(height), mode),
    [height, length, mode, width],
  );

  const selectedPieceIds = useMemo(
    () => pieces.filter((piece) => selectedPieces[piece.id]).map((piece) => piece.id),
    [selectedPieces],
  );
  const diamondTotal = useMemo(() => calculateDiamondNeed(selectedPieceIds), [selectedPieceIds]);

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
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#F3F4F6',
    borderColor: palette.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  modeChipActive: {
    backgroundColor: '#DFF4E8',
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
    backgroundColor: '#F9FAFB',
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  pieceRowActive: {
    backgroundColor: '#E6F4EA',
    borderColor: palette.primary,
  },
  quickButton: {
    backgroundColor: '#FFF5E9',
    borderColor: '#F5D4A5',
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
    backgroundColor: '#F7FAFC',
    borderColor: '#D7E2EE',
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
