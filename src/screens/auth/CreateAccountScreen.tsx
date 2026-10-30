import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { BadgeIcon } from '../../components/icons/BadgeIcon';
import { BusinessNameIcon } from '../../components/icons/BusinessNameIcon';
import { CheckCircleIcon } from '../../components/icons/CheckCircleIcon';
import { ChevronDownIcon } from '../../components/icons/ChevronDownIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { LocationPinIcon } from '../../components/icons/LocationPinIcon';
import { LockIcon } from '../../components/icons/LockIcon';
import { LoginArrowIcon } from '../../components/icons/LoginArrowIcon';
import { MailIcon } from '../../components/icons/MailIcon';
import { ShieldCheckIcon } from '../../components/icons/ShieldCheckIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';

interface CreateAccountScreenProps {
  navigation: any;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode] = useState('+234 (NG)');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (
      !fullName.trim() ||
      !businessName.trim() ||
      !businessLocation.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Navigate to OTP verification with user phone/email
      navigation.navigate('OtpVerification', {
        phoneOrEmail: phone || email,
        purpose: 'register',
      });
    }, 600);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24) + 16,
            paddingBottom: Math.max(insets.bottom, 24) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* 1. Logo area */}
          <View style={styles.logoArea}>
            <VeryfyLogo width={120} height={32} color="#3D52D5" />
          </View>

          {/* 2. Header */}
          <View style={styles.header}>
            <Text style={styles.accessLabel}>RETAILER ACCESS</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.description}>
              Create your manufacturer credentials to continue to the Veryfy workspace.
            </Text>
          </View>

          {/* 3. Account credentials / Form fields */}
          <View style={styles.credentialsContainer}>
            {/* Full Name */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <BadgeIcon width={15} height={15} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (error) setError('');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor="#8C8D95"
                />
              </View>
            </View>

            {/* Business Name */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Business Name</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <BusinessNameIcon width={15} height={15} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={businessName}
                  onChangeText={(text) => {
                    setBusinessName(text);
                    if (error) setError('');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor="#8C8D95"
                />
              </View>
            </View>

            {/* Business Location */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Business Location</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <LocationPinIcon width={15} height={15} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={businessLocation}
                  onChangeText={(text) => {
                    setBusinessLocation(text);
                    if (error) setError('');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor="#8C8D95"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <MailIcon width={15} height={12} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError('');
                  }}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#8C8D95"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <View style={styles.phoneRow}>
                {/* Country choice dropdown */}
                <View style={styles.countryChoice}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                  <ChevronDownIcon width={9} height={6} color="#5D5E66" />
                </View>

                {/* Number input */}
                <View style={styles.numberInputContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={phone}
                    onChangeText={(text) => {
                      setPhone(text);
                      if (error) setError('');
                    }}
                    keyboardType="phone-pad"
                    placeholderTextColor="#8C8D95"
                  />
                </View>
              </View>
            </View>

            {/* Password */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <LockIcon width={12} height={16} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#8C8D95"
                />
                <Pressable
                  style={styles.visibilityButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={8}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <EyeIcon width={17} height={12} color="#5D5E66" crossed={showPassword} />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <View style={styles.fieldIconWrapper}>
                  <ShieldCheckIcon width={12} height={15} color="#5D5E66" />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (error) setError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#8C8D95"
                />
                <Pressable
                  style={styles.visibilityButton}
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  hitSlop={8}
                  accessibilityLabel={showConfirmPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <CheckCircleIcon width={15} height={15} color="#5D5E66" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* 4. Consent / Terms Checkbox */}
          <Pressable
            style={styles.consentRow}
            onPress={() => {
              setAgreeTerms((prev) => !prev);
              if (error) setError('');
            }}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreeTerms }}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
              {agreeTerms && (
                <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <Path
                    d="M2.5 6.5L4.5 8.5L9.5 3.5"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </View>
            <Text style={styles.consentStatement}>
              I agree to the <Text style={styles.underlinedText}>Terms of Service</Text>,{' '}
              <Text style={styles.underlinedText}>Privacy Policy</Text>, and cluster usage
              governance protocols.
            </Text>
          </Pressable>

          {/* Error Message */}
          {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}

          {/* 5. Actions */}
          <View style={styles.actionsContainer}>
            {/* Primary Action Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleRegister}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="CREATE ACCOUNT"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>CREATE ACCOUNT</Text>
                  <LoginArrowIcon width={12} height={12} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            {/* Account destination */}
            <View style={styles.destinationRow}>
              <Text style={styles.promptText}>Already have an account?</Text>
              <Pressable
                style={styles.signInLink}
                onPress={() => navigation.navigate('SignIn')}
                hitSlop={8}
                accessibilityRole="button"
              >
                <Text style={styles.signInText}>Sign in</Text>
                <ChevronRightIcon width={5} height={7} color="#1A1B22" />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    padding: 24,
    // Figma drop shadow: offset (0, 8), radius 24, color rgba(0,0,0,0.05)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 2,
  },
  logoArea: {
    height: 32,
    marginBottom: 28,
  },
  header: {
    marginBottom: 28,
    gap: 8,
  },
  accessLabel: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: '#5D5E66',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    color: '#1A1B22',
  },
  description: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#47464B',
  },
  credentialsContainer: {
    marginBottom: 28,
    gap: 18,
  },
  formField: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#1A1B22',
  },
  inputContainer: {
    height: 50,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    paddingLeft: 14,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldIconWrapper: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    height: 50,
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22,
    color: '#1A1B22',
    padding: 0,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryChoice: {
    width: 124,
    height: 50,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryCodeText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: '#1A1B22',
  },
  numberInputContainer: {
    flex: 1,
    height: 50,
    backgroundColor: '#FBFBFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F3F3',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  visibilityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 28,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 3,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3D52D5',
    borderColor: '#3D52D5',
  },
  consentStatement: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#47464B',
  },
  underlinedText: {
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 8,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonPressed: {
    backgroundColor: '#2F40B5',
  },
  primaryButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  destinationRow: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  promptText: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: '#47464B',
  },
  signInLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  signInText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1A1B22',
  },
});
