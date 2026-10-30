import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { VeryfyLogoMark } from '../../components/icons/VeryfyLogoMark';
import { colors } from '../../theme/colors';

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const hasTriggeredRef = useRef(false);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Prevent duplicate timers on rerender
    if (hasTriggeredRef.current) return;

    // 4000 ms delay before starting the transition
    timerRef.current = setTimeout(() => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      if (Platform.OS === 'web') {
        // On Web, native-stack does not animate screen replaces.
        // We run a 300ms ease-out exit transition, then replace the screen at 4300ms.
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.96,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => {
          navigation.replace('Welcome');
        });
      } else {
        // On native platforms (iOS/Android), native-stack executes the 300ms fade transition.
        // Simultaneously animate opacity with ease-out curve.
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();

        navigation.replace('Welcome');
      }
    }, 4000);

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigation, opacityAnim, scaleAnim]);

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.container,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <VeryfyLogoMark width={108} height={118} color="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean background revealed during fade out
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#3D52D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 108,
    height: 118,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
