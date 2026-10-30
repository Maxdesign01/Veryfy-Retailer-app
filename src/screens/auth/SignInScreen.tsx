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
import { BadgeIcon } from '../../components/icons/BadgeIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';
import { LockIcon } from '../../components/icons/LockIcon';
import { LoginArrowIcon } from '../../components/icons/LoginArrowIcon';
import { MailIcon } from '../../components/icons/MailIcon';
import { VeryfyLogo } from '../../components/icons/VeryfyLogo';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in your email and password');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }, 700);
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
            paddingBottom: Math.max(insets.bottom, 24) + 16,
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
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.description}>
              Use your manufacturer credentials to continue to the Veryfy workspace.
            </Text>
          </View>

          {/* 3. Sign in credentials */}
          <View style={styles.credentialsContainer}>
            {/* Full Name field */}
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

            {/* Email field */}
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

            {/* Password and recovery */}
            <View style={styles.passwordAndRecovery}>
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

              {/* Forgot password link */}
              <View style={styles.recoveryRow}>
                <Pressable
                  onPress={() => navigation.navigate('ForgotPassword')}
                  hitSlop={8}
                  accessibilityRole="button"
                >
                  <Text style={styles.forgotPasswordText}>Forgot password</Text>
                </Pressable>
              </View>
            </View>

            {/* Error display */}
            {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* 4. Actions */}
          <View style={styles.actionsContainer}>
            {/* Primary Action Button */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={handleSignIn}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Log in"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Log in</Text>
                  <LoginArrowIcon width={12} height={12} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            {/* Account destination row */}
            <View style={styles.destinationRow}>
              <Text style={styles.promptText}>Do not have an account?</Text>
              <Pressable
                style={styles.signUpLink}
                onPress={() => navigation.navigate('CreateAccount')}
                hitSlop={8}
                accessibilityRole="button"
              >
                <Text style={styles.signUpText}>Sign up</Text>
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
    justifyContent: 'center',
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
  passwordAndRecovery: {
    gap: 0,
  },
  visibilityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  recoveryRow: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#1A1B22',
  },
  errorText: {
    fontFamily: 'System',
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
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
  signUpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  signUpText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: '#1A1B22',
  },
});
