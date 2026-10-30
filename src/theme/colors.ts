export const colors = {
  // Brand
  primary: '#3D52D5',
  primaryDark: '#2E40B8',
  primaryLight: '#EEF0FD',
  primaryMuted: '#BFC7FD',

  // Status / Outcomes
  verified: '#16A34A',
  verifiedBg: '#F0FDF4',
  verifiedBorder: '#BBF7D0',

  suspicious: '#D97706',
  suspiciousBg: '#FFFBEB',
  suspiciousBorder: '#FDE68A',

  counterfeit: '#B91C1C',
  counterfeitBg: '#FEF2F2',
  counterfeitBorder: '#FECACA',

  invalid: '#DC2626',
  invalidBg: '#FEF2F2',
  invalidBorder: '#FECACA',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSubtle: '#F3F4F6',

  // Text
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E5E7EB',
  borderFocus: '#3D52D5',
  borderError: '#B91C1C',

  // Interactive
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#D1D5DB',
  disabledText: '#9CA3AF',
};

export type ColorToken = keyof typeof colors;
