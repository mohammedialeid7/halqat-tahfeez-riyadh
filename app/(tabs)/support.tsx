import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Atmosphere } from '@/components/Atmosphere';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, fonts, spacing } from '@/constants/theme';

const SUPPORT_WHATSAPP = 'https://wa.me/966500000000';
const SUPPORT_EMAIL = 'mailto:support@halqat-riyadh.app?subject=دعم%20حلقات%20تحفيظ%20الرياض';

export default function SupportScreen() {
  return (
    <Atmosphere>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
          <Text style={styles.brand}>الدعم</Text>
          <Text style={styles.sub}>
            نحن هنا للمساعدة في الحلقات أو البلاغات أو اقتراحات تحسين التطبيق.
          </Text>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>تواصل معنا</Text>
            <Text style={styles.blockBody}>
              راسلنا عبر واتساب أو البريد وسنرد في أقرب وقت ممكن.
            </Text>
            <PrimaryButton
              label="واتساب الدعم"
              onPress={() => Linking.openURL(SUPPORT_WHATSAPP)}
              style={styles.btn}
            />
            <PrimaryButton
              label="البريد الإلكتروني"
              variant="secondary"
              onPress={() => Linking.openURL(SUPPORT_EMAIL)}
            />
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>بلاغ عن حلقة</Text>
            <Text style={styles.blockBody}>
              إذا وجدت معلومات غير صحيحة أو حلقة غير مناسبة، أرسل اسم الحلقة والمسجد عبر واتساب.
            </Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>عن التطبيق</Text>
            <Text style={styles.blockBody}>
              حلقات تحفيظ الرياض للرجال فقط، بدون تسجيل حساب. إضافة الحلقة تُحفظ على جهازك في هذه
              المرحلة.
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Atmosphere>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'flex-end',
    gap: spacing.lg,
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 40,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textMuted,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
    marginTop: -spacing.sm,
  },
  block: {
    width: '100%',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  blockTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.greenDeep,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  blockBody: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    writingDirection: 'rtl',
    textAlign: 'right',
    width: '100%',
  },
  btn: {
    alignSelf: 'stretch',
    marginTop: spacing.xs,
  },
});
