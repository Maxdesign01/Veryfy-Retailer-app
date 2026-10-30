import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellIcon } from '../../components/icons/BellIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { HistoryIcon } from '../../components/icons/HistoryIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';
import { mockReports } from '../../api/mockData';
import { ProductReport, ReportStatus } from '../../types';

interface MyReportsScreenProps {
  navigation: any;
}

export const MyReportsScreen: React.FC<MyReportsScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'Reviewed'>('All');
  const [reports] = useState<ProductReport[]>(mockReports);

  const filteredReports = useMemo(() => {
    if (activeTab === 'All') return reports;
    if (activeTab === 'Open') {
      return reports.filter((r) => r.status === 'Open');
    }
    return reports.filter((r) => r.status === 'Reviewed');
  }, [reports, activeTab]);

  const handleReportPress = (item: ProductReport) => {
    navigation.navigate('ReportDetails', { reportId: item.reportId });
  };

  const renderBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Reviewed':
        return (
          <View style={[styles.badge, styles.badgeReviewed]}>
            <Text style={styles.badgeTextReviewed}>Reviewed</Text>
          </View>
        );
      case 'Investigating':
        return (
          <View style={[styles.badge, styles.badgeUnderReview]}>
            <Text style={styles.badgeTextUnderReview}>Under review</Text>
          </View>
        );
      case 'Open':
      default:
        return (
          <View style={[styles.badge, styles.badgeOpen]}>
            <Text style={styles.badgeTextOpen}>Received</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* TopBar (Frame 503:3950) */}
      <View style={styles.topBar}>
        <VeryfyLogo width={85} height={26} color="#0A0A0A" />
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={12}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <BellIcon size={24} color="#0A0A0A" />
        </Pressable>
      </View>

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* PageHeader (Frame 503:3953) */}
            <View style={styles.pageHeader}>
              <Text style={styles.sectionOverline}>Your Activity</Text>
              <Text style={styles.pageTitle}>My reports</Text>
              <Text style={styles.pageSubtitle}>
                Follow the reports you've sent to Veryfy.
              </Text>
            </View>

            {/* Filters Row (Frame 503:3959) */}
            <View style={styles.filtersRow}>
              {(['All', 'Open', 'Reviewed'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Pressable
                    key={tab}
                    style={[styles.filterTab, isActive && styles.filterTabActive]}
                    onPress={() => setActiveTab(tab)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        isActive && styles.filterTabTextActive,
                      ]}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.reportCard}
            onPress={() => handleReportPress(item)}
            android_ripple={{ color: '#F3F4F6' }}
          >
            <View style={styles.cardIconBox}>
              <HistoryIcon size={18} color="#666666" />
            </View>

            <View style={styles.cardCenterCol}>
              <Text style={styles.productName} numberOfLines={1}>
                {item.productName}
              </Text>
              <Text style={styles.reportSub}>
                {item.category} · {item.dateSubmitted}
              </Text>
            </View>

            <View style={styles.cardRightCol}>
              {renderBadge(item.status)}
              <ChevronRightIcon size={20} color="#A3A3A3" />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No reports found</Text>
            <Text style={styles.emptySub}>
              Reports you submit will appear here with real-time status updates.
            </Text>
          </View>
        }
        ListFooterComponent={
          <Pressable
            style={styles.newReportBtn}
            onPress={() => navigation.navigate('ReportProduct', {})}
            accessibilityRole="button"
            accessibilityLabel="Report a product"
          >
            <Text style={styles.newReportBtnText}>+ Report a product</Text>
          </Pressable>
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  pageHeader: {
    marginBottom: 16,
  },
  sectionOverline: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 32,
    lineHeight: 38,
    color: '#0A0A0A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3D52D5',
  },
  filterTabText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
  },
  filterTabTextActive: {
    fontFamily: 'Geist_500Medium',
    color: '#2E40B8',
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardCenterCol: {
    flex: 1,
  },
  productName: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: '#0A0A0A',
  },
  reportSub: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  cardRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
  },
  badgeReviewed: {
    backgroundColor: '#F0FDF4',
  },
  badgeTextReviewed: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#166534',
  },
  badgeUnderReview: {
    backgroundColor: '#FFFBEB',
  },
  badgeTextUnderReview: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#92400E',
  },
  badgeOpen: {
    backgroundColor: '#F3F4F6',
  },
  badgeTextOpen: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#374151',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#0A0A0A',
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  newReportBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3D52D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  newReportBtnText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#3D52D5',
  },
});
