import { useCallback, useState } from 'react';
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { Atmosphere } from '@/components/Atmosphere';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { formatCircleWhen } from '@/data/circles';
import { findCircleById } from '@/lib/circlesStore';
import { getJoinRecord } from '@/lib/joins';
import type { Circle } from '@/types/circle';

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [circle, setCircle] = useState<Circle | null | undefined>(undefined);
  const [joinedName, setJoinedName] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      findCircleById(String(id)).then((found) => {
        if (!active) return;
        setCircle(found ?? null);
        if (!found) return;
        getJoinRecord(found.id).then((record) => {
          if (active) setJoinedName(record?.name ?? null);
        });
      });
      return () => {
        active = false;
      };
    }, [id]),
  );

  if (circle === undefined) {
    return (
      <Atmosphere>
        <View />
      </Atmosphere>
    );
  }

  if (!circle) {
    return (
      <Atmosphere>
        <View style={styles.missing}>
          <Text style={styles.missingText}>هذه الحلقة غير متاحة.</Text>
          <PrimaryButton label="العودة" onPress={() => router.replace('/')} />
        </View>
      </Atmosphere>
    );
  }

  const { dayLabel, timeLabel } = formatCircleWhen(circle.startsAt);
  const seatsLeft = Math.max(circle.capacity - circle.joinedCount, 0);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${circle.lat},${circle.lng}`;

  const shareCircle = async () => {
    const message = [
      `حلقات تحفيظ الرياض`,
      circle.title,
      `${circle.mosqueName} — ${circle.district}`,
      `${dayLabel} · ${timeLabel}`,
      circle.address,
    ]
      .filter(Boolean)
      .join('\n');
    await Share.share({ message });
  };

  return (
    <Atmosphere>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)} style={styles.heroBlock}>
          <Text style={styles.when}>
            {dayLabel} · {timeLabel}
          </Text>
          <Text style={styles.title}>{circle.title}</Text>
          <Text style={styles.place}>
            {circle.mosqueName} — {circle.district}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(420)} style={styles.facts}>
          <Fact label="المدة" value={`${circle.durationMin} دقيقة`} />
          <Fact label="الفئة العمرية" value={circle.ageGroup} />
          <Fact label="التركيز" value={circle.focus} />
          <Fact label="المقاعد" value={`${seatsLeft} من ${circle.capacity}`} />
          {circle.teacherName ? <Fact label="المعلّم" value={circle.teacherName} /> : null}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(420)} style={styles.section}>
          <Text style={styles.sectionTitle}>الموقع</Text>
          <Text style={styles.sectionBody}>
            {circle.address?.trim() ? circle.address : `حي ${circle.district}`}
          </Text>
          <PrimaryButton
            label="فتح الخريطة"
            variant="secondary"
            onPress={() => Linking.openURL(mapsUrl)}
            style={styles.mapBtn}
          />
        </Animated.View>

        {circle.notes ? (
          <Animated.View entering={FadeInUp.delay(260).duration(420)} style={styles.section}>
            <Text style={styles.sectionTitle}>ملاحظات</Text>
            <Text style={styles.sectionBody}>{circle.notes}</Text>
          </Animated.View>
        ) : null}

        {joinedName ? (
          <View style={styles.joinedBanner}>
            <Text style={styles.joinedText}>أنت منضمّ باسم {joinedName}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton
            label={joinedName ? 'تعديل الانضمام' : 'انضم للحلقة'}
            onPress={() => router.push(`/circle/${circle.id}/join`)}
          />
          <PrimaryButton label="مشاركة" variant="ghost" onPress={shareCircle} />
        </View>
      </ScrollView>
    </Atmosphere>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  heroBlock: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  when: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.gold,
    writingDirection: 'rtl',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 38,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  place: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  facts: {
    borderRadius: radii.lg,
    backgroundColor: 'rgba(252, 250, 246, 0.8)',
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  fact: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  factLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
  factValue: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  section: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.greenDeep,
    writingDirection: 'rtl',
  },
  sectionBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
  },
  mapBtn: {
    alignSelf: 'stretch',
    marginTop: spacing.xs,
  },
  joinedBanner: {
    backgroundColor: colors.greenSoft,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  joinedText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  missingText: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.text,
    writingDirection: 'rtl',
  },
});
