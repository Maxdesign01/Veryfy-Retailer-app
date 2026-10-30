import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { PersonIcon } from '../../components/icons/PersonIcon';
import { RadioIcon } from '../../components/icons/RadioIcon';
import { StoreIcon } from '../../components/icons/StoreIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';

interface RoleSelectionScreenProps {
  navigation: any;
}

type RoleType = 'manufacturer' | 'retailer';

interface RoleOption {
  id: RoleType;
  title: string;
  subtitle: string;
  icon: (color: string) => React.ReactNode;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<RoleType>('retailer');

  const roles: RoleOption[] = [
    {
      id: 'manufacturer',
      title: "I'm a Manufacturer",
      subtitle: 'Add Veryfy codes to your products',
      icon: (color) => <PersonIcon size={20} color={color} />,
    },
    {
      id: 'retailer',
      title: "I'm a Retailer/Wholeseller",
      subtitle: 'Check products before you buy or use them.',
      icon: (color) => <StoreIcon size={20} color={color} />,
    },
  ];

  const handleContinue = () => {
    // In Figma prototype, Continue routes directly to Retailer create account
    navigation.navigate('CreateAccount');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 8) + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 16,
        },
      ]}
    >
      {/* 1. Top navigation row: back button (left) + Veryfy logo (right) */}
      <View style={styles.topNavRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowBackIcon size={24} color="#0A0A0A" />
        </Pressable>

        <VeryfyLogo width={120} height={32} color="#3D52D5" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Header */}
        <View style={styles.header}>
          <Text style={styles.overline}>YOUR EXPERIENCE</Text>
          <Text style={styles.title}>How will you use Veryfy?</Text>
          <Text style={styles.subtitle}>
            Choose the option that best describes you. You can switch later.
          </Text>
        </View>

        {/* 3. Role options */}
        <View style={styles.roleList}>
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <Pressable
                key={role.id}
                onPress={() => setSelectedRole(role.id)}
                style={[
                  styles.roleCard,
                  isSelected ? styles.roleCardSelected : styles.roleCardUnselected,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                {/* Leading icon container */}
                <View style={styles.iconBox}>
                  {role.icon('#0A0A0A')}
                </View>

                {/* Text content */}
                <View style={styles.textGroup}>
                  <Text style={styles.roleTitle}>{role.title}</Text>
                  <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                </View>

                {/* Trailing radio */}
                <RadioIcon selected={isSelected} size={24} />
              </Pressable>
            );
          })}
        </View>

        {/* 4. Action button */}
        <View style={styles.actionContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            style={styles.continueButton}
            textStyle={styles.continueButtonText}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 28,
  },
  overline: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    color: '#666666',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Geist_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: '#161616',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#666666',
  },
  roleList: {
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  roleCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  roleCardSelected: {
    backgroundColor: '#F7F7FF',
    borderWidth: 2,
    borderColor: '#3D52D5',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    flex: 1,
    marginHorizontal: 12,
  },
  roleTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#161616',
    marginBottom: 2,
  },
  roleSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  actionContainer: {
    marginTop: 32,
  },
  continueButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#3D52D5',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  continueButtonText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '400',
  },
});
