import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SectionCard } from '../components/SectionCard';
import { villagerCoreRules, villagerJobGuides } from '../data/villagerJobs';
import { workTableRecipes } from '../data/workTables';
import { useDeviceClass } from '../responsive';
import { font, palette, radius, spacing } from '../theme';

type RoleFilter = 'all' | 'with_job' | 'without_job';

const roleFilters: Array<{ id: RoleFilter; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'with_job', label: 'Con trabajo' },
  { id: 'without_job', label: 'Sin trabajo' },
];

export function VillagersScreen() {
  const deviceClass = useDeviceClass();
  const compact = deviceClass === 'mobile';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RoleFilter>('all');

  const filteredJobs = useMemo(() => {
    const clean = query.trim().toLowerCase();
    return villagerJobGuides.filter((job) => {
      if (filter === 'with_job' && !job.workstationId) {
        return false;
      }
      if (filter === 'without_job' && job.workstationId) {
        return false;
      }
      if (!clean) {
        return true;
      }
      const searchable = [
        job.profession,
        job.workstation,
        ...job.buysForEmeralds,
        ...job.sellsHighlights,
        ...job.notes,
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(clean);
    });
  }, [filter, query]);

  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.contentCompact]} style={styles.page}>
      <SectionCard
        subtitle="Todo sobre trabajos de aldeanos: profesión, mesa que usan, trades y tips de uso"
        title="Guía De Aldeanos"
      >
        <Text style={styles.metaText}>Usa búsqueda por profesión, mesa o trade (ej: bibliotecario, atril, palos).</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setQuery}
          placeholder="Ej: bibliotecario, compostador, carne podrida..."
          placeholderTextColor={palette.muted}
          style={[styles.input, compact && styles.inputCompact]}
          value={query}
        />

        <View style={styles.filtersRow}>
          {roleFilters.map((option) => {
            const active = option.id === filter;
            return (
              <Pressable
                key={option.id}
                onPress={() => setFilter(option.id)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.metaText}>Resultados: {filteredJobs.length}</Text>
      </SectionCard>

      <SectionCard subtitle="Mecánicas clave de comercio y profesión" title="Reglas Rápidas">
        <View style={styles.rulesWrap}>
          {villagerCoreRules.map((rule) => (
            <View key={rule.id} style={styles.ruleCard}>
              <Text style={styles.ruleTitle}>{rule.title}</Text>
              <Text style={styles.ruleValue}>{rule.value}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard subtitle="Todas las profesiones y su mesa de trabajo" title="Trabajos De Aldeanos">
        <View style={styles.jobsWrap}>
          {filteredJobs.map((job) => {
            const recipe = job.workstationId ? workTableRecipes.find((entry) => entry.id === job.workstationId) : undefined;
            return (
              <View key={job.id} style={styles.jobCard}>
                <Text style={styles.jobTitle}>{job.profession}</Text>
                <Text style={styles.jobStation}>Mesa/Bloque: {job.workstation}</Text>

                <Text style={styles.blockTitle}>Te compra (para esmeraldas)</Text>
                {job.buysForEmeralds.map((item, index) => (
                  <Text key={`${job.id}-buy-${index}`} style={styles.blockLine}>
                    • {item}
                  </Text>
                ))}

                <Text style={styles.blockTitle}>Te vende (destacado)</Text>
                {job.sellsHighlights.map((item, index) => (
                  <Text key={`${job.id}-sell-${index}`} style={styles.blockLine}>
                    • {item}
                  </Text>
                ))}

                <Text style={styles.blockTitle}>Tips</Text>
                {job.notes.map((item, index) => (
                  <Text key={`${job.id}-note-${index}`} style={styles.blockLine}>
                    • {item}
                  </Text>
                ))}

                {recipe ? (
                  <View style={styles.recipeBox}>
                    <Text style={styles.recipeTitle}>Receta rápida de {recipe.name}</Text>
                    {recipe.ingredients.map((ingredient, index) => (
                      <Text key={`${job.id}-recipe-${index}`} style={styles.recipeLine}>
                        • {ingredient}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  blockLine: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  blockTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
    marginTop: spacing.xs,
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
  filterChip: {
    backgroundColor: palette.stone,
    borderColor: palette.border,
    borderRadius: radius.chip,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: '#DEECE3',
    borderColor: palette.primary,
  },
  filterChipText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: palette.primaryDark,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
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
  jobCard: {
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  jobsWrap: {
    gap: spacing.sm,
  },
  jobStation: {
    color: palette.secondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  jobTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 13,
    fontWeight: '700',
  },
  metaText: {
    color: palette.secondary,
    fontSize: 11,
    lineHeight: 16,
  },
  page: {
    backgroundColor: palette.appBackground,
    flex: 1,
  },
  recipeBox: {
    backgroundColor: '#EDF3EF',
    borderColor: '#B8C8BE',
    borderRadius: radius.sm,
    borderWidth: 1,
    marginTop: spacing.sm,
    padding: spacing.xs,
  },
  recipeLine: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  recipeTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
    marginBottom: 3,
  },
  ruleCard: {
    backgroundColor: '#E7EEE9',
    borderColor: '#B8C8BE',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
    width: '49%',
  },
  rulesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'space-between',
  },
  ruleTitle: {
    color: palette.text,
    fontFamily: font.display,
    fontSize: 11,
  },
  ruleValue: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
  },
});
