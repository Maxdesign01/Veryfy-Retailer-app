import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react-native';
import { TopNavBar } from '../../components/TopNavBar';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface NotificationItem {
  id: string;
  type: 'alert' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
}

const mockNotifications: NotificationItem[] = [
  {
    id: 'n-01',
    type: 'warning',
    title: 'Cluster Alert: Amoxil 500mg Batch FAKE-AMX-001',
    message: 'Multiple retailers in Ikeja reported counterfeit Amoxil cartons with defective holographic seals. Check your current stock.',
    time: '2 hours ago',
    isUnread: true,
  },
  {
    id: 'n-02',
    type: 'success',
    title: 'Report Reviewed: VFY-RP-10482',
    message: 'Your report regarding suspected counterfeit antibiotics was reviewed and verified by Veryfy enforcement.',
    time: 'Yesterday',
    isUnread: false,
  },
  {
    id: 'n-03',
    type: 'info',
    title: 'NAFDAC Database Synchronized',
    message: 'Monthly product registration catalog updated for 42 newly approved pharmaceutical formulations.',
    time: '3 days ago',
    isUnread: false,
  },
];

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={20} color={colors.counterfeit} />;
      case 'warning':
        return <AlertTriangle size={20} color={colors.suspicious} />;
      case 'success':
        return <CheckCircle2 size={20} color={colors.verified} />;
      case 'info':
      default:
        return <Info size={20} color={colors.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      <TopNavBar
        type="inner"
        title="Notifications & Alerts"
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, item.isUnread && styles.unreadCard]}>
            <View style={styles.iconBox}>{getIcon(item.type)}</View>
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.isUnread && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.base,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  unreadCard: {
    borderColor: colors.primaryLight,
    backgroundColor: '#FAFBFD',
  },
  iconBox: {
    marginRight: spacing.md,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
