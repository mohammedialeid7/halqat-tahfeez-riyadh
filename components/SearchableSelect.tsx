import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radii, spacing } from '@/constants/theme';

type Props = {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  multi?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
};

export function SearchableSelect({
  label,
  options,
  selected,
  onChange,
  multi = true,
  placeholder = 'اختر…',
  searchPlaceholder = 'ابحث…',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return [...options];
    return options.filter((option) => option.includes(q));
  }, [options, query]);

  const summary = useMemo(() => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0];
    return `${selected.length} أحياء محددة`;
  }, [placeholder, selected]);

  const toggle = (option: string) => {
    if (!multi) {
      onChange([option]);
      setOpen(false);
      setQuery('');
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }
    onChange([...selected, option]);
  };

  const clearAll = () => {
    onChange([]);
  };

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${summary}`}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
        <Text style={styles.chevron}>▾</Text>
        <Text
          style={[styles.triggerText, selected.length === 0 && styles.triggerPlaceholder]}
          numberOfLines={1}>
          {summary}
        </Text>
      </Pressable>

      {multi && selected.length > 0 ? (
        <View style={styles.selectedRow}>
          {selected.map((item) => (
            <Pressable
              key={item}
              onPress={() => onChange(selected.filter((value) => value !== item))}
              style={styles.selectedChip}
              accessibilityRole="button"
              accessibilityLabel={`إزالة ${item}`}>
              <Text style={styles.selectedChipText}>{item} ×</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={close}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropHit} onPress={close} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <View style={styles.sheetHeader}>
              <Pressable onPress={close} hitSlop={12}>
                <Text style={styles.done}>تم</Text>
              </Pressable>
              <Text style={styles.sheetTitle}>{label}</Text>
              {multi ? (
                <Pressable onPress={clearAll} hitSlop={12} disabled={selected.length === 0}>
                  <Text
                    style={[
                      styles.clear,
                      selected.length === 0 && styles.clearDisabled,
                    ]}>
                    مسح
                  </Text>
                </Pressable>
              ) : (
                <View style={styles.clearSpacer} />
              )}
            </View>

            <View style={styles.searchWrap}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textMuted}
                textAlign="right"
                autoCorrect={false}
                autoFocus
                style={styles.search}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>لا نتائج مطابقة لـ «{query.trim()}»</Text>
              }
              renderItem={({ item }) => {
                const active = selected.includes(item);
                return (
                  <Pressable
                    onPress={() => toggle(item)}
                    style={[styles.option, active && styles.optionActive]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.check, !active && styles.checkHidden]}>
                      {multi ? '✓' : '●'}
                    </Text>
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  trigger: {
    minHeight: 50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(252, 250, 246, 0.9)',
    paddingHorizontal: spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  triggerPressed: {
    opacity: 0.9,
  },
  triggerText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  triggerPlaceholder: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  chevron: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.greenMuted,
  },
  selectedRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  selectedChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedChipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.greenDeep,
    writingDirection: 'rtl',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(18, 54, 44, 0.35)',
  },
  backdropHit: {
    flex: 1,
  },
  sheet: {
    maxHeight: '78%',
    backgroundColor: colors.sandSoft,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    paddingTop: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.greenDeep,
    writingDirection: 'rtl',
  },
  done: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.green,
    writingDirection: 'rtl',
    minWidth: 48,
    textAlign: 'left',
  },
  clear: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.gold,
    writingDirection: 'rtl',
    minWidth: 48,
    textAlign: 'right',
  },
  clearDisabled: {
    opacity: 0.35,
  },
  clearSpacer: {
    minWidth: 48,
  },
  searchWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  search: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    writingDirection: 'rtl',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  option: {
    minHeight: 48,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: 'rgba(216, 232, 223, 0.45)',
    marginHorizontal: -spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  optionText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  optionTextActive: {
    fontFamily: fonts.semiBold,
    color: colors.greenDeep,
  },
  check: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.green,
    width: 18,
    textAlign: 'center',
  },
  checkHidden: {
    opacity: 0,
  },
  empty: {
    paddingVertical: spacing.xl,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
});
