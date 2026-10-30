import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export type ToastType = 'success' | 'warning' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
}

export const Toast: React.FC<ToastProps> = ({ type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color={colors.verified} />;
      case 'warning':
        return <AlertTriangle size={20} color={colors.suspicious} />;
      case 'error':
      default:
        return <AlertCircle size={20} color={colors.counterfeit} />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return colors.verified;
      case 'warning':
        return colors.suspicious;
      case 'error':
      default:
        return colors.counterfeit;
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getBorderColor() }]}>
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: spacing.xs,
  },
  iconContainer: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
