import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';
import { formatCircleWhen } from '@/data/circles';
import type { Circle } from '@/types/circle';

type Props = {
  circle: Circle;
  index: number;
  joined?: boolean;
};

export function CircleListItem({ circle, index, joined }: Props) {
  const { dayLabel, timeLabel } = formatCircleWhen(circle.startsAt);
  const seatsLeft = Math.max(circle.capacity - circle.joinedCount, 0);

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(18)}>
      <Link href={`/circle/${circle.id}`} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${circle.title}، ${dayLabel} ${timeLabel}`}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
          <View style={styles.timeBlock}>
            <Text style={styles.day}>{dayLabel}</Text>
            <Text style={styles.time}>{timeLabel}</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={1}>
              {circle.title}
            </Text>
            <Text style={styles.meta} numberOfLines={1}>
              {circle.mosqueName} · {circle.district} · {circle.ageGroups.join(' · ')}
            </Text>
            <View style={styles.footer}>
              {circle.focus ? (
                <Text style={styles.focus} numberOfLines={1}>
                  {circle.focus}
                </Text>
              ) : (
                <View style={styles.focus} />
              )}
              <Text style={styles.seats}>
                {joined ? 'منضمّ' : `${seatsLeft} مقعد`}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(252, 250, 246, 0.78)',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  timeBlock: {
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.green,
  },
  day: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.goldSoft,
    writingDirection: 'rtl',
  },
  time: {
    marginTop: 2,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textOnGreen,
    writingDirection: 'rtl',
  },
  body: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
  },
  footer: {
    marginTop: 4,
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  focus: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.greenMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  seats: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.gold,
    writingDirection: 'rtl',
  },
});
