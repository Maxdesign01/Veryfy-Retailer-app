import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { FilterListIcon } from '../../components/icons/FilterListIcon';
import { InvalidBadgeOctagonIcon } from '../../components/icons/InvalidBadgeOctagonIcon';
import { QuestionCircleBadgeIcon } from '../../components/icons/QuestionCircleBadgeIcon';
import { StockChevronRightIcon } from '../../components/icons/StockChevronRightIcon';
import { StockSearchIcon } from '../../components/icons/StockSearchIcon';
import { VerifiedBadgeRosetteIcon } from '../../components/icons/VerifiedBadgeRosetteIcon';
import { inventoryService } from '../../services/inventoryService';
import { InventoryItem, VerificationOutcome } from '../../types';

export type StockFilterType = 'all' | 'verified' | 'invalid' | 'counterfeit';

interface InventoryScreenProps {
  navigation: any;
  route?: any;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  navigation,
  route,
}) => {
  const [activeFilter, setActiveFilter] = useState<StockFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<InventoryItem[]>(() =>
    inventoryService.getItems()
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Subscribe to real-time inventory updates from inventoryService
  useEffect(() => {
    const unsubscribe = inventoryService.subscribe(() => {
      setItems(inventoryService.getItems());
    });
    return unsubscribe;
  }, []);

  // Also catch route params if passed directly from AddStock
  useEffect(() => {
    if (route?.params?.newItem) {
      setItems(inventoryService.getItems());
    }
  }, [route?.params?.newItem]);

  // Compute dynamic counts from actual data
  const counts = useMemo(() => {
    if (!Array.isArray(items)) {
      return { all: 0, verified: 0, invalid: 0, counterfeit: 0 };
    }
    const verified = items.filter((i) => i?.status === 'verified').length;
    const invalid = items.filter((i) => i?.status === 'invalid').length;
    const counterfeit = items.filter(
      (i) => i?.status === 'counterfeit' || (i?.status as any) === 'not_verified'
    ).length;

    return {
      all: items.length,
      verified,
      invalid,
      counterfeit,
    };
  }, [items]);

  // Filter and search computation
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      if (!item) return false;

      // 1. Filter Tab
      let matchesFilter = true;
      if (activeFilter === 'verified') {
        matchesFilter = item.status === 'verified';
      } else if (activeFilter === 'invalid') {
        matchesFilter = item.status === 'invalid';
      } else if (activeFilter === 'counterfeit') {
        matchesFilter =
          item.status === 'counterfeit' ||
          (item.status as any) === 'not_verified';
      }

      if (!matchesFilter) return false;

      // 2. Search Query across product name, batch number, package size, notes
      if (!query) return true;

      const p = item.product || ({} as any);
      const haystack = [
        p.name,
        p.batchNumber,
        p.packageSize,
        p.category,
        p.manufacturer,
        p.nafdacRegNo,
        item.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, activeFilter, searchQuery]);

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof navigation?.jumpTo === 'function') {
      navigation.jumpTo('Home');
    } else {
      navigation?.navigate('Home');
    }
  };

  const handleCardPress = (item: InventoryItem) => {
    const p = item.product || ({} as any);
    navigation.navigate('VerificationResult', {
      result: {
        scanId: `scan-${item.id}`,
        timestamp: item.lastVerifiedDate || 'Today',
        outcome: item.status,
        product: p,
        confidenceScore: item.status === 'verified' ? 99 : 45,
        tamperSealVerified: item.status === 'verified',
        scannedQrCode: p.batchNumber || `VFY-${item.id}`,
      },
    });
  };

  const renderBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'verified':
        return (
          <View style={[styles.badge, styles.badgeVerified]}>
            <VerifiedBadgeRosetteIcon size={15} color="#010B4F" />
            <Text style={styles.badgeTextVerified}>Verified</Text>
          </View>
        );
      case 'invalid':
        return (
          <View style={[styles.badge, styles.badgeInvalid]}>
            <InvalidBadgeOctagonIcon size={15} color="#FFFFFF" />
            <Text style={styles.badgeTextInvalid}>Invalid</Text>
          </View>
        );
      case 'counterfeit':
      default:
        return (
          <View style={[styles.badge, styles.badgeNotVerified]}>
            <QuestionCircleBadgeIcon size={15} color="#161616" />
            <Text style={styles.badgeTextNotVerified}>Not verified</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Back Arrow Bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ArrowBackIcon size={24} color="#0A0A0A" />
        </Pressable>
      </View>

      {/* Screen Title */}
      <Text style={styles.title}>Inventory</Text>

      {/* Search & Filter Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <StockSearchIcon size={18} color="#666666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name, batch number, size..."
            placeholderTextColor="#767676"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Pressable
          style={styles.filterButton}
          onPress={() => setIsFilterModalOpen(true)}
          hitSlop={8}
          accessibilityLabel="Filter Options"
          accessibilityRole="button"
        >
          <FilterListIcon size={22} color="#0A0A0A" />
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {/* Tab: All */}
          <Pressable
            style={[styles.tab, activeFilter === 'all' && styles.tabActive]}
            onPress={() => setActiveFilter('all')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === 'all' && styles.tabTextActive,
              ]}
            >
              All ({counts.all})
            </Text>
          </Pressable>

          {/* Tab: Verified */}
          <Pressable
            style={[styles.tab, activeFilter === 'verified' && styles.tabActive]}
            onPress={() => setActiveFilter('verified')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === 'verified' && styles.tabTextActive,
              ]}
            >
              Verified ({counts.verified})
            </Text>
          </Pressable>

          {/* Tab: Invalid */}
          <Pressable
            style={[styles.tab, activeFilter === 'invalid' && styles.tabActive]}
            onPress={() => setActiveFilter('invalid')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === 'invalid' && styles.tabTextActive,
              ]}
            >
              Invalid ({counts.invalid})
            </Text>
          </Pressable>

          {/* Tab: Counterfeit */}
          <Pressable
            style={[
              styles.tab,
              activeFilter === 'counterfeit' && styles.tabActive,
            ]}
            onPress={() => setActiveFilter('counterfeit')}
            accessibilityRole="tab"
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === 'counterfeit' && styles.tabTextActive,
              ]}
            >
              Counterfeit ({counts.counterfeit})
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Stock Cards List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? `No stock items matching "${searchQuery}".`
                : 'No stock items found in this filter category.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const subtitle =
            item.status === 'verified'
              ? `Authentic · ${item.lastVerifiedDate || 'Recently'}`
              : item.status === 'invalid'
              ? `Source unclear · ${item.lastVerifiedDate || 'Recently'}`
              : `Not verified · ${item.lastVerifiedDate || 'Recently'}`;

          return (
            <Pressable
              style={styles.card}
              onPress={() => handleCardPress(item)}
              android_ripple={{ color: '#F3F4F6' }}
              accessibilityRole="button"
              accessibilityLabel={`${item.product?.name || 'Product'}, ${subtitle}`}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.product?.name || 'Product'}
                </Text>
                <Text style={styles.productSubtitle} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>

              <View style={styles.cardRight}>
                {renderBadge(item.status)}
                <StockChevronRightIcon size={20} color="#A3A3A3" />
              </View>
            </Pressable>
          );
        }}
      />

      {/* Quick Filter Modal */}
      <Modal
        visible={isFilterModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsFilterModalOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setIsFilterModalOpen(false)}
        >
          <View style={styles.filterMenu}>
            <Text style={styles.filterMenuTitle}>Filter By Status</Text>
            {(['all', 'verified', 'invalid', 'counterfeit'] as const).map(
              (filterKey) => {
                const isSelected = activeFilter === filterKey;
                const filterLabels: Record<StockFilterType, string> = {
                  all: `All Products (${counts.all})`,
                  verified: `Verified Only (${counts.verified})`,
                  invalid: `Invalid Only (${counts.invalid})`,
                  counterfeit: `Counterfeit Only (${counts.counterfeit})`,
                };
                return (
                  <Pressable
                    key={filterKey}
                    style={[
                      styles.filterMenuItem,
                      isSelected && styles.filterMenuItemActive,
                    ]}
                    onPress={() => {
                      setActiveFilter(filterKey);
                      setIsFilterModalOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterMenuText,
                        isSelected && styles.filterMenuTextActive,
                      ]}
                    >
                      {filterLabels[filterKey]}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Geist_500Medium',
    fontSize: 20,
    lineHeight: 28,
    color: '#000000',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchInputContainer: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#161616',
  },
  filterButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#FFFFFF',
  },
  tabsWrapper: {
    marginBottom: 14,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    height: 33,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#2E40B8',
  },
  tabText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Geist_600SemiBold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 8,
  },
  card: {
    height: 74,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  cardLeft: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: '#161616',
    marginBottom: 2,
  },
  productSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
  },
  badgeVerified: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeTextVerified: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#166534',
  },
  badgeInvalid: {
    backgroundColor: '#EF4444',
  },
  badgeTextInvalid: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#FFFFFF',
  },
  badgeNotVerified: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeTextNotVerified: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#92400E',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#161616',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  filterMenu: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  filterMenuTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    color: '#161616',
    marginBottom: 14,
  },
  filterMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 6,
  },
  filterMenuItemActive: {
    backgroundColor: '#EEF2FF',
  },
  filterMenuText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#374151',
  },
  filterMenuTextActive: {
    color: '#2E40B8',
    fontFamily: 'Geist_600SemiBold',
  },
});
