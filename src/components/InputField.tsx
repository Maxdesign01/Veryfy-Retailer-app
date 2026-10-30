import React, { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
  isTextArea?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  helperText,
  isPassword = false,
  isTextArea = false,
  containerStyle,
  inputStyle,
  leftIcon,
  value,
  onFocus,
  onBlur,
  editable = true,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isTextArea && styles.textAreaContainer,
          isFocused && styles.focusedInput,
          Boolean(error) && styles.errorInput,
          !editable && styles.disabledInput,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            isTextArea && styles.textAreaInput,
            !editable && styles.disabledText,
            inputStyle,
          ]}
          value={value}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          multiline={isTextArea}
          numberOfLines={isTextArea ? 4 : 1}
          editable={editable}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.textSecondary} />
            ) : (
              <Eye size={20} color={colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

// 6-digit OTP Input component matching Figma Type=OTP
interface OtpInputProps {
  code: string[];
  setCode: (code: string[]) => void;
  error?: string;
}

export const OtpInputField: React.FC<OtpInputProps> = ({ code, setCode, error }) => {
  const inputs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text.slice(-1);
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      <View style={styles.otpRow}>
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const isCurrentFocused = focusedIndex === index;
          const hasValue = Boolean(code[index]);

          return (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={[
                styles.otpBox,
                hasValue && styles.otpBoxFilled,
                isCurrentFocused && styles.otpBoxFocused,
                Boolean(error) && styles.otpBoxError,
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={code[index] || ''}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          );
        })}
      </View>
      {error ? <Text style={styles.otpErrorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    minHeight: 100,
  },
  focusedInput: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.white,
  },
  errorInput: {
    borderColor: colors.borderError,
    backgroundColor: colors.invalidBg,
  },
  disabledInput: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  textAreaInput: {
    textAlignVertical: 'top',
  },
  disabledText: {
    color: colors.disabledText,
  },
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  eyeIcon: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.borderError,
    marginTop: spacing.xs,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // OTP Styles
  otpContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.sm,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  otpBoxFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  otpBoxError: {
    borderColor: colors.borderError,
    backgroundColor: colors.invalidBg,
  },
  otpErrorText: {
    ...typography.captionMedium,
    color: colors.borderError,
    marginTop: spacing.sm,
  },
});
