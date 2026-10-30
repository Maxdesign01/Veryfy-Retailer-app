import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, ClipPath, Defs, G, Mask, Path, Rect } from 'react-native-svg';
import { mockVerificationResults } from '../../api/mockData';
import { VerificationResult } from '../../types';

interface VerifyingProductScreenProps {
  navigation: any;
  route: any;
}

// 1. Veryfy Top-Left Logo (Figma 503:4375)
const VeryfyLogo = () => (
  <Svg width={87} height={24} viewBox="0 0 87 24" fill="none">
    <G clipPath="url(#clip0_503_4375)">
      <Path
        d="M7.20857 9.2612L6.22259 11.9702L5.82672 13.0582L5.23662 14.6796L4.25016 17.389L2.67408 13.0582L0 5.71071H5.91635L7.20857 9.2612Z"
        fill="white"
      />
      <Path
        d="M18.671 0L18.0744 1.63781L16.5925 5.71018L13.9184 13.0577L13.2262 14.9594L12.534 13.0577L12.1381 11.9696L14.4163 5.71018L15.8988 1.63781H13.9268L12.4444 5.71018L11.1522 9.2607L10.1662 11.9701V11.9706L9.77031 13.0577L9.18021 14.6791V14.6796L8.19375 17.3885L7.6918 18.7679H10.6681L10.1662 17.3885V17.388L11.1522 14.6796L12.2402 17.6684V17.6688L11.8399 18.7679L11.2542 20.3773V20.3778L11.2438 20.4057H5.12377L5.23583 20.0985V20.098L5.71985 18.7679L6.2218 17.3885L7.20777 14.6791L7.79786 13.0577L8.19375 11.9696L9.17972 9.2607L10.1662 6.55174L10.4719 5.71018L11.9544 1.63781L12.5504 0H18.671Z"
        fill="white"
      />
      <Mask
        id="mask0_503_4375"
        style={{ maskType: 'luminance' } as any}
        maskUnits="userSpaceOnUse"
        x={23}
        y={5}
        width={64}
        height={19}
      >
        <Path d="M86.9708 5.93492H23.7525V23.435H86.9708V5.93492Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_503_4375)">
        <Path
          d="M47.0812 15.1336C47.0812 13.912 46.86 12.8616 46.4203 11.9793C45.9792 11.0971 45.3581 10.4199 44.5586 9.9449C43.7574 9.46985 42.8147 9.23232 41.7303 9.23232C40.646 9.23232 39.6545 9.46985 38.8401 9.9449C38.0259 10.4199 37.3915 11.0809 36.9371 11.9292C36.4826 12.7775 36.2554 13.7778 36.2554 14.9299C36.2554 16.0822 36.4826 17.0869 36.9371 17.941C37.3915 18.7953 38.0287 19.4577 38.849 19.9254C39.6693 20.393 40.6357 20.6275 41.7495 20.6275C43.0654 20.6275 44.2944 20.4152 45.1707 19.738C46.0972 19.0209 46.6992 17.9631 46.9853 16.8774H43.8385C43.8061 17.3008 43.4506 17.7654 43.1038 17.9809C42.7586 18.1978 42.3264 18.307 41.8115 18.307C41.1063 18.307 40.5397 18.0974 40.112 17.6755C39.6841 17.255 39.451 16.6103 39.4097 15.7428H47.0812V15.1321V15.1336ZM39.4097 13.8722C39.4908 13.1124 39.7387 12.5267 40.1531 12.1121C40.5677 11.6976 41.093 11.491 41.7303 11.491C42.3677 11.491 42.8869 11.6872 43.2867 12.0811C43.6866 12.475 43.9079 13.0711 43.9476 13.8722H39.4097Z"
          fill="white"
        />
        <Path
          d="M54.0654 9.47569C53.2791 9.47569 52.6608 9.72059 52.2138 10.2089C51.898 10.5527 51.6517 11.0513 51.4718 11.699L51.401 9.47717H48.5108V20.3826H51.5633V14.2586C51.5633 13.7024 51.6547 13.2613 51.8377 12.9353C52.0206 12.6092 52.295 12.3732 52.6624 12.2227C53.0282 12.0737 53.4973 11.9985 54.0668 11.9985H55.0642V9.47569H54.0668H54.0654Z"
          fill="white"
        />
        <Path
          d="M84.0567 9.47569L81.4704 16.8212L78.8651 9.47569H75.9293L79.767 19.8338H80.4126L80.1884 20.4653C80.0941 20.7235 79.9613 20.9034 79.7916 21.0052C79.622 21.107 79.3608 21.1571 79.0083 21.1571H77.564V23.4365H79.6396C80.4672 23.4365 81.1119 23.2801 81.5722 22.9689C82.0325 22.6561 82.3866 22.1411 82.63 21.4228L86.9704 9.47717H84.0567V9.47569Z"
          fill="white"
        />
        <Path
          d="M64.0392 9.47569L61.4529 16.8212L58.8474 9.47569H55.9116L59.7495 19.8338H60.3951L60.1709 20.4653C60.0764 20.7235 59.9437 20.9034 59.7739 21.0052C59.6043 21.107 59.3433 21.1571 58.9906 21.1571H57.5463V23.4365H59.6221C60.4497 23.4365 61.0944 23.2801 61.5547 22.9689C62.015 22.6561 62.3691 22.1411 62.6125 21.4228L66.9529 9.47717H64.0392V9.47569Z"
          fill="white"
        />
        <Path
          d="M73.8035 8.21428H75.472V5.93492H73.1323C71.9106 5.93492 71.0092 6.23442 70.425 6.83044C69.8423 7.42793 69.5501 8.26148 69.5501 9.33403V9.47565H67.9627V11.755H69.5501V20.3826H72.6026V11.755H75.3097V9.47565H72.6026C72.6026 9.0552 72.6971 8.73949 72.8873 8.52999C73.0777 8.31901 73.383 8.21428 73.8035 8.21428Z"
          fill="white"
        />
        <Path d="M34.44 5.93492L29.2181 20.3826H32.3966L37.6665 5.93492H34.44Z" fill="white" />
        <Path d="M26.7061 5.93492H23.7525L27.6061 16.8773H30.5595L26.7061 5.93492Z" fill="white" />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_503_4375">
        <Rect width={86.49} height={23.3991} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

// 2. Viewfinder Icon with Center Scan Bar (Figma 503:4380)
const ViewfinderRadarIcon = () => (
  <Svg width={34} height={34} viewBox="0 0 34 34" fill="none">
    <Path
      d="M5.666 11.333V5.667h5.667M22.666 5.667h5.667v5.666M28.333 22.667v5.666h-5.667M11.333 28.333H5.666v-5.666"
      stroke="#FFFFFF"
      strokeWidth={2.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9.917 17h14.167"
      stroke="#FFFFFF"
      strokeWidth={2.55}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 3. Check Circle Filled (Figma I503:4393;596:189)
const CheckCircleFilledIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.525 14.496L7.988 11.95a.6.6 0 00-.856.015.6.6 0 00.001.841l2.886 2.902c.144.15.313.225.506.225s.362-.075.506-.225l5.802-5.793a.6.6 0 00.003-.842.6.6 0 00-.872.016l-5.437 5.407zM12.002 21.5c-5.247 0-9.502-4.254-9.502-9.498S6.755 2.5 12.002 2.5s9.498 4.255 9.498 9.502-4.251 9.498-9.498 9.498z"
      fill="#3D52D5"
    />
  </Svg>
);

// 4. Progress Spinner (Figma I503:4394;596:194)
const ProgressSpinnerIcon = ({ size = 20, rotationAnim }: { size?: number; rotationAnim: Animated.Value }) => {
  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate: spin }] }}>
      <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <Circle cx={10} cy={10} r={8.75} stroke="#BFC7FD" strokeWidth={2.5} />
        <Path
          d="M10 0C11.9778 0 13.9112.586 15.5557 1.685c1.6445 1.099 2.9262 2.661 3.6831 4.488.7569 1.828.9549 3.838.5691 5.778-.3859 1.94-1.3383 3.722-2.7368 5.12L15.3033 15.3A7.47 7.47 0 0017.356 11.46c.289-1.455.141-2.963-.427-4.333a7.48 7.48 0 00-2.762-3.363A7.48 7.48 0 0010 2.5V0z"
          fill="#3D52D5"
        />
      </Svg>
    </Animated.View>
  );
};

