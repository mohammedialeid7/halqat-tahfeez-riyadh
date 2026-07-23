import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Atmosphere } from '@/components/Atmosphere';
import { FilterChips } from '@/components/FilterChips';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SearchableSelect } from '@/components/SearchableSelect';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { AGE_GROUPS, DISTRICTS, TIME_SLOTS } from '@/data/circles';
import { addCircle } from '@/lib/circlesStore';
import type { AgeGroup, TimeSlot } from '@/types/circle';

const DAY_OPTIONS = [
  { label: 'اليوم', days: 0 },
  { label: 'غداً', days: 1 },
  { label: 'بعد غد', days: 2 },
  { label: 'خلال أسبوع', days: 7 },
] as const;

const SLOT_HOURS: Record<TimeSlot, [number, number]> = {
  صباح: [9, 30],
  ظهر: [13, 15],
  عصر: [16, 30],
  مغرب: [18, 30],
  عشاء: [20, 15],
};

const districtOptions = DISTRICTS.filter((d) => d !== 'الكل');

export default function AddCircleScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [mosqueName, setMosqueName] = useState('');
  const [address, setAddress] = useState('');
  const [focus, setFocus] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [notes, setNotes] = useState('');
  const [capacity, setCapacity] = useState('20');
  const [durationMin, setDurationMin] = useState('60');
  const [district, setDistrict] = useState<string[]>(['العليا']);
  const [ageGroup, setAgeGroup] = useState<AgeGroup[]>(['كبار']);
  const [dayLabel, setDayLabel] = useState<string[]>(['اليوم']);
  const [timeSlot, setTimeSlot] = useState<TimeSlot[]>(['عصر']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startsAt = useMemo(() => {
    const day = DAY_OPTIONS.find((d) => d.label === dayLabel[0]) ?? DAY_OPTIONS[0];
    const slot = (timeSlot[0] ?? 'عصر') as TimeSlot;
    const [hour, minute] = SLOT_HOURS[slot];
    const date = new Date();
    date.setDate(date.getDate() + day.days);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
  }, [dayLabel, timeSlot]);

  const onSubmit = async () => {
    if (title.trim().length < 3) {
      setError('أدخل عنوان الحلقة');
      return;
    }
    if (mosqueName.trim().length < 2) {
      setError('أدخل اسم المسجد أو الجامع');
      return;
    }
    if (!district[0]) {
      setError('اختر الحي');
      return;
    }

    const capacityNum = Number(capacity);
    const durationNum = Number(durationMin);
    if (!Number.isFinite(capacityNum) || capacityNum < 3) {
      setError('المقاعد يجب أن تكون ٣ على الأقل');
      return;
    }
    if (!Number.isFinite(durationNum) || durationNum < 20) {
      setError('المدة يجب أن تكون ٢٠ دقيقة على الأقل');
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const circle = await addCircle({
        title,
        mosqueName,
        district: district[0],
        startsAt,
        durationMin: durationNum,
        focus,
        ageGroup: ageGroup[0] ?? 'كبار',
        capacity: capacityNum,
        address,
        teacherName,
        notes,
      });
      router.replace(`/circle/${circle.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn.duration(400)} style={styles.hero}>
              <Text style={styles.brand}>أضف حلقة</Text>
              <Text style={styles.sub}>
                أضف حلقة تحفيظ للرجال في الرياض بدون حساب. تظهر مباشرة في القائمة على جهازك.
              </Text>
            </Animated.View>

            <Field label="عنوان الحلقة" value={title} onChangeText={setTitle} placeholder="مثال: حلقة تحفيظ جزء عمّ" />
            <Field label="المسجد / الجامع" value={mosqueName} onChangeText={setMosqueName} placeholder="اسم المسجد" />
            <Field
              label="محور الحلقة (اختياري)"
              value={focus}
              onChangeText={setFocus}
              placeholder="السورة أو الجزء"
            />
            <Field
              label="اسم المعلّم (اختياري)"
              value={teacherName}
              onChangeText={setTeacherName}
              placeholder="الأستاذ …"
            />

            <View style={styles.rowFields}>
              <Field
                label="المدة (دقيقة)"
                value={durationMin}
                onChangeText={setDurationMin}
                placeholder="60"
                keyboardType="number-pad"
                compact
              />
              <Field
                label="المقاعد"
                value={capacity}
                onChangeText={setCapacity}
                placeholder="20"
                keyboardType="number-pad"
                compact
              />
            </View>

            <SearchableSelect
              label="الحي"
              options={districtOptions}
              selected={district}
              onChange={(next) => setDistrict(next.slice(-1))}
              multi={false}
              placeholder="اختر الحي"
              searchPlaceholder="ابحث عن حي…"
            />
            <FilterChips
              label="الفئة العمرية"
              options={AGE_GROUPS}
              selected={ageGroup}
              onChange={(next) => setAgeGroup((next as AgeGroup[]).slice(-1))}
              multi={false}
            />
            <FilterChips
              label="اليوم"
              options={DAY_OPTIONS.map((d) => d.label)}
              selected={dayLabel}
              onChange={(next) => setDayLabel(next.slice(-1))}
              multi={false}
            />
            <FilterChips
              label="الوقت"
              options={TIME_SLOTS}
              selected={timeSlot}
              onChange={(next) => setTimeSlot((next as TimeSlot[]).slice(-1))}
              multi={false}
            />

            <Field
              label="عنوان الحلقة التفصيلي (اختياري)"
              value={address}
              onChangeText={setAddress}
              placeholder="مثال: بجوار الباب الشرقي"
            />

            <Field
              label="ملاحظات (اختياري)"
              value={notes}
              onChangeText={setNotes}
              placeholder="تعليمات للحضور"
              multiline
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              label={saving ? 'جارٍ الحفظ…' : 'نشر الحلقة'}
              onPress={onSubmit}
              disabled={saving}
              style={styles.submit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Atmosphere>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  compact,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
  multiline?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={[styles.field, compact && styles.fieldCompact]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        textAlign="right"
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
  sub: {
    marginTop: spacing.xs,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  field: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  fieldCompact: {
    flex: 1,
    paddingHorizontal: 0,
  },
  rowFields: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  input: {
    minHeight: 50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(252, 250, 246, 0.9)',
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    writingDirection: 'rtl',
  },
  inputMultiline: {
    minHeight: 90,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  error: {
    marginHorizontal: spacing.lg,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.danger,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  submit: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
});
