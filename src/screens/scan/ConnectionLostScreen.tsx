import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertCircleFilledIcon } from '../../components/icons/AlertCircleFilledIcon';
import { connectivityService } from '../../services/connectivityService';
import { mockVerificationResults } from '../../api/mockData';
import { VerificationResult } from '../../types';

interface ConnectionLostScreenProps {
  navigation: any;
  route: {
    params?: {
      code?: string;
      result?: VerificationResult;
      errorReason?: 'offline' | 'timeout' | 'server_error';
    };
  };
}

export const ConnectionLostScreen: React.FC<ConnectionLostScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryNotice, setRetryNotice] = useState<string | null>(null);

  const preservedCode = route.params?.code || 'VFY-2849-1036';
  const preservedResult = route.params?.result;

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setRetryNotice(null);

    try {
      // Simulate/perform realistic reachability test
      const check = await connectivityService.checkVerificationServiceReachable();

      if (check.reachable) {
        // Connected! Re-trigger verification with preserved context
        setTimeout(() => {
          setIsRetrying(false);
          const targetResult = preservedResult || mockVerificationResults.verified;
          navigation.replace('VerifyingProduct', {
            result: targetResult,
            code: preservedCode,
          });
        }, 800);
      } else {
        // Still offline
        setTimeout(() => {
          setIsRetrying(false);
          setRetryNotice('Still unable to connect. Check your signal or use SMS/USSD below.');
        }, 900);
      }
    } catch {
      setIsRetrying(false);
      setRetryNotice('Still unable to connect. Check your signal or use SMS/USSD below.');
    }
  };

  const handleOpenSmsUssd = () => {
    navigation.navigate('VerifySmsUssd', { code: preservedCode });
  };

  const handleOpenLite = () => {
    connectivityService.openVeryfyLite();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16) + 16,
            paddingBottom: Math.max(insets.bottom, 16) + 16,
          },
        ]}
      >
        {/* 1. Alert Message Box (Figma node 06) */}
        <View style={styles.alertCard}>
          <View style={styles.alertIconWrapper}>
            <AlertCircleFilledIcon size={20} color="#DC2626" iconColor="#FFFFFF" />
          </View>
          <Text style={styles.alertText}>
            Connection lost during the check. No result was received. Reconnect and retry.
          </Text>
        </View>

        {/* Retry status banner if retry was attempted while still offline */}
        {retryNotice && (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeText}>{retryNotice}</Text>
          </View>
        )}

        {/* 2. Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable
            onPress={handleRetry}
            disabled={isRetrying}
            style={({ pressed }) => [
              styles.primaryButton,
              isRetrying && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Retry verification"
          >
            {isRetrying ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={[styles.primaryButtonText, { marginLeft: 8 }]}>
                  Checking connection...
                </Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Retry verification</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleOpenSmsUssd}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Use SMS or USSD"
          >
            <Text style={styles.secondaryButtonText}>Use SMS or USSD</Text>
          </Pressable>

          {/* 3. Text Links */}
          <Pressable
            onPress={handleOpenSmsUssd}
            style={styles.textLinkWrapper}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="No internet? Verify by SMS or USSD"
          >
            <Text style={styles.textLink}>
              No internet? Verify by SMS or USSD &rarr;
            </Text>
          </Pressable>

          <Pressable
            onPress={handleOpenLite}
            style={styles.liteLinkWrapper}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Weak 2G signal? Switch to Veryfy Lite"
          >
            <Text style={styles.liteLinkText}>
              &#9889; Weak 2G signal? Switch to Veryfy Lite (Low Data) &rarr;
            </Text>
          </Pressable>
        </View>

        {/* 4. Important Legal / Security Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Important: A valid code alone does not prove the product is genuine. Check
            the HiddenMark and packaging for signs of tampering.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  alertIconWrapper: {
    marginRight: 12,
    marginTop: 1,
  },
  alertText: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#161616',
    letterSpacing: -0.1,
  },
  noticeCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FEF3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  noticeText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#92400E',
  },
  actionsContainer: {
    width: '100%',
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3D52D5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#3D52D5',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  secondaryButtonPressed: {
    backgroundColor: '#F7F7FF',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLinkWrapper: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 8,
  },
  textLink: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: '#0D9488',
    textDecorationLine: 'underline',
  },
  liteLinkWrapper: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    marginBottom: 24,
  },
  liteLinkText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: '#3D52D5',
    textDecorationLine: 'underline',
  },
  disclaimerContainer: {
    width: '100%',
    marginTop: 8,
  },
  disclaimerText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#666666',
  },
});
