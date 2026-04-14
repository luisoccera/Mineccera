import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { useDeviceClass } from '../responsive';
import {
  enchantments,
  getEnchantmentsForItem,
  ItemCategory,
  itemIconByCategory,
  itemLabels,
  recommendedPreset,
  SelectedEnchantment,
} from '../data/enchantments';
import { font, palette, radius, spacing } from '../theme';
import { optimizeAnvilOrder } from '../utils/anvilOptimizer';

const itemOrder: ItemCategory[] = [
  'pickaxe',
  'axe',
  'shovel',
  'hoe',
  'sword',
  'mace',
  'bow',
  'crossbow',
  'trident',
  'fishing_rod',
  'shield',
  'shears',
  'brush',
  'helmet',
  'turtle_shell',
  'chestplate',
  'leggings',
  'boots',
  'elytra',
];

export function EnchantingScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [itemType, setItemType] = useState<ItemCategory>('pickaxe');
  const [brokenIcons, setBrokenIcons] = useState<Record<ItemCategory, true>>({} as Record<ItemCategory, true>);
  const [selectedLevels, setSelectedLevels] = useState<Record<string, number>>({
    efficiency: 5,
    fortune: 3,
    mending: 1,
    unbreaking: 3,
  });

  const itemEnchantments = useMemo(() => getEnchantmentsForItem(itemType), [itemType]);
  const selectedIds = Object.keys(selectedLevels);

  const selectedForPlan = useMemo<SelectedEnchantment[]>(
    () =>
      itemEnchantments
        .filter((enchantment) => selectedLevels[enchantment.id] !== undefined)
        .map((enchantment) => ({
          id: enchantment.id,
          level: selectedLevels[enchantment.id],
          multiplier: enchantment.multiplier,
          name: enchantment.name,
        })),
    [itemEnchantments, selectedLevels],
  );

  const plan = useMemo(() => {
    if (selectedForPlan.length > 8) {
      return null;
    }
    return optimizeAnvilOrder(selectedForPlan);
  }, [selectedForPlan]);

  const resetPreset = (nextItem: ItemCategory) => {
    const available = getEnchantmentsForItem(nextItem);
    const preset = recommendedPreset[nextItem];
    const nextLevels: Record<string, number> = {};

    preset.forEach((presetId) => {
      const target = available.find((enchantment) => enchantment.id === presetId);
      if (target) {
        nextLevels[target.id] = target.maxLevel;
      }
    });

    setSelectedLevels(nextLevels);
  };

  const hasConflict = (enchantmentId: string, conflicts?: string[]) =>
    (conflicts || []).some((conflictId) => selectedIds.includes(conflictId) && conflictId !== enchantmentId);

  const toggleEnchantment = (enchantmentId: string) => {
    const selected = enchantments.find((candidate) => candidate.id === enchantmentId);
    if (!selected) {
      return;
    }

    setSelectedLevels((previous) => {
      const next = { ...previous };
      if (next[enchantmentId] !== undefined) {
        delete next[enchantmentId];
        return next;
      }

      selected.incompatibleWith?.forEach((conflictId) => {
        delete next[conflictId];
      });
      next[enchantmentId] = selected.maxLevel;
      return next;
    });
  };

  const adjustLevel = (enchantmentId: string, delta: number, maxLevel: number) => {
    setSelectedLevels((previous) => {
      const current = previous[enchantmentId];
      if (current === undefined) {
        return previous;
      }

      const nextLevel = Math.min(maxLevel, Math.max(1, current + delta));
      return { ...previous, [enchantmentId]: nextLevel };
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Incluye objetos encantables y encantamientos principales de Minecraft 1.21+"
        title="Guia De Encantamientos"
      >
        <View style={[styles.selectedItemCard, compact && styles.selectedItemCardCompact]}>
          {!brokenIcons[itemType] ? (
            <Image
              onError={() => setBrokenIcons((prev) => ({ ...prev, [itemType]: true }))}
              source={{ uri: itemIconByCategory[itemType] }}
              style={styles.selectedItemIcon}
            />
          ) : (
            <Text style={styles.selectedItemEmoji}>✨</Text>
          )}
          <View style={styles.selectedItemBody}>
            <Text style={styles.selectedItemTitle}>Objeto: {itemLabels[itemType]}</Text>
            <Text style={styles.selectedItemMeta}>Encantamientos disponibles: {itemEnchantments.length}</Text>
            <Text style={styles.selectedItemMeta}>Preset recomendado: {recommendedPreset[itemType].length} encantamientos</Text>
          </View>
        </View>

        <Text style={styles.helperText}>1) Elige el objeto</Text>
        <View style={styles.itemChips}>
          {itemOrder.map((candidate) => {
            const active = candidate === itemType;
            return (
              <Pressable
                key={candidate}
                onPress={() => {
                  setItemType(candidate);
                  resetPreset(candidate);
                }}
                style={[styles.itemChip, active && styles.itemChipActive]}
              >
                {!brokenIcons[candidate] ? (
                  <Image
                    onError={() => setBrokenIcons((prev) => ({ ...prev, [candidate]: true }))}
                    source={{ uri: itemIconByCategory[candidate] }}
                    style={styles.itemChipIcon}
                  />
                ) : (
                  <Text style={styles.itemChipEmoji}>✨</Text>
                )}
                <Text style={[styles.itemChipText, active && styles.itemChipTextActive]}>{itemLabels[candidate]}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => resetPreset(itemType)} style={styles.presetButton}>
          <Text style={styles.presetButtonText}>Cargar preset recomendado</Text>
        </Pressable>

        <Text style={styles.helperText}>2) Selecciona encantamientos</Text>
        <View style={styles.enchantList}>
          {itemEnchantments.map((enchantment) => {
            const selected = selectedLevels[enchantment.id] !== undefined;
            const disabled = !selected && hasConflict(enchantment.id, enchantment.incompatibleWith);
            return (
              <View
                key={enchantment.id}
                style={[
                  styles.enchantRow,
                  compact && styles.enchantRowCompact,
                  selected && styles.enchantRowActive,
                ]}
              >
                <Pressable
                  onPress={() => toggleEnchantment(enchantment.id)}
                  style={styles.enchantToggle}
                >
                  <Text style={[styles.enchantTitle, disabled && styles.enchantDisabled]}>
                    {selected ? '✓ ' : ''}{enchantment.name}
                  </Text>
                  <Text style={styles.enchantMeta}>
                    Max {enchantment.maxLevel} | Multiplicador {enchantment.multiplier}
                  </Text>
                </Pressable>
                {selected ? (
                  <View style={[styles.levelControl, compact && styles.levelControlCompact]}>
                    <Pressable
                      onPress={() => adjustLevel(enchantment.id, -1, enchantment.maxLevel)}
                      style={styles.levelButton}
                    >
                      <Text style={styles.levelButtonText}>-</Text>
                    </Pressable>
                    <Text style={styles.levelValue}>{selectedLevels[enchantment.id]}</Text>
                    <Pressable
                      onPress={() => adjustLevel(enchantment.id, 1, enchantment.maxLevel)}
                      style={styles.levelButton}
                    >
                      <Text style={styles.levelButtonText}>+</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </SectionCard>

      <SectionCard
        subtitle="El orden se calcula con penalizacion de yunque y costo por libro"
        title="Orden Optimo De Yunque"
      >
        {!selectedForPlan.length ? (
          <Text style={styles.emptyText}>Selecciona al menos un encantamiento para calcular.</Text>
        ) : null}

        {selectedForPlan.length > 8 ? (
          <Text style={styles.warningText}>
            Selecciona maximo 8 encantamientos para mantener el calculo rapido.
          </Text>
        ) : null}

        {plan ? (
          <View style={styles.planBox}>
            <Text style={styles.planSummary}>Costo total estimado: {plan.totalCost} niveles</Text>
            <Text style={styles.planSummary}>Costo maximo en un paso: {plan.maxStepCost} niveles</Text>
            <Text style={styles.planSummary}>
              Pasos por arriba de 39 niveles: {plan.overflowSteps}
            </Text>

            <View style={styles.steps}>
              {plan.steps.map((step, index) => (
                <View key={`${step.description}-${index}`} style={styles.stepRow}>
                  <Text style={styles.stepText}>
                    {index + 1}. {step.description}
                  </Text>
                  <Text style={styles.stepCost}>{step.cost} lv</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  emptyText: {
    color: palette.muted,
    fontSize: 14,
  },
  enchantDisabled: {
    color: '#9CA3AF',
  },
  enchantList: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  enchantMeta: {
    color: palette.muted,
    fontSize: 12,
  },
  enchantRow: {
    alignItems: 'center',
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  enchantRowCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  enchantRowActive: {
    backgroundColor: '#DFECE3',
    borderColor: '#92BCA0',
  },
  enchantTitle: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '700',
  },
  enchantToggle: {
    flex: 1,
    gap: 2,
  },
  helperText: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  itemChip: {
    alignItems: 'center',
    backgroundColor: palette.stone,
    borderColor: palette.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
  itemChipActive: {
    backgroundColor: '#DFECE3',
    borderColor: palette.primary,
  },
  itemChipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  itemChipTextActive: {
    color: palette.primaryDark,
  },
  itemChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  itemChipEmoji: {
    fontSize: 13,
    lineHeight: 15,
  },
  itemChipIcon: {
    height: 16,
    width: 16,
  },
  levelButton: {
    alignItems: 'center',
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  levelButtonText: {
    color: palette.text,
    fontSize: 18,
    lineHeight: 18,
  },
  levelControl: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  levelControlCompact: {
    gap: 6,
    marginTop: spacing.xs,
  },
  levelValue: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 13,
    minWidth: 22,
    textAlign: 'center',
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  planBox: {
    backgroundColor: '#EDE7DC',
    borderColor: palette.woodSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: 8,
    padding: spacing.sm,
  },
  planSummary: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  presetButton: {
    alignItems: 'center',
    backgroundColor: '#EDE3D7',
    borderColor: palette.woodSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
    paddingVertical: 10,
  },
  presetButtonText: {
    color: palette.secondary,
    fontFamily: font.display,
    fontSize: 12,
  },
  stepCost: {
    color: palette.primaryDark,
    fontFamily: font.display,
    fontSize: 11,
  },
  stepRow: {
    alignItems: 'flex-start',
    backgroundColor: palette.stoneSoft,
    borderColor: '#CDD8D1',
    borderRadius: radius.sm,
    borderWidth: 1,
    gap: 4,
    padding: spacing.xs,
  },
  stepText: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 18,
  },
  steps: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  selectedItemBody: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  selectedItemCard: {
    alignItems: 'center',
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    padding: spacing.sm,
  },
  selectedItemCardCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  selectedItemEmoji: {
    fontSize: 28,
    lineHeight: 32,
  },
  selectedItemIcon: {
    height: 38,
    width: 38,
  },
  selectedItemMeta: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  selectedItemTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    fontWeight: '700',
  },
  warningText: {
    color: palette.danger,
    fontSize: 13,
    marginTop: spacing.xs,
  },
});
