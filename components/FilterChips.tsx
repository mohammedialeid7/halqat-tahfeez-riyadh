import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';

type Props = {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  /** When false, selecting one option replaces the previous (single-select). */
  multi?: boolean;
};

export function FilterChips({ label, options, selected, onChange, multi = true }: Props) {
  const toggle = (option: string) => {
    if (!multi) {
      onChange(selected.includes(option) && selected.length === 1 ? [] : [option]);
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }
    onChange([...selected, option]);
  };

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        style={styles.scroll}>
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => toggle(option)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  heading: {
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(252, 250, 246, 0.65)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
  chipLabelActive: {
    color: colors.textOnGreen,
  },
});