// 5. Radio Unchecked (Figma I503:4395;596:200)
const RadioUncheckedIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12.003 21.5c-5.247 0-9.503-4.254-9.503-9.498S6.755 2.5 12.003 2.5s9.497 4.255 9.497 9.502-4.25 9.498-9.497 9.498zm0-1.5a8 8 0 100-16 8 8 0 000 16z"
      fill="#666666"
    />
  </Svg>
);

export const VerifyingProductScreen: React.FC<VerifyingProductScreenProps> = ({
  navigation,
  route,
}) => {
  const result: VerificationResult =
    route?.params?.result || mockVerificationResults.verified;

  // Step state:
  // 1 = reading done (checked), checking in-progress (spinner), reviewing pending
  // 2 = reading done, checking done (checked), reviewing in-progress (spinner)
  // 3 = all 3 done
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  // Radar Pulse Animation
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  // Spinner Continuous Rotation
  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spinnerAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();
    return () => spinLoop.stop();
  }, [spinnerAnim]);

  // Step Progression Timers (0ms -> 700ms -> 1400ms -> 1800ms)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(2);
    }, 700);

    const t2 = setTimeout(() => {
      setStep(3);
    }, 1400);

    const t3 = setTimeout(() => {
      if (result.outcome === 'suspicious' || result.outcome === 'counterfeit' || result.outcome === 'invalid') {
        navigation.replace('SuspiciousResult', { result });
      } else {
        navigation.replace('VerificationResult', { result });
      }
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigation, result]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      {/* Top Header Bar with Veryfy Logo */}
      <View style={styles.topBar}>
        <VeryfyLogo />
      </View>

      {/* Center Radar / Viewfinder Section */}
      <View style={styles.centerSection}>
        <View style={styles.radarContainer}>
          {/* Outer Sonar Ring (160x160) */}
          <Animated.View
            style={[
              styles.radarRingOuter,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          {/* Middle Sonar Ring (130x130) */}
          <Animated.View
            style={[
              styles.radarRingMiddle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          {/* Inner Solid Circle (104x104) */}
          <View style={styles.radarCircleInner}>
            <ViewfinderRadarIcon />
          </View>
        </View>

        {/* Headings */}
        <Text style={styles.secureCheckOverline}>SECURE PRODUCT CHECK</Text>
        <Text style={styles.headingTitle}>Verifying product</Text>
        <Text style={styles.headingSubtitle}>This will only take a moment.</Text>
      </View>

      {/* Bottom Checklist Section */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />

        <View style={styles.stepsContainer}>
          {/* Step 1: Reading product code */}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <CheckCircleFilledIcon size={22} />
            </View>
            <Text style={styles.stepLabelActive}>Reading product code</Text>
          </View>

          {/* Step 2: Checking product information */}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              {step >= 2 ? (
                <CheckCircleFilledIcon size={22} />
              ) : (
                <ProgressSpinnerIcon size={20} rotationAnim={spinnerAnim} />
              )}
            </View>
            <Text style={step >= 2 ? styles.stepLabelActive : styles.stepLabelCurrent}>
              Checking product information
            </Text>
          </View>

          {/* Step 3: Reviewing verification details */}
          <View style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              {step === 3 ? (
                <CheckCircleFilledIcon size={22} />
              ) : step === 2 ? (
                <ProgressSpinnerIcon size={20} rotationAnim={spinnerAnim} />
              ) : (
                <RadioUncheckedIcon size={20} />
              )}
            </View>
            <Text style={step === 3 ? styles.stepLabelActive : styles.stepLabelPending}>
              Reviewing verification details
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  radarContainer: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  radarRingOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  radarCircleInner: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureCheckOverline: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A3A3A3',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headingSubtitle: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepLabelActive: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  stepLabelCurrent: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  stepLabelPending: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
});
