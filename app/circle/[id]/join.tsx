import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Atmosphere } from '@/components/Atmosphere';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, radii, spacing } from '@/constants/theme';
import { getCircleById } from '@/data/circles';
import { getJoinRecord, saveJoin } from '@/lib/joins';

export default function JoinCircleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const circle = getCircleById(String(id));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkScale = useSharedValue(0.6);

  useEffect(() => {
    if (!circle) return;
    getJoinRecord(circle.id).then((record) => {
      if (record) {
        setName(record.name);
        setPhone(record.phone ?? '');
      }
    });
  }, [circle]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  if (!circle) {
    return (
      <Atmosphere>
        <View style={styles.center}>
          <Text style={styles.errorText}>هذه الحلقة غير متاحة.</Text>
        </View>
      </Atmosphere>
    );
  }

  const onSubmit = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('اكتب اسمك بالكامل');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await saveJoin(circle.id, trimmed, phone);
      setDone(true);
      checkScale.value = withSequence(
        withTiming(1.12, { duration: 180 }),
        withTiming(1, { duration: 160 }),
      );
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Atmosphere>
        <View style={styles.center}>
          <Animated.View entering={ZoomIn.duration(380)} style={[styles.check, checkStyle]}>
            <Text style={styles.checkMark}>✓</Text>
          </Animated.View>
          <Animated.Text entering={FadeIn.delay(120)} style={styles.successTitle}>
            تم الانضمام
          </Animated.Text>
          <Text style={styles.successBody}>
            سجّلنا انضمامك إلى «{circle.title}». لا تحتاج حساباً — احتفظ بالتطبيق للتذكير.
          </Text>
          <PrimaryButton
            label="العودة للحلقة"
            onPress={() => router.replace(`/circle/${circle.id}`)}
            style={styles.successBtn}
          />
          <PrimaryButton
            label="كل الحلقات"
            variant="ghost"
            onPress={() => router.replace('/')}
          />
        </View>
      </Atmosphere>
    );
  }

  return (
    <Atmosphere>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Text style={styles.lead}>
            انضم إلى {circle.title} بدون تسجيل. اسمك يكفي، والجوال اختياري للتواصل.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>الاسم</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="مثال: عبدالله محمد"
              placeholderTextColor={colors.textMuted}
              textAlign="right"
              style={styles.input}
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>الجوال (اختياري)</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="05xxxxxxxx"
              placeholderTextColor={colors.textMuted}
              textAlign="right"
              keyboardType="phone-pad"
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <PrimaryButton
            label={saving ? 'جارٍ الحفظ…' : 'تأكيد الانضمام'}
            onPress={onSubmit}
            disabled={saving}
          />
        </View>
      </KeyboardAvoidingView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  form: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  lead: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  field: {
    gap: spacing.xs,
    alignItems: 'stretch',
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  input: {
    minHeight: 52,
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
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.danger,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  checkMark: {
    color: colors.textOnGreen,
    fontSize: 40,
    fontFamily: fonts.bold,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.greenDeep,
    writingDirection: 'rtl',
  },
  successBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'center',
    maxWidth: 300,
  },
  successBtn: {
    alignSelf: 'stretch',
    marginTop: spacing.md,
  },
});
