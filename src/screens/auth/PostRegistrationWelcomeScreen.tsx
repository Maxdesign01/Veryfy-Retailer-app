import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoginArrowIcon } from '../../components/icons/LoginArrowIcon';
import { VeryfyLogoMark } from '../../components/icons/VeryfyLogoMark';

interface PostRegistrationWelcomeScreenProps {
  navigation: any;
}

export const PostRegistrationWelcomeScreen: React.FC<PostRegistrationWelcomeScreenProps> = ({
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const handleHome = () => {
    // Navigate safely into the authenticated Main app tabs with new store state
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: { screen: 'Home', params: { isNewStore: true } },
        },
      ],
    });
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: Math.max(insets.bottom, 24) + 16,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentBlock}>
          {/* 1. Veryfy Standalone V Logomark */}
          <View style={styles.logoContainer}>
            <VeryfyLogoMark width={54} height={59} color="#3D52D5" />
          </View>

          {/* 2. Text Frame: Title & Description */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to verify</Text>
            <Text style={styles.description}>
              {'Your account has successfully been created.\nTap the button below to begin.'}
            </Text>
          </View>

          {/* 3. Primary action button: Home */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={handleHome}
            accessibilityRole="button"
            accessibilityLabel="Home"
          >
            <Text style={styles.primaryButtonText}>Home</Text>
            <LoginArrowIcon width={12} height={12} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F7F7FF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  contentBlock: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    width: 54,
    height: 59,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 81,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 81,
    gap: 13,
  },
  title: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    color: '#2E40B8',
    textAlign: 'center',
  },
  description: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: '#47464B',
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
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
});
