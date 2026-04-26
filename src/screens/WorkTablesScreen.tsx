import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { workTableRecipes } from '../data/workTables';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

export function WorkTablesScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return workTableRecipes;
    }
    return workTableRecipes.filter(
      (entry) => entry.name.toLowerCase().includes(clean) || entry.purpose.toLowerCase().includes(clean),
    );
  }, [query]);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Recetas de mesas/bloques de trabajo para aldeanos y utilidad general"
        title="Mesas De Trabajo"
      >
        <Text style={styles.metaText}>
          Basado en tu referencia de video + recetas oficiales de Minecraft. Busca por nombre o profesión.
        </Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setQuery}
          placeholder="Ej: bibliotecario, flechas, herreria..."
          placeholderTextColor={palette.muted}
          style={[styles.input, compact && styles.inputCompact]}
          value={query}
        />
        <Text style={styles.metaText}>Resultados: {filtered.length}</Text>
      </SectionCard>

      <SectionCard subtitle="Cada receta se muestra en patrón 3x3" title="Listado De Mesas">
        <View style={styles.listWrap}>
          {filtered.map((entry) => {
            const rowA = entry.pattern.slice(0, 3);
            const rowB = entry.pattern.slice(3, 6);
            const rowC = entry.pattern.slice(6, 9);
            return (
              <View key={entry.id} style={styles.tableCard}>
                <Text style={styles.tableName}>{entry.name}</Text>
                <Text style={styles.tablePurpose}>{entry.purpose}</Text>

                <View style={styles.recipeGrid}>
                  {[rowA, rowB, rowC].map((row, rowIndex) => (
                    <View key={`${entry.id}-row-${rowIndex}`} style={styles.recipeRow}>
                      {row.map((cell, colIndex) => (
                        <View key={`${entry.id}-cell-${rowIndex}-${colIndex}`} style={styles.recipeCell}>
                          <Text numberOfLines={2} style={styles.recipeCellText}>
                            {cell || '—'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>

                <Text style={styles.ingredientsTitle}>Ingredientes:</Text>
                {entry.ingredients.map((ingredient, idx) => (
                  <Text key={`${entry.id}-ing-${idx}`} style={styles.ingredientItem}>
                    • {ingredient}
                  </Text>
                ))}

                {entry.notes ? <Text style={styles.notesText}>Nota: {entry.notes}</Text> : null}
              </View>
            );
          })}
        </View>
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
  ingredientItem: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  ingredientsTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  input: {
    backgroundColor: palette.stoneSoft,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: palette.text,
    fontSize: 13,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  inputCompact: {
    fontSize: 12,
  },
  listWrap: {
    gap: spacing.sm,
  },
  metaText: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 16,
  },
  notesText: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: spacing.xs,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  recipeCell: {
    alignItems: 'center',
    backgroundColor: '#E8EFEA',
    borderColor: '#AEC0B3',
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 4,
    width: '31.5%',
  },
  recipeCellText: {
    color: palette.text,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
  },
  recipeGrid: {
    gap: 4,
    marginTop: spacing.xs,
  },
  recipeRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  tableCard: {
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  tableName: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 13,
    fontWeight: '700',
  },
  tablePurpose: {
    color: palette.secondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
});
