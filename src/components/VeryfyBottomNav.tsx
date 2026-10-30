import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavHomeIcon } from './icons/NavHomeIcon';
import { NavInventoryIcon } from './icons/NavInventoryIcon';
import { NavProfileIcon } from './icons/NavProfileIcon';
import { NavQrScanIcon } from './icons/NavQrScanIcon';
import { NavReportsIcon } from './icons/NavReportsIcon';

export type NavTabName = 'Home' | 'Inventory' | 'Scan' | 'Reports' | 'Profile';

interface VeryfyBottomNavProps {
  activeTab?: NavTabName;
  navigation: any;
}

export const VeryfyBottomNav: React.FC<VeryfyBottomNavProps> = ({
  activeTab = 'Inventory',
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const handleTabPress = (tab: NavTabName) => {
    // 1. If within TabNavigator (where navigation.jumpTo is provided), switch directly
    if (typeof navigation?.jumpTo === 'function') {
      navigation.jumpTo(tab);
      return;
    }

    // 2. If parent navigator has jumpTo
    const parent = navigation?.getParent?.();
    if (typeof parent?.jumpTo === 'function') {
      parent.jumpTo(tab);
      return;
    }

    // 3. Fallback for RootStack screens (e.g. AddStockScreen, ReportProductScreen)
    if (navigation?.navigate) {
      if (tab === 'Scan') {
        navigation.navigate('Main', { screen: 'Scan' });
      } else {
        navigation.navigate('Main', { screen: tab });
      }
    }
  };

  const isTabActive = (tab: NavTabName) => activeTab === tab;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {/* Tab: Home */}
      <Pressable
        style={[styles.tabItem, isTabActive('Home') && styles.tabItemActive]}
        onPress={() => handleTabPress('Home')}
        accessibilityRole="button"
        accessibilityLabel="Home"
      >
        <View style={styles.iconBox}>
          <NavHomeIcon
            size={22}
            color={isTabActive('Home') ? '#2E40B8' : '#666666'}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            isTabActive('Home') && styles.tabLabelActive,
          ]}
        >
          Home
        </Text>
      </Pressable>

      {/* Tab: Inventory (ACTIVE) */}
      <Pressable
        style={[styles.tabItem, isTabActive('Inventory') && styles.tabItemActive]}
        onPress={() => handleTabPress('Inventory')}
        accessibilityRole="button"
        accessibilityLabel="Inventory"
      >
        <View style={styles.iconBox}>
          <NavInventoryIcon
            size={22}
            color={isTabActive('Inventory') ? '#2E40B8' : '#666666'}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            isTabActive('Inventory') && styles.tabLabelActive,
          ]}
        >
          Inventory
        </Text>
      </Pressable>

      {/* Tab: Scan (Center 44x44 blue circular button) */}
      <Pressable
        style={styles.scanWrapper}
        onPress={() => handleTabPress('Scan')}
        accessibilityRole="button"
        accessibilityLabel="Scan"
      >
        <View style={styles.scanCircle}>
          <NavQrScanIcon size={22} color="#FFFFFF" />
        </View>
        <Text style={styles.tabLabel}>Scan</Text>
      </Pressable>

      {/* Tab: Reports */}
      <Pressable
        style={[styles.tabItem, isTabActive('Reports') && styles.tabItemActive]}
        onPress={() => handleTabPress('Reports')}
        accessibilityRole="button"
        accessibilityLabel="Reports"
      >
        <View style={styles.iconBox}>
          <NavReportsIcon
            size={22}
            color={isTabActive('Reports') ? '#2E40B8' : '#666666'}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            isTabActive('Reports') && styles.tabLabelActive,
          ]}
        >
          Reports
        </Text>
      </Pressable>

      {/* Tab: Profile */}
      <Pressable
        style={[styles.tabItem, isTabActive('Profile') && styles.tabItemActive]}
        onPress={() => handleTabPress('Profile')}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <View style={styles.iconBox}>
          <NavProfileIcon
            size={22}
            color={isTabActive('Profile') ? '#2E40B8' : '#666666'}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            isTabActive('Profile') && styles.tabLabelActive,
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 83,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    width: 70,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: '#F7F7FF',
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabel: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    lineHeight: 16,
    color: '#666666',
  },
  tabLabelActive: {
    color: '#2E40B8',
    fontFamily: 'Geist_600SemiBold',
  },
  scanWrapper: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
  },
  scanCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3D52D5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: '#3D52D5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
});
