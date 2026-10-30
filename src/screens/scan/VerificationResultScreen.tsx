import React, { useEffect } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { ProductPackageIcon } from '../../components/icons/ProductPackageIcon';
import { VerifiedBadgeRosetteIcon } from '../../components/icons/VerifiedBadgeRosetteIcon';
import { mockVerificationResults } from '../../api/mockData';
import { VerificationResult } from '../../types';

interface VerificationResultScreenProps {
  navigation: any;
  route: any;
}

export const VerificationResultScreen: React.FC<VerificationResultScreenProps> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const result: VerificationResult =
    route?.params?.result || mockVerificationResults.verified;

  useEffect(() => {
    // If the scanned outcome is suspicious or counterfeit, redirect to SuspiciousResult
    if (result.outcome === 'suspicious' || result.outcome === 'counterfeit') {
      navigation.replace('SuspiciousResult', { result });
    }
  }, [result.outcome, navigation]);

  if (result.outcome === 'suspicious' || result.outcome === 'counterfeit') {
    return <View style={styles.redirectContainer} />;
  }

  const product = result.product;

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', { screen: 'Scan' });
    }
  };

  const handleAddStock = () => {
    navigation.navigate('AddStock', { product });
  };

  const handleScanNext = () => {
    navigation.navigate('Main', { screen: 'Scan' });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowBackIcon size={24} color="#0A0A0A" />
        </Pressable>
        <Text style={styles.topBarTitle}>Product Verification</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Product Image */}
        <View style={styles.heroImageContainer}>
          <Image
            source={
              product.imageUrl
                ? { uri: product.imageUrl }
                : require('../../../assets/cerave_lotion.png')
            }
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Product Row with Package Cube Icon */}
        <View style={styles.productRow}>
          <View style={styles.packageIconBox}>
            <ProductPackageIcon size={20} color="#161616" />
          </View>
          <View style={styles.productTextCol}>
            <Text style={styles.productNameText} numberOfLines={1}>
              {product.name || 'Cerave Moisturizing Lotion'}
            </Text>
            <Text style={styles.productSubtitleText} numberOfLines={1}>
              {product.category || 'Skincare'} · {product.packageSize || '235 ml'}
            </Text>
          </View>
        </View>

        {/* The Uni-Code Matched Card (Light green with Verified badge) */}
        <View style={styles.matchedCard}>
          <View style={styles.verifiedBadge}>
            <VerifiedBadgeRosetteIcon size={14} color="#010B4F" />
            <Text style={styles.verifiedBadgeText}>Verified</Text>
          </View>

          <Text style={styles.matchedCardTitle}>The Uni-Code matched.</Text>
          <Text style={styles.matchedCardDescription}>
            The Uni Code matched a registered product, with no suspicious activity detected.
          </Text>
        </View>

        {/* Product Details Section Card */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeading}>Product details</Text>

          <View style={styles.detailsCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Uni-code</Text>
              <Text style={styles.metaValue}>
                {result.scannedQrCode || product.batchNumber || 'VFY-2849-1036'}
              </Text>
            </View>
            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Manufacturer</Text>
              <Text style={styles.metaValue}>
                {product.manufacturer || 'VitaCore Health Ltd.'}
              </Text>
            </View>
            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date Approved</Text>
              <Text style={styles.metaValue}>
                {product.mfgDate || '2024-01-30'}
              </Text>
            </View>
            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Expiry Date</Text>
              <Text style={styles.metaValue}>
                {product.expDate || '2029-01-29'}
              </Text>
            </View>
            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>NAFDAC No</Text>
              <Text style={styles.metaValue}>
                {product.nafdacRegNo || '01-5391'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={[
            styles.actionsContainer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Pressable
            style={styles.primaryButton}
            onPress={handleAddStock}
            accessibilityRole="button"
            accessibilityLabel="Add to inventory"
          >
            <Text style={styles.primaryButtonText}>Add to inventory</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleScanNext}
            accessibilityRole="button"
            accessibilityLabel="Scan a product"
          >
            <Text style={styles.secondaryButtonText}>Scan a product</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  redirectContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 18,
    color: '#0A0A0A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  heroImageContainer: {
    height: 180,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroImage: {
    width: 100,
    height: 160,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productTextCol: {
    flex: 1,
  },
  productNameText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#161616',
  },
  productSubtitleText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  matchedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#85F467',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  verifiedBadgeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#010B4F',
    marginLeft: 4,
  },
  matchedCardTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: '#161616',
    marginBottom: 6,
  },
  matchedCardDescription: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailsHeading: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  detailsCard: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metaLabel: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    color: '#666666',
  },
  metaValue: {
    fontFamily: 'Geist_500Medium',
    fontSize: 13,
    color: '#161616',
    textAlign: 'right',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3D52D5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 15,
    color: '#3D52D5',
  },
});
