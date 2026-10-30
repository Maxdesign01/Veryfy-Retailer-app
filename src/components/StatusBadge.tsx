import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { VerificationOutcome } from '../types';

interface StatusBadgeProps {
  status: VerificationOutcome;
  label?: string;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'medium',
  style,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'verified':
        return {
          bg: colors.verifiedBg,
          border: colors.verifiedBorder,
          text: colors.verified,
          defaultLabel: 'Verified Genuine',
          icon: <CheckCircle2 size={size === 'small' ? 12 : 14} color={colors.verified} />,
        };
      case 'suspicious':
        return {
          bg: colors.suspiciousBg,
          border: colors.suspiciousBorder,
          text: colors.suspicious,
          defaultLabel: 'Suspicious Batch',
          icon: <AlertTriangle size={size === 'small' ? 12 : 14} color={colors.suspicious} />,
        };
      case 'counterfeit':
        return {
          bg: colors.counterfeitBg,
          border: colors.counterfeitBorder,
          text: colors.counterfeit,
          defaultLabel: 'Counterfeit Alert',
          icon: <XCircle size={size === 'small' ? 12 : 14} color={colors.counterfeit} />,
        };
      case 'invalid':
      default:
        return {
          bg: colors.invalidBg,
          border: colors.invalidBorder,
          text: colors.invalid,
          defaultLabel: 'Invalid Code',
          icon: <AlertCircle size={size === 'small' ? 12 : 14} color={colors.invalid} />,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        size === 'small' && styles.smallBadge,
        { backgroundColor: config.bg, borderColor: config.border },
        style,
      ]}
    >
      {config.icon}
      <Text
        style={[
          styles.text,
          size === 'small' && styles.smallText,
          { color: config.text },
        ]}
      >
        {label || config.defaultLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
  },
  text: {
    ...typography.captionMedium,
    marginLeft: spacing.xs,
    textTransform: 'capitalize',
  },
  smallText: {
    fontSize: 11,
    lineHeight: 14,
  },
});
