import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { HistoryIcon } from '../../components/icons/HistoryIcon';
import { SuspiciousBadgeIcon } from '../../components/icons/SuspiciousBadgeIcon';
import { mockReports } from '../../api/mockData';
import { ProductReport } from '../../types';

interface ReportDetailsScreenProps {
  navigation: any;
  route: any;
}

export const ReportDetailsScreen: React.FC<ReportDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const reportId = route?.params?.reportId;
  const report: ProductReport =
    mockReports.find((r) => r.id === reportId || r.reportId === reportId) ||
    mockReports[0];

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', { screen: 'Reports' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* TopBar (Frame 503:3904) */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowBackIcon size={24} color="#0A0A0A" />
        </Pressable>
        <Text style={styles.topBarTitle}>Report details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content Header (Frame 503:3910) */}
        <View style={styles.contentHeader}>
          <Text style={styles.reportCodeText}>
            Report {report.reportId || 'VFY-RP-10482'}
          </Text>
          <Text style={styles.productNameTitle}>
            {report.productName || 'PureGlow Face Cream'}
          </Text>
          <Text style={styles.submittedDateText}>
            Submitted {report.dateSubmitted || '12 June 2025'}
          </Text>
        </View>

        {/* StatusCard (Frame 503:3916) */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconWrapper}>
            <HistoryIcon size={20} color="#D97706" />
          </View>
          <View style={styles.statusTextCol}>
            <Text style={styles.statusLabelText}>Current Status</Text>
            <Text style={styles.statusValueText}>
              {report.status === 'Open' ? 'Under review' : report.status}
            </Text>
          </View>
        </View>

        {/* SummarySection (Frame 503:3922) */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryHeading}>Report summary</Text>

          {/* Row 1: Reason */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={styles.detailValue}>
              {report.category || 'Product source is unclear'}
            </Text>
          </View>
          <View style={styles.divider} />

          {/* Row 2: Category */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>Cosmetics</Text>
          </View>
          <View style={styles.divider} />

          {/* Row 3: Verification Result */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Verification result</Text>
            <View style={styles.suspiciousBadge}>
              <SuspiciousBadgeIcon size={14} color="#92400E" />
              <Text style={styles.suspiciousBadgeText}>Suspicious</Text>
            </View>
          </View>
          <View style={styles.divider} />
        </View>

        {/* What happens next? Card (Frame 503:3939) */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          <Text style={styles.nextStepsBody}>
            Our review team will assess the available product information.
            We'll update this report when the review is complete.
          </Text>
        </View>

        {/* Action Button: Done (Frame 503:3940) */}
        <Pressable
          style={styles.doneButton}
          onPress={handleBack}
          accessibilityRole="button"
          accessibilityLabel="Done"
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#0A0A0A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
  },
  contentHeader: {
    marginBottom: 20,
  },
  reportCodeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  productNameTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    color: '#0A0A0A',
    marginBottom: 6,
  },
  submittedDateText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666666',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  statusIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statusTextCol: {
    flex: 1,
  },
  statusLabelText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  statusValueText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#92400E',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryHeading: {
    fontFamily: 'Geist_500Medium',
    fontSize: 20,
    color: '#0A0A0A',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#0A0A0A',
  },
  suspiciousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  suspiciousBadgeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  nextStepsCard: {
    backgroundColor: '#F7F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#0A0A0A',
    marginBottom: 8,
  },
  nextStepsBody: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  doneButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
