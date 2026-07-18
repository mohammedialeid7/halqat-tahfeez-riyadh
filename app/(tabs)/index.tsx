import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { Atmosphere } from '@/components/Atmosphere';
import { CircleListItem } from '@/components/CircleListItem';
import { FilterChips } from '@/components/FilterChips';
import { SearchableSelect } from '@/components/SearchableSelect';
import { colors, fonts, spacing } from '@/constants/theme';
import { AGE_GROUPS, DISTRICTS, TIME_SLOTS, getTimeSlot } from '@/data/circles';
import { getAllCircles } from '@/lib/circlesStore';
import { getJoinedCircleIds } from '@/lib/joins';
import type { AgeGroup, Circle, TimeSlot } from '@/types/circle';

export default function HomeScreen() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getAllCircles(), getJoinedCircleIds()]).then(([all, ids]) => {
        if (!active) return;
        setCircles(all);
        setJoinedIds(ids);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const districtOptions = useMemo(() => DISTRICTS.filter((d) => d !== 'الكل'), []);

  const data = useMemo(() => {
    return circles
      .filter((circle) => {
        if (districts.length > 0 && !districts.includes(circle.district)) {
          return false;
        }
        if (ageGroups.length > 0 && !ageGroups.includes(circle.ageGroup)) {
          return false;
        }
        if (timeSlots.length > 0 && !timeSlots.includes(getTimeSlot(circle.startsAt))) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [ageGroups, circles, districts, timeSlots]);

  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <FlatList
          style={styles.listRoot}
          data={data}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Animated.View entering={FadeIn.duration(500)}>
              <View style={styles.hero}>
                <Text style={styles.brand}>حلقات تحفيظ الرياض</Text>
                <Text style={styles.headline}>حلقات رجال قريبة منك</Text>
                <Text style={styles.sub}>
                  تصفّح حلقات تحفيظ الرجال في الرياض وانضم بلا تسجيل.
                </Text>
              </View>

              <View style={styles.filters}>
                <SearchableSelect
                  label="الحي"
                  options={districtOptions}
                  selected={districts}
                  onChange={setDistricts}
                  multi
                  placeholder="كل الأحياء"
                  searchPlaceholder="ابحث عن حي…"
                />
                <FilterChips
                  label="الفئة العمرية"
                  options={AGE_GROUPS}
                  selected={ageGroups}
                  onChange={(next) => setAgeGroups(next as AgeGroup[])}
                  multi
                />
                <FilterChips
                  label="الوقت"
                  options={TIME_SLOTS}
                  selected={timeSlots}
                  onChange={(next) => setTimeSlots(next as TimeSlot[])}
                  multi
                />
              </View>
            </Animated.View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>لا حلقات مطابقة للفلاتر</Text>
              <Text style={styles.emptyBody}>جرّب إلغاء بعض الاختيارات أو أضف حلقة جديدة.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={styles.itemWrap}>
              <CircleListItem
                circle={item}
                index={index}
                joined={joinedIds.includes(item.id)}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  listRoot: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    alignItems: 'flex-end',
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 40,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  headline: {
    marginTop: spacing.sm,
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  sub: {
    marginTop: spacing.xs,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
    maxWidth: 340,
  },
  filters: {
    paddingBottom: spacing.xs,
  },
  list: {
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  itemWrap: {
    paddingHorizontal: spacing.lg,
  },
  empty: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.text,
    writingDirection: 'rtl',
  },
  emptyBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
});
