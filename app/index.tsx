import { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import { Atmosphere } from '@/components/Atmosphere';
import { CircleListItem } from '@/components/CircleListItem';
import { DistrictFilter } from '@/components/DistrictFilter';
import { colors, fonts, spacing } from '@/constants/theme';
import { CIRCLES } from '@/data/circles';
import { getJoinedCircleIds } from '@/lib/joins';

export default function HomeScreen() {
  const [district, setDistrict] = useState('الكل');
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getJoinedCircleIds().then((ids) => {
        if (active) setJoinedIds(ids);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const data = CIRCLES.filter((c) => district === 'الكل' || c.district === district).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.hero}>
          <Text style={styles.brand}>حلقات تحفيظ الرياض</Text>
          <Text style={styles.headline}>حلقات رجال قريبة منك</Text>
          <Text style={styles.sub}>
            تصفّح حلقات تحفيظ الرجال في الرياض وانضم بلا تسجيل.
          </Text>
        </Animated.View>

        <DistrictFilter value={district} onChange={setDistrict} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>لا حلقات في هذا الحي حالياً</Text>
              <Text style={styles.emptyBody}>جرّب حيّاً آخر أو عد لاحقاً.</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <CircleListItem
              circle={item}
              index={index}
              joined={joinedIds.includes(item.id)}
            />
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
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
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
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  empty: {
    paddingTop: spacing.xxl,
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
