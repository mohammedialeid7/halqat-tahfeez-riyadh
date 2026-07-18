export const colors = {
  sand: '#F2EBE0',
  sandDeep: '#E5DAC8',
  sandSoft: '#F8F3EA',
  green: '#1B4D3E',
  greenDeep: '#12362C',
  greenMuted: '#2F6B56',
  greenSoft: '#D8E8DF',
  gold: '#B8924A',
  goldSoft: '#E8D5A8',
  text: '#1A2E26',
  textMuted: '#5A6B63',
  textOnGreen: '#F5F0E6',
  border: 'rgba(27, 77, 62, 0.12)',
  danger: '#8B3A3A',
  white: '#FCFAF6',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const fonts = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semiBold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
} as const;

export const shadows = {
  soft: {
    shadowColor: '#1B4D3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
} as const;
