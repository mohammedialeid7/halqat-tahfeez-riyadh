import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/constants/theme';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={[styles.label, focused && styles.labelFocused]} numberOfLines={1}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarLabel: ({ focused }) => <TabLabel label="الرئيسية" focused={focused} />,
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>⌂</Text>,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'أضف حلقة',
          tabBarLabel: ({ focused }) => <TabLabel label="أضف حلقة" focused={focused} />,
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>＋</Text>,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'الدعم',
          tabBarLabel: ({ focused }) => <TabLabel label="الدعم" focused={focused} />,
          tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>؟</Text>,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.sandSoft,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 68,
    paddingTop: 6,
    paddingBottom: 8,
  },
  item: {
    gap: 2,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    writingDirection: 'rtl',
  },
  labelFocused: {
    color: colors.green,
    fontFamily: fonts.semiBold,
  },
  icon: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
  },
});
