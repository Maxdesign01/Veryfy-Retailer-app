import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Mail } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { TopNavBar } from '../../components/TopNavBar';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = () => {
    if (!emailOrPhone) {
      setError('Please enter your registered email or phone');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <View style={styles.container}>
      <TopNavBar
        type="inner"
        title="Reset Password"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {isSubmitted ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconBox}>
              <CheckCircle2 size={44} color={colors.verified} />
            </View>
            <Text style={styles.title}>Recovery Link Sent</Text>
            <Text style={styles.subtitle}>
              We have dispatched password recovery instructions to{' '}
              <Text style={styles.boldText}>{emailOrPhone}</Text>. Check your inbox or SMS.
            </Text>
            <Button
              title="Return to Sign In"
              onPress={() => navigation.navigate('SignIn')}
              style={{ width: '100%', marginTop: spacing.xl }}
            />
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter the email or phone number linked with your retailer store account to receive a reset code.
              </Text>
            </View>

            <InputField
              label="Registered Store Email / Phone"
              placeholder="e.g. samuel@ikejacentral.ng"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              leftIcon={<Mail size={18} color={colors.textSecondary} />}
              error={error}
            />

            <Button
              title="Send Recovery Code"
              onPress={handleReset}
              loading={loading}
              style={styles.submitBtn}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.xl,
    flex: 1,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.verifiedBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
