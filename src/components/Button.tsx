import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        disabled && styles[`${variant}Disabled`],
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary' || variant === 'destructive'
              ? colors.white
              : colors.primary
          }
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? <>{icon}</> : null}
          <Text
            style={[
              styles.textBase,
              styles[`${size}Text`],
              styles[`${variant}Text`],
              disabled && styles[`${variant}DisabledText`],
              icon && iconPosition === 'left' ? { marginLeft: spacing.sm } : null,
              icon && iconPosition === 'right' ? { marginRight: spacing.sm } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' ? <>{icon}</> : null}
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  // Sizes
  small: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 34,
  },
  medium: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.base,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    minHeight: 52,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryDisabled: {
    backgroundColor: colors.disabled,
  },

  secondary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  secondaryPressed: {
    backgroundColor: '#D9DCFA',
  },
  secondaryDisabled: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },

  destructive: {
    backgroundColor: colors.counterfeit,
  },
  destructivePressed: {
    backgroundColor: '#991B1B',
  },
  destructiveDisabled: {
    backgroundColor: colors.disabled,
  },

  ghost: {
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: colors.surfaceSubtle,
  },
  ghostDisabled: {
    backgroundColor: 'transparent',
  },

  // Text
  textBase: {
    ...typography.bodyBold,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 13,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },

  primaryText: {
    color: colors.white,
  },
  primaryDisabledText: {
    color: colors.disabledText,
  },

  secondaryText: {
    color: colors.primary,
  },
  secondaryDisabledText: {
    color: colors.disabledText,
  },

  destructiveText: {
    color: colors.white,
  },
  destructiveDisabledText: {
    color: colors.disabledText,
  },

  ghostText: {
    color: colors.primary,
  },
  ghostDisabledText: {
    color: colors.disabledText,
  },
});
