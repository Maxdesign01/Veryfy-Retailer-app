import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BellIcon } from '../../components/icons/BellIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { HistoryIcon } from '../../components/icons/HistoryIcon';
import { LockIcon } from '../../components/icons/LockIcon';
import { SafetyHelpIcon } from '../../components/icons/SafetyHelpIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';
import { mockProfile } from '../../api/mockData';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const handleSignOut = () => {
    Alert.alert('Log out', 'Are you sure you want to log out of Veryfy?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header with Brand Logo (Frame 503:3997) */}
      <View style={styles.topBar}>
        <VeryfyLogo width={85} height={26} color="#0A0A0A" />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Header (Frame 503:4001) */}
        <View style={styles.userHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>AO</Text>
          </View>

          <View style={styles.userTextCol}>
            <Text style={styles.accountLabel}>Retailer account</Text>
            <Text style={styles.userName}>
              {mockProfile.ownerName || 'Ada Okafor'}
            </Text>
            <Text style={styles.userEmail}>
              {mockProfile.email || 'ada@example.com'}
            </Text>
          </View>
        </View>

        {/* Stats Card (Frame 503:4012) */}
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>37</Text>
          <Text style={styles.statsLabel}>
            products checked since joining Veryfy
          </Text>
        </View>

        {/* Menu Items Group (Frame 503:4014) */}
        <View style={styles.menuGroup}>
          {/* Notification settings (503:4015) */}
          <Pressable
            style={styles.menuRow}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notification settings"
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <BellIcon size={20} color="#0A0A0A" />
              </View>
              <Text style={styles.menuLabel}>Notification settings</Text>
            </View>
            <ChevronRightIcon size={20} color="#A3A3A3" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Verification activity (503:4019) */}
          <Pressable
            style={styles.menuRow}
            onPress={() => {
              if (typeof navigation?.jumpTo === 'function') {
                navigation.jumpTo('Inventory');
              } else {
                const parent = navigation?.getParent?.();
                if (typeof parent?.jumpTo === 'function') {
                  parent.jumpTo('Inventory');
                } else {
                  (parent || navigation)?.navigate('Main', { screen: 'Inventory' });
                }
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Verification activity"
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <HistoryIcon size={20} color="#0A0A0A" />
              </View>
              <Text style={styles.menuLabel}>Verification activity</Text>
            </View>
            <ChevronRightIcon size={20} color="#A3A3A3" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Help & support (503:4023) */}
          <Pressable
            style={styles.menuRow}
            onPress={() => navigation.navigate('SafetyGuidance')}
            accessibilityRole="button"
            accessibilityLabel="Help & support"
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <SafetyHelpIcon size={20} color="#0A0A0A" />
              </View>
              <Text style={styles.menuLabel}>Help & support</Text>
            </View>
            <ChevronRightIcon size={20} color="#A3A3A3" />
          </Pressable>

          <View style={styles.menuDivider} />

          {/* Privacy (503:4027) */}
          <Pressable
            style={styles.menuRow}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'Veryfy complies with standard NDPR and pharmaceutical data security protocols. Scanned barcodes and verification telemetry are stored encrypted on-device and synchronized securely.'
              )
            }
            accessibilityRole="button"
            accessibilityLabel="Privacy"
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <LockIcon size={20} color="#0A0A0A" />
              </View>
              <Text style={styles.menuLabel}>Privacy</Text>
            </View>
            <ChevronRightIcon size={20} color="#A3A3A3" />
          </Pressable>
        </View>

        {/* Log out Button (Frame 503:4032) */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Text style={styles.logoutButtonText}>Log out</Text>
        </Pressable>

        {/* App Version (Frame 503:4034) */}
        <Text style={styles.versionText}>Veryfy version 1.0</Text>
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
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3D52D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  userTextCol: {
    flex: 1,
  },
  accountLabel: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  userName: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 20,
    lineHeight: 26,
    color: '#161616',
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#666666',
  },
  statsCard: {
    backgroundColor: '#F7F7FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statsNumber: {
    fontFamily: 'Geist_700Bold',
    fontSize: 36,
    lineHeight: 44,
    color: '#2E40B8',
    marginBottom: 4,
  },
  statsLabel: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#0A0A0A',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },
  logoutButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#DC2626',
  },
  versionText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
