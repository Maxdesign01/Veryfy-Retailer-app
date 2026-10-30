import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ArrowForwardIcon } from '../../components/icons/ArrowForwardIcon';
import { QrCodeScannerIcon } from '../../components/icons/QrCodeScannerIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 8) + 8,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
        },
      ]}
    >
      {/* 1. Logo area (top-left) */}
      <View style={styles.logoArea}>
        <VeryfyLogo width={120} height={32} />
      </View>

      {/* 2. Hero body (icon, headline, subhead) */}
      <View style={styles.body}>
        <View style={styles.brandIconContainer}>
          <QrCodeScannerIcon size={24} color="#3D52D5" />
        </View>

        <View style={styles.headlinGroup}>
          <Text style={styles.headline}>{'Know what\nyou\'re buying.'}</Text>
          <Text style={styles.subhead}>
            Verify products before you buy, use or sell them.
          </Text>
        </View>
      </View>

      {/* 3. CTA group (buttons + footer trust tag) */}
      <View style={styles.ctaGroup}>
        <Button
          title="Get started"
          onPress={() => navigation.navigate('RoleSelection')}
          icon={<ArrowForwardIcon size={20} color="#FFFFFF" />}
          iconPosition="right"
          style={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />

        <Button
          title="I already have an account"
          variant="ghost"
          onPress={() => navigation.navigate('SignIn')}
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
        />

        <Text style={styles.footerTagline}>
          Built for everyday trust in Nigeria.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logoArea: {
    width: '100%',
    alignItems: 'flex-start',
  },
  body: {
    width: '100%',
  },
  brandIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F7F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headlinGroup: {
    width: '100%',
  },
  headline: {
    fontFamily: 'Geist_700Bold',
    fontSize: 36,
    lineHeight: 47,
    letterSpacing: -1.5,
    color: '#161616',
    textAlign: 'left',
    marginBottom: 12,
  },
  subhead: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#666666',
    textAlign: 'left',
  },
  ctaGroup: {
    width: '100%',
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#3D52D5',
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'transparent',
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#3D52D5',
    fontWeight: '400',
  },
  footerTagline: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0,
    color: '#666666',
    textAlign: 'center',
  },
});
