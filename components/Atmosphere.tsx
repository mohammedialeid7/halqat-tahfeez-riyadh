import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  children: ReactNode;
};

/** Soft sand→green wash so screens never feel like flat white. */
export function Atmosphere({ children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.sandSoft, colors.sand, colors.greenSoft]}
        locations={[0, 0.55, 1]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.sand,
  },
  orbTop: {
    position: 'absolute',
    top: -80,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(184, 146, 74, 0.14)',
  },
  orbBottom: {
    position: 'absolute',
    bottom: 40,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(27, 77, 62, 0.08)',
  },
});
