import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { mockVerificationResults } from '../../api/mockData';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { NavQrScanIcon } from '../../components/icons/NavQrScanIcon';
import { connectivityService } from '../../services/connectivityService';
import { VerificationResult } from '../../types';

interface ScanScreenProps {
  navigation: any;
  route?: any;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [torchOn, setTorchOn] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<'verified' | 'suspicious' | 'no_match' | 'invalid' | 'offline'>('verified');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCode, setManualCode] = useState('VFY-2849-1036');

  // Scanning laser beam animated translation
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 200,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();

    return () => scanLoop.stop();
  }, [scanLineAnim]);

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof navigation?.jumpTo === 'function') {
      navigation.jumpTo('Home');
    } else {
      (navigation?.getParent?.() || navigation).navigate('Main', { screen: 'Home' });
    }
  };

  const handleVerify = async (outcomeToUse?: string) => {
    const outcome = outcomeToUse || selectedOutcome;
    let result: VerificationResult = mockVerificationResults.verified;
    let isConnectionLost = outcome === 'offline';

    if (outcome === 'counterfeit' || outcome === 'invalid') {
      result = mockVerificationResults.counterfeit;
    } else if (outcome === 'suspicious') {
      result = mockVerificationResults.suspicious;
    }

    const netStatus = await connectivityService.getConnectivityStatus();
    if (!netStatus.isOnline) {
      isConnectionLost = true;
    }

    const parentNav = navigation?.getParent?.() || navigation;
    parentNav.navigate('VerifyingProduct', {
      result,
      code: 'VFY-2849-1036',
      isSimulatedOffline: isConnectionLost,
    });
  };

  const handleManualVerify = async () => {
    setIsManualModalOpen(false);
    const code = manualCode.trim();
    const codeLower = code.toLowerCase();
    let result: VerificationResult = mockVerificationResults.verified;
    let isConnectionLost = codeLower.includes('offline') || codeLower.includes('lost');

    if (codeLower.includes('fake') || codeLower.includes('count') || codeLower.includes('inv')) {
      result = mockVerificationResults.counterfeit;
    } else if (codeLower.includes('sus')) {
      result = mockVerificationResults.suspicious;
    }

    const netStatus = await connectivityService.getConnectivityStatus();
    if (!netStatus.isOnline) {
      isConnectionLost = true;
    }

    const parentNav = navigation?.getParent?.() || navigation;
    parentNav.navigate('VerifyingProduct', {
      result,
      code,
      isSimulatedOffline: isConnectionLost,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="light" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.headerIconButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowBackIcon size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.topBarTitle}>Scan product</Text>

        <Pressable
          onPress={() => setTorchOn(!torchOn)}
          hitSlop={12}
          style={styles.headerIconButton}
          accessibilityRole="button"
          accessibilityLabel="Toggle Torch"
        >
          {/* Flashlight icon */}
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 2V5L9 9V22H15V9L17 5V2H7ZM13 13H11V11H13V13ZM15 4H9V3.5H15V4Z"
              fill={torchOn ? '#FBBF24' : '#FFFFFF'}
            />
          </Svg>
        </Pressable>
      </View>

      {/* Subheader Headings */}
      <View style={styles.subHeader}>
        <Text style={styles.headingTitle}>Position the QR code</Text>
        <Text style={styles.headingSubtitle}>
          Align the product QR code within the frame.
        </Text>
      </View>

      {/* Scanner Viewfinder Area */}
      <View style={styles.scannerContainer}>
        <View style={styles.viewfinder}>
          {/* 4 Corner Brackets (240x240 box) */}
          {/* Top-Left */}
          <View style={[styles.corner, styles.cornerTL]} />
          {/* Top-Right */}
          <View style={[styles.corner, styles.cornerTR]} />
          {/* Bottom-Left */}
          <View style={[styles.corner, styles.cornerBL]} />
          {/* Bottom-Right */}
          <View style={[styles.corner, styles.cornerBR]} />

          {/* Animated Laser Scan Line */}
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLineAnim }] },
            ]}
          />

          {/* Floating Torch Button */}
          <Pressable
            style={[
              styles.torchButton,
              torchOn && { backgroundColor: '#FBBF24' },
            ]}
            onPress={() => setTorchOn(!torchOn)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Flashlight"
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M7 2V5L9 9V22H15V9L17 5V2H7ZM13 13H11V11H13V13ZM15 4H9V3.5H15V4Z"
                fill={torchOn ? '#161616' : '#161616'}
              />
            </Svg>
          </Pressable>
        </View>

        <Text style={styles.helperText}>
          Align the product QR code within the frame.
        </Text>
      </View>

      {/* Bottom Sheet Modal Panel (Frame 503:4700) */}
      <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Outcome Selector Chips */}
        <View style={styles.chipsRow}>
          {(['verified', 'suspicious', 'no_match', 'invalid', 'offline'] as const).map(
            (outcome) => {
              const isSelected = selectedOutcome === outcome;
              const labels: Record<string, string> = {
                verified: 'Verified',
                suspicious: 'Suspicious',
                no_match: 'No match',
                invalid: 'Invalid',
                offline: 'Offline lost',
              };
              return (
                <Pressable
                  key={outcome}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedOutcome(outcome)}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {labels[outcome]}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* Primary Verify Button */}
        <Pressable
          style={styles.verifyButton}
          onPress={() => handleVerify()}
          accessibilityRole="button"
          accessibilityLabel="Verify"
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </Pressable>

        {/* Secondary Add code Manually Button */}
        <Pressable
          style={styles.manualButton}
          onPress={() => setIsManualModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Add code Manually"
        >
          <Text style={styles.manualButtonText}>Add code Manually</Text>
        </Pressable>

        {/* Cancel Text Link */}
        <Pressable
          style={styles.cancelButton}
          onPress={handleBack}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        {/* Veryfy Lite Shortcut */}
        <Pressable
          style={styles.liteModeButton}
          onPress={() => connectivityService.openVeryfyLite()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Low signal? Open Veryfy Lite"
        >
          <Text style={styles.liteModeButtonText}>
            ⚡ Low signal? <Text style={styles.liteModeButtonLink}>Open Veryfy Lite (Low Data) &rarr;</Text>
          </Text>
        </Pressable>
      </View>

      {/* Enter Uni-code Manual Modal (Frame 503:4496) */}
      <Modal
        visible={isManualModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsManualModalOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={styles.backdrop}
            onPress={() => setIsManualModalOpen(false)}
          />
          <View
            style={[
              styles.manualSheet,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            {/* Sheet Handle */}
            <View style={styles.handle} />

            {/* Header with Title and Close X Button */}
            <View style={styles.manualHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.manualTitle}>Enter Uni-code</Text>
                <Text style={styles.manualSubtitle}>
                  The code is usually printed on the product packaging.
                </Text>
              </View>
              <Pressable
                onPress={() => setIsManualModalOpen(false)}
                hitSlop={12}
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#161616"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Pressable>
            </View>

            {/* Uni-code Input Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Uni-code</Text>
              <TextInput
                style={styles.textInput}
                value={manualCode}
                onChangeText={setManualCode}
                placeholder="VFY-2849-1036"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            {/* Inline Notice Box */}
            <View style={styles.noticeBox}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="10" stroke="#666666" strokeWidth="2" />
                <Path d="M12 16V12M12 8H12.01" stroke="#666666" strokeWidth="2" strokeLinecap="round" />
              </Svg>
              <Text style={styles.noticeText}>
                Check every letter and number carefully before verifying.
              </Text>
            </View>

            {/* Modal Actions */}
            <View style={styles.manualActions}>
              <Pressable
                style={styles.verifyProductButton}
                onPress={handleManualVerify}
                accessibilityRole="button"
                accessibilityLabel="Verify product"
              >
                <Text style={styles.verifyProductText}>Verify product</Text>
              </Pressable>

              <Pressable
                style={styles.scanInsteadButton}
                onPress={() => setIsManualModalOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Scan instead"
              >
                <NavQrScanIcon size={18} color="#3D52D5" />
                <Text style={styles.scanInsteadText}>Scan instead</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerIconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  headingSubtitle: {
    fontSize: 13,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  viewfinder: {
    width: 240,
    height: 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scanLine: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#3D52D5',
    shadowColor: '#3D52D5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  torchButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  helperText: {
    marginTop: 18,
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#3D52D5',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666666',
  },
  chipTextSelected: {
    color: '#3D52D5',
  },
  verifyButton: {
    height: 48,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  verifyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  manualButton: {
    height: 48,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3D52D5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  manualButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D52D5',
  },
  cancelButton: {
    alignSelf: 'center',
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3D52D5',
  },
  liteModeButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  liteModeButtonText: {
    fontSize: 13,
    color: '#64748B',
  },
  liteModeButtonLink: {
    color: '#3D52D5',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  manualSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  manualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  manualTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#161616',
    marginBottom: 4,
  },
  manualSubtitle: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#161616',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#161616',
    letterSpacing: 0.5,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#666666',
  },
  manualActions: {
    gap: 10,
  },
  verifyProductButton: {
    height: 48,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyProductText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scanInsteadButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanInsteadText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3D52D5',
  },
});
