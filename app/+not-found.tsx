import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'غير موجود' }} />
      <View style={styles.container}>
        <Text style={styles.title}>هذه الصفحة غير موجودة</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>العودة للحلقات</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.sand,
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.text,
    writingDirection: 'rtl',
  },
  link: {
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.green,
    writingDirection: 'rtl',
  },
});
