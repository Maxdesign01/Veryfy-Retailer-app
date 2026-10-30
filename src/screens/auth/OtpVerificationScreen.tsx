import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { OtpInputField } from '../../components/InputField';
import { TopNavBar } from '../../components/TopNavBar';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface OtpVerificationScreenProps {
  navigation: any;
  route: any;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const phoneOrEmail = route?.params?.phoneOrEmail || '+234 803 123 4567';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Success: navigate to post-registration confirmation if registering, otherwise Main dashboard
      if (route?.params?.purpose === 'register') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'PostRegistrationWelcome' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    }, 800);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      setCode(['', '', '', '', '', '']);
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <TopNavBar
        type="inner"
        title="Verify Account"
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={36} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit security code to{' '}
          <Text style={styles.highlightText}>{phoneOrEmail}</Text>.
        </Text>

        <OtpInputField code={code} setCode={setCode} error={error} />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <Pressable
            onPress={handleResend}
            disabled={timer > 0}
            hitSlop={8}
          >
            <Text
              style={[
                styles.resendLink,
                timer > 0 && styles.resendLinkDisabled,
              ]}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend code'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Verify & Continue"
          onPress={handleVerify}
          loading={loading}
          disabled={code.join('').length < 6}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  content: {
    padding: spacing.xl,
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  highlightText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  resendLink: {
    ...typography.captionMedium,
    color: colors.primary,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    color: colors.disabledText,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
