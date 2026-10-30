import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Bell, ChevronLeft, ShieldCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface TopNavBarProps {
  type?: 'main' | 'inner';
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  type = 'main',
  title = 'Veryfy Retailer',
  subtitle,
  onBackPress,
  onNotificationPress,
  hasUnreadNotifications = true,
  rightAction,
  style,
}) => {
  if (type === 'inner') {
    return (
      <View style={[styles.innerContainer, style]}>
        <Pressable
          onPress={onBackPress}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.innerTitleContainer}>
          <Text style={styles.innerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.innerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.rightActionContainer}>
          {rightAction || <View style={{ width: 40 }} />}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, style]}>
      <View style={styles.mainLeft}>
        <View style={styles.brandBadge}>
          <ShieldCheck size={18} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.mainTitle}>{title}</Text>
          {subtitle && <Text style={styles.mainSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.mainRight}>
        {onNotificationPress && (
          <Pressable
            onPress={onNotificationPress}
            style={({ pressed }) => [styles.notificationBtn, pressed && styles.pressed]}
            hitSlop={8}
          >
            <Bell size={20} color={colors.textPrimary} />
            {hasUnreadNotifications && <View style={styles.unreadDot} />}
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mainLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  mainTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  mainSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mainRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.counterfeit,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // Inner top nav
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  innerTitle: {
    ...typography.subtitle,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  innerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightActionContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  pressed: {
    opacity: 0.7,
  },
});
