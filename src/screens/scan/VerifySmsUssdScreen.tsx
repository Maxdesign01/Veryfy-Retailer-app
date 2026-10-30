import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { InfoCircleFilledIcon } from '../../components/icons/InfoCircleFilledIcon';
import { SmsOutlineIcon } from '../../components/icons/SmsOutlineIcon';
import { UssdPhoneIcon } from '../../components/icons/UssdPhoneIcon';

interface VerifySmsUssdScreenProps {
  navigation: any;
  route?: {
    params?: {
      code?: string;
    };
  };
}

export const VerifySmsUssdScreen: React.FC<VerifySmsUssdScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const productCode = route?.params?.code || 'VFY-2849-1036';

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', { screen: 'Scan' });
    }
  };

  const handleOpenMessages = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Verify by SMS',
        `Find the SMS service number printed on your product packaging and send code "${productCode}" to verify.`
      );
      return;
    }

    const smsUrl = Platform.select({
      ios: `sms:&body=${encodeURIComponent(productCode)}`,
      android: `sms:?body=${encodeURIComponent(productCode)}`,
      default: `sms:`,
    });

    try {
      const supported = await Linking.canOpenURL(smsUrl);
      if (supported) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert(
          'SMS Not Available',
          'Please open your phone Messages app and text the code to the number printed on packaging.'
        );
      }
    } catch {
      Alert.alert(
        'SMS Not Available',
        'Please open your phone Messages app and text the code to the number printed on packaging.'
      );
    }
  };

  const handleOpenDialer = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Verify by USSD',
        'Find the USSD code printed on your product packaging, open your phone dialer, and follow the prompts.'
      );
      return;
    }

    try {
      const telUrl = 'tel:';
      const supported = await Linking.canOpenURL(telUrl);
      if (supported) {
        await Linking.openURL(telUrl);
      } else {
        Alert.alert(
          'Dialer Not Available',
          'Please open your Phone dialer app and dial the USSD code on packaging.'
        );
      }
    } catch {
      Alert.alert(
        'Dialer Not Available',
        'Please open your Phone dialer app and dial the USSD code on packaging.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Top Bar with Circular Back Arrow */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowBackIcon size={20} color="#161616" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 24) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Heading & Description */}
        <Text style={styles.heading}>Verify by SMS or USSD</Text>
        <Text style={styles.subheading}>
          Use either method below to check your code.
        </Text>

        {/* Blue Information Banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoIconWrapper}>
            <InfoCircleFilledIcon size={20} color="#2563EB" iconColor="#FFFFFF" />
          </View>
          <Text style={styles.infoText}>
            No internet needed. A mobile network signal is required. Standard network
            charges may apply.
          </Text>
        </View>

        {/* Section 1: Verify by SMS */}
        <View style={styles.sectionHeader}>
          <SmsOutlineIcon size={20} color="#161616" />
          <Text style={styles.sectionTitle}>Verify by SMS</Text>
        </View>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>
              Find the product verification code on the packaging.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>
              Open Messages. Send the code to the SMS service number printed on the
              packaging.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>Wait for the verification reply.</Text>
          </View>
        </View>

        <Pressable
          onPress={handleOpenMessages}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open Messages"
        >
          <Text style={styles.actionButtonText}>Open Messages</Text>
        </Pressable>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Section 2: Verify by USSD */}
        <View style={styles.sectionHeader}>
          <UssdPhoneIcon size={20} color="#161616" />
          <Text style={styles.sectionTitle}>Verify by USSD</Text>
        </View>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1.</Text>
            <Text style={styles.stepText}>Find the USSD code on the packaging.</Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2.</Text>
            <Text style={styles.stepText}>Open Phone and dial that USSD code.</Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3.</Text>
            <Text style={styles.stepText}>
              Follow the prompts to enter the product verification code.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>4.</Text>
            <Text style={styles.stepText}>Read the result on your phone.</Text>
          </View>
        </View>

        <Pressable
          onPress={handleOpenDialer}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Open Phone"
        >
          <Text style={styles.actionButtonText}>Open Phone</Text>
        </Pressable>

        {/* Divider Line */}
        <View style={styles.divider} />

        {/* Bottom Important Note */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Important: A valid code alone does not prove the product is genuine. Check
            the HiddenMark and packaging for signs of tampering.
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  heading: {
    fontFamily: 'Geist_700Bold',
    fontSize: 28,
    lineHeight: 34,
    color: '#161616',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subheading: {
    fontFamily: 'Geist_400Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#666666',
    marginBottom: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
  },
  infoIconWrapper: {
    marginRight: 12,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#1E3A8A',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: '#161616',
    marginLeft: 10,
  },
  stepsList: {
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 15,
    lineHeight: 22,
    color: '#2563EB',
    width: 24,
  },
  stepText: {
    flex: 1,
    fontFamily: 'Geist_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: '#161616',
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  actionButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  actionButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#3D52D5',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  disclaimerContainer: {
    marginTop: 4,
  },
  disclaimerText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#666666',
  },
});
