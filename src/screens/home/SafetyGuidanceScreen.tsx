import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';

interface SafetyGuidanceScreenProps {
  navigation: any;
  route?: any;
}

interface GuidanceItem {
  id: string;
  step: string;
  title: string;
  description: string;
}

const GUIDANCE_ITEMS: GuidanceItem[] = [
  {
    id: '01',
    step: '01',
    title: 'Check the source',
    description: 'Buy from trusted and traceable suppliers where possible.',
  },
  {
    id: '02',
    step: '02',
    title: 'Check the packaging',
    description: 'Look for unusual packaging or differences.',
  },
  {
    id: '03',
    step: '03',
    title: 'Check the price',
    description:
      'An unusually low price can be a warning sign, but price alone does not prove a product is counterfeit.',
  },
  {
    id: '04',
    step: '04',
    title: 'Verify before use',
    description:
      'Use Veryfy whenever a supported verification code is available.',
  },
];

export const SafetyGuidanceScreen: React.FC<SafetyGuidanceScreenProps> = ({
  navigation,
  route,
}) => {
  const fromNewStore = route?.params?.fromNewStore ?? false;

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', {
        screen: 'Home',
        params: { isNewStore: fromNewStore },
      });
    }
  };

  const handleScanProduct = () => {
    navigation.navigate('Main', { screen: 'Scan' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      {/* Top Bar with Back Arrow and Centered Title */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ArrowBackIcon size={20} color="#0A0A0A" />
        </Pressable>
        <Text style={styles.topBarTitle}>Safety guidance</Text>
        <View style={styles.topBarPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerBlock}>
          <Text style={styles.overline}>EVERYDAY CHECKS</Text>
          <Text style={styles.mainTitle}>
            Stay safer when buying products
          </Text>
          <Text style={styles.leadSubtitle}>
            Simple signs can help you decide when to verify.
          </Text>
        </View>

        {/* Divider line below header */}
        <View style={styles.divider} />

        {/* Numbered Guidance List */}
        <View style={styles.guidanceList}>
          {GUIDANCE_ITEMS.map((item) => (
            <View key={item.id} style={styles.guidanceRowContainer}>
              <View style={styles.guidanceRow}>
                <Text style={styles.stepNumber}>{item.step}</Text>
                <View style={styles.textColumn}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
          ))}
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.scanButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleScanProduct}
            accessibilityRole="button"
            accessibilityLabel="Scan product"
          >
            <Text style={styles.scanButtonText}>Scan product</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  topBarTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    lineHeight: 22.4,
    color: '#161616',
    textAlign: 'center',
  },
  topBarPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 28,
  },
  headerBlock: {
    marginTop: 8,
    marginBottom: 16,
  },
  overline: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  mainTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 30,
    lineHeight: 36,
    color: '#161616',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  leadSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
  },
  guidanceList: {
    marginTop: 0,
  },
  guidanceRowContainer: {
    width: '100%',
  },
  guidanceRow: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    lineHeight: 16.8,
    color: '#666666',
    paddingTop: 2,
  },
  textColumn: {
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: '#161616',
    marginBottom: 4,
  },
  itemDescription: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#666666',
  },
  ctaContainer: {
    marginTop: 28,
  },
  scanButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  scanButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#FFFFFF',
  },
});
