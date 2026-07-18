import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, fonts, radii, spacing } from '@/constants/theme';
import { DISTRICTS } from '@/data/circles';

type Props = {
  value: string;
  onChange: (district: string) => void;
};

export function DistrictFilter({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}>
      {DISTRICTS.map((district) => {
        const active = district === value;
        return (
          <Pressable
            key={district}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(district)}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.label, active && styles.labelActive]}>{district}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
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
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
  labelActive: {
    color: colors.textOnGreen,
  },
});
