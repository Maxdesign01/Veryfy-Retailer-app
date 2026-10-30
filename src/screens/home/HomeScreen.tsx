import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockRecentScans } from '../../api/mockData';
import { ArrowForwardIcon } from '../../components/icons/ArrowForwardIcon';
import { BellIcon } from '../../components/icons/BellIcon';
import { HistoryIcon } from '../../components/icons/HistoryIcon';
import { HomeInventoryIcon } from '../../components/icons/HomeInventoryIcon';
import { HomeQrIcon } from '../../components/icons/HomeQrIcon';
import { NotVerifiedBadgeIcon } from '../../components/icons/NotVerifiedBadgeIcon';
import { ProductPackageIcon } from '../../components/icons/ProductPackageIcon';
import { QrCodeScannerIcon } from '../../components/icons/QrCodeScannerIcon';
import { SafetyHelpIcon } from '../../components/icons/SafetyHelpIcon';
import { SuspiciousBadgeIcon } from '../../components/icons/SuspiciousBadgeIcon';
import { VerifiedBadgeIcon } from '../../components/icons/VerifiedBadgeIcon';
import { RecentScan } from '../../types';

interface HomeScreenProps {
  navigation: any;
  route?: any;
  storeName?: string;
  isNewStore?: boolean;
  recentScans?: RecentScan[];
  totalScansCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  route,
  storeName = 'Green Mart Pharmacy',
  isNewStore,
  recentScans,
  totalScansCount = 12,
}) => {
  const insets = useSafeAreaInsets();

  // Determine whether this screen renders the New Store or Existing Store state.
  // 1. Explicit prop isNewStore
  // 2. Navigation param route.params?.isNewStore
  // 3. Defaults to false (Existing Store) if scans exist
  const isNew = isNewStore ?? route?.params?.isNewStore ?? false;
  const scans = recentScans ?? mockRecentScans;

  const navigateToTab = (tab: 'Home' | 'Inventory' | 'Scan' | 'Reports' | 'Profile') => {
    if (typeof navigation?.jumpTo === 'function') {
      navigation.jumpTo(tab);
    } else {
      const parent = navigation?.getParent?.();
      if (typeof parent?.jumpTo === 'function') {
        parent.jumpTo(tab);
      } else {
        (parent || navigation)?.navigate('Main', { screen: tab });
      }
    }
  };

  const renderStatusBadge = (status: RecentScan['status'] | string) => {
    if (status === 'verified') {
      return (
        <View style={[styles.statusBadge, styles.badgeVerified]}>
          <VerifiedBadgeIcon size={13} color="#166534" />
          <Text style={styles.badgeTextVerified}>Verified</Text>
        </View>
      );
    }
    if (status === 'suspicious') {
      return (
        <View style={[styles.statusBadge, styles.badgeSuspicious]}>
          <SuspiciousBadgeIcon size={13} color="#92400E" />
          <Text style={styles.badgeTextSuspicious}>Suspicious</Text>
        </View>
      );
    }
    return (
      <View style={[styles.statusBadge, styles.badgeNotVerified]}>
        <NotVerifiedBadgeIcon size={13} color="#161616" />
        <Text style={styles.badgeTextNotVerified}>Not verified</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 16,
            paddingBottom: 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Frame (503:4077 / 503:4159) */}
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>Good morning,</Text>
            <Pressable
              onPress={() => navigation.navigate('Notifications')}
              hitSlop={8}
              style={({ pressed }) => [pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <BellIcon size={24} color="#0A0A0A" />
            </Pressable>
          </View>
          <Text style={styles.storeNameText}>{storeName}</Text>
          <Text style={styles.subtitleText}>
            Check new stock before it reaches your shelves.
          </Text>
        </View>

        {/* Hero Card (503:4085 / 503:4168) */}
        <Pressable
          style={({ pressed }) => [styles.heroCard, pressed && styles.heroPressed]}
          onPress={() => navigateToTab('Scan')}
          accessibilityRole="button"
          accessibilityLabel="Verify Product. Check new stock. Use the code printed on the packaging."
        >
          <View style={styles.heroQrContainer}>
            <HomeQrIcon size={28} color="#FFFFFF" />
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroTag}>CHECK NEW STOCK</Text>
            <Text style={styles.heroTitle}>Verify Product</Text>
            <Text style={styles.heroSubtitle}>
              Use the code printed on the packaging.
            </Text>
          </View>
          <View style={styles.heroArrowContainer}>
            <ArrowForwardIcon size={20} color="#FFFFFF" />
          </View>
        </Pressable>

        {/* Quick Actions (503:4094 / 503:4176) */}
        <View style={styles.quickActionsRow}>
          {/* Tile 1: Enter code (503:4095 / 503:4177) */}
          <Pressable
            style={({ pressed }) => [styles.quickActionTile, pressed && styles.tilePressed]}
            onPress={() => navigateToTab('Scan')}
            accessibilityRole="button"
            accessibilityLabel="Enter code"
          >
            <View style={styles.iconTile}>
              <QrCodeScannerIcon size={20} color="#0A0A0A" />
            </View>
            <Text style={styles.quickActionLabel}>Enter code</Text>
          </Pressable>

          {/* Tile 2: Scan history (503:4098 / 503:4180) */}
          <Pressable
            style={({ pressed }) => [styles.quickActionTile, pressed && styles.tilePressed]}
            onPress={() => navigateToTab('Inventory')}
            accessibilityRole="button"
            accessibilityLabel="Scan history"
          >
            <View style={styles.iconTile}>
              <HistoryIcon size={40} color="#0A0A0A" />
            </View>
            <Text style={styles.quickActionLabel}>Scan history</Text>
          </Pressable>

          {/* Tile 3: Inventory (503:4101 / 503:4183) */}
          <Pressable
            style={({ pressed }) => [styles.quickActionTile, pressed && styles.tilePressed]}
            onPress={() => navigateToTab('Inventory')}
            accessibilityRole="button"
            accessibilityLabel="Inventory"
          >
            <View style={styles.iconTile}>
              <HomeInventoryIcon size={40} color="#0A0A0A" />
            </View>
            <Text style={styles.quickActionLabel}>Inventory</Text>
          </Pressable>
        </View>

        {/* Activity Section: TODAY */}
        {isNew || scans.length === 0 ? (
          /* New Store State (503:4142) */
          <View style={styles.activitySection}>
            <Text style={styles.todayOverline}>TODAY</Text>
            <Text style={styles.emptyActivityText}>
              All records of scans will display here when you scan a product
            </Text>
            <View style={styles.activityDivider} />
          </View>
        ) : (
          /* Existing Store State (503:4104) */
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.todayOverline}>TODAY</Text>
              <View style={styles.activitySubheaderRow}>
                <Text style={styles.productsCheckedText}>
                  {totalScansCount} products checked
                </Text>
                <Pressable
                  onPress={() => navigateToTab('Inventory')}
                  hitSlop={8}
                  style={({ pressed }) => [pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityLabel="View all products checked today"
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </Pressable>
              </View>
            </View>

            {/* List of scanned products (503:4110) */}
            <View style={styles.scannedListContainer}>
              {scans.map((item) => (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.productRow,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() => navigateToTab('Inventory')}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name}, ${item.category} · ${item.date}, ${item.status}`}
                >
                  <View style={styles.productIconTile}>
                    <ProductPackageIcon size={40} color="#666666" />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.productMeta}>
                      {`${item.category} · ${item.date}`}
                    </Text>
                  </View>
                  {renderStatusBadge(item.status)}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Spacer: Flexible in New Store to maintain fixed distance, or minimal in Existing Store */}
        {isNew || scans.length === 0 ? (
          <View style={styles.newStoreSpacer} />
        ) : (
          <View style={styles.existingStoreSpacer} />
        )}

        {/* Safety Guidance Callout (503:4129 / 503:4157) */}
        <Pressable
          style={({ pressed }) => [styles.safetyCard, pressed && styles.tilePressed]}
          onPress={() => navigation.navigate('SafetyGuidance', { fromNewStore: isNew })}
          accessibilityRole="button"
          accessibilityLabel="Stay safer when buying products. Four practical checks to remember."
        >
          <View style={styles.safetyIconContainer}>
            <SafetyHelpIcon size={40} color="#666666" />
          </View>
          <View style={styles.safetyTextContainer}>
            <Text style={styles.safetyTitle}>Stay safer when buying products</Text>
            <Text style={styles.safetySubtitle}>Four practical checks to remember</Text>
          </View>
          <View style={styles.safetyArrowContainer}>
            <ArrowForwardIcon size={16} color="#666666" />
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  header: {
    marginBottom: 18,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#000000',
  },
  storeNameText: {
    marginTop: 4,
    fontFamily: 'Geist_500Medium',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    color: '#000000',
  },
  subtitleText: {
    marginTop: 4,
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#000000',
  },
  heroCard: {
    backgroundColor: '#010B4F',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroQrContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#4C4C4C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroContent: {
    flex: 1,
  },
  heroTag: {
    fontFamily: 'Geist_500Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16.8,
    letterSpacing: 0.96,
    color: '#AAAAAA',
    textTransform: 'uppercase',
  },
  heroTitle: {
    marginTop: 4,
    fontFamily: 'Geist_700Bold',
    fontWeight: '700',
    fontSize: 22,
    lineHeight: 28,
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#BCBCBC',
  },
  heroArrowContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  quickActionTile: {
    flex: 1,
    height: 84,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    marginTop: 0,
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#161616',
  },
  activitySection: {
    marginBottom: 0,
  },
  activityHeader: {
    marginBottom: 0,
  },
  todayOverline: {
    fontFamily: 'Geist_500Medium',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 16.8,
    letterSpacing: 0.96,
    color: '#666666',
    textTransform: 'uppercase',
  },
  emptyActivityText: {
    marginTop: 2,
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 14,
    color: '#767676',
  },
  activityDivider: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  activitySubheaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  productsCheckedText: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#161616',
  },
  viewAllText: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#3D52D5',
  },
  scannedListContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  productIconTile: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#161616',
  },
  productMeta: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#666666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  badgeVerified: {
    backgroundColor: '#F0FDF4',
  },
  badgeTextVerified: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#166534',
  },
  badgeSuspicious: {
    backgroundColor: '#FFFBEB',
  },
  badgeTextSuspicious: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#92400E',
  },
  badgeNotVerified: {
    backgroundColor: '#F3F3F3',
  },
  badgeTextNotVerified: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#161616',
  },
  newStoreSpacer: {
    flex: 1,
    minHeight: 40,
  },
  existingStoreSpacer: {
    height: 18,
  },
  safetyCard: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  safetyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  safetyTitle: {
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#161616',
  },
  safetySubtitle: {
    marginTop: 2,
    fontFamily: 'Geist_400Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#666666',
  },
  safetyArrowContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  heroPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  tilePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  rowPressed: {
    backgroundColor: '#F9FAFB',
  },
});
