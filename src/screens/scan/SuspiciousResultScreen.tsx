import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { BellIcon } from '../../components/icons/BellIcon';
import { ProductPackageIcon } from '../../components/icons/ProductPackageIcon';
import { SuspiciousBadgeIcon } from '../../components/icons/SuspiciousBadgeIcon';
import { mockVerificationResults } from '../../api/mockData';
import { VerificationResult } from '../../types';

interface SuspiciousResultScreenProps {
  navigation: any;
  route: any;
}

export const SuspiciousResultScreen: React.FC<SuspiciousResultScreenProps> = ({
  navigation,
  route,
}) => {
  const result: VerificationResult =
    route?.params?.result || mockVerificationResults.suspicious;

  const product = result.product;
  const isCounterfeit =
    result.outcome === 'counterfeit' || result.outcome === 'invalid';

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Main', { screen: 'Scan' });
    }
  };

  const handleReviewDetails = () => {
    Alert.alert(
      'Inspection Details',
      `Product: ${product.name}\nBatch: ${product.batchNumber}\nManufacturer: ${product.manufacturer}\n\nWarning: The verification code does not match registered batch records from this distributor.`,
      [{ text: 'Close' }]
    );
  };

  const handleReportProduct = () => {
    navigation.navigate('ReportProduct', { prefilledProduct: product });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Nav Bar (Frame 503:4406) */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Back to scanner"
        >
          <ArrowBackIcon size={24} color="#161616" />
        </Pressable>

        <Text style={styles.topBarTitle}>Verification result</Text>

        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={12}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <BellIcon size={24} color="#161616" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Verification Result Card (Frame 503:4409 / 503:4542) */}
        <View style={styles.resultCard}>
          <View
            style={[
              styles.suspiciousBadge,
              isCounterfeit && styles.counterfeitBadge,
            ]}
          >
            <SuspiciousBadgeIcon
              size={14}
              color={isCounterfeit ? '#991B1B' : '#92400E'}
            />
            <Text
              style={[
                styles.suspiciousBadgeText,
                isCounterfeit && styles.counterfeitBadgeText,
              ]}
            >
              {isCounterfeit ? 'Invalid' : 'Suspicious'}
            </Text>
          </View>

          <Text style={styles.resultCardTitle}>
            {isCounterfeit
              ? 'Do not rely on this product.'
              : 'Something needs a closer look.'}
          </Text>
          <Text style={styles.resultCardDescription}>
            {isCounterfeit
              ? 'The verification information associated with this product is invalid or indicates a counterfeit product.'
              : 'Some information associated with this product requires further attention.'}
          </Text>
        </View>

        {/* Product Info Row (Frame 503:4410) */}
        <View style={styles.productInfoBox}>
          <View style={styles.packageIconWrapper}>
            <ProductPackageIcon size={24} color="#666666" />
          </View>

          <View style={styles.productTextCol}>
            <Text style={styles.productBrandText}>
              {(product.brand || 'VITACORE').toUpperCase()}
            </Text>
            <Text style={styles.productNameText} numberOfLines={1}>
              {product.name || 'VitaCore Paracetamol'}
            </Text>
            <Text style={styles.productDetailsText}>
              {product.category || 'Medicine'} · {product.dosageForm || '500 mg tablets'}
            </Text>
          </View>
        </View>

        {/* What We Found / What you should do Section (Frame 503:4418 / 503:4542) */}
        <View style={styles.findingsSection}>
          <Text style={styles.findingsHeading}>
            {isCounterfeit ? 'What you should do' : 'What we found'}
          </Text>
          <View style={styles.divider} />

          {isCounterfeit ? (
            <>
              {/* Finding 1 */}
              <View style={[styles.inlineNotice, styles.counterfeitNotice]}>
                <SuspiciousBadgeIcon size={18} color="#991B1B" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>
                    Do not sell, dispense, or use this product
                  </Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Safety Alert',
                        'This item has not passed regulatory verification. Dispensing it poses severe safety hazards.'
                      )
                    }
                  >
                    <Text style={[styles.noticeLink, styles.counterfeitNoticeLink]}>
                      Learn more
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Finding 2 */}
              <View style={[styles.inlineNotice, styles.counterfeitNotice]}>
                <SuspiciousBadgeIcon size={18} color="#991B1B" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>
                    Quarantine stock immediately
                  </Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Quarantine Protocol',
                        'Isolate this batch from shelves to prevent inadvertent customer sales.'
                      )
                    }
                  >
                    <Text style={[styles.noticeLink, styles.counterfeitNoticeLink]}>
                      Learn more
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Finding 3 */}
              <View style={[styles.inlineNotice, styles.counterfeitNotice]}>
                <SuspiciousBadgeIcon size={18} color="#991B1B" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>
                    Report this product to NAFDAC & distributor
                  </Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Regulatory Enforcement',
                        'Filing a formal report informs enforcement clusters to trace supply chain origins.'
                      )
                    }
                  >
                    <Text style={[styles.noticeLink, styles.counterfeitNoticeLink]}>
                      Learn more
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Finding 1 */}
              <View style={styles.inlineNotice}>
                <SuspiciousBadgeIcon size={18} color="#92400E" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>Product information needs review</Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Information Review',
                        'The registration data reported by distributor differs from manufacturer catalog.'
                      )
                    }
                  >
                    <Text style={styles.noticeLink}>Learn more</Text>
                  </Pressable>
                </View>
              </View>

              {/* Finding 2 */}
              <View style={styles.inlineNotice}>
                <SuspiciousBadgeIcon size={18} color="#92400E" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>Source information is unclear</Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Source Review',
                        'The supply chain checkpoint could not verify upstream licensed distributor credentials.'
                      )
                    }
                  >
                    <Text style={styles.noticeLink}>Learn more</Text>
                  </Pressable>
                </View>
              </View>

              {/* Finding 3 */}
              <View style={styles.inlineNotice}>
                <SuspiciousBadgeIcon size={18} color="#92400E" />
                <View style={styles.noticeTextWrapper}>
                  <Text style={styles.noticeText}>Verification details are incomplete</Text>
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        'Incomplete Details',
                        'Tamper-evident holographic serial seal has not been validated by regional inspection cluster.'
                      )
                    }
                  >
                    <Text style={styles.noticeLink}>Learn more</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Metadata Box (Frame 503:4424) */}
        <View style={styles.metadataBox}>
          <View style={styles.metaCol}>
            <Text style={styles.metaTitle}>CODE</Text>
            <Text style={styles.metaDataText}>
              {result.scannedQrCode || 'VFY-2849-1036'}
            </Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={styles.metaTitle}>CHECKED</Text>
            <Text style={styles.metaDataText}>
              {result.timestamp || 'Today, 10:42 AM'}
            </Text>
          </View>
        </View>

        {/* Action Buttons (Frame 503:4431 / 503:4542) */}
        <View style={styles.actionsContainer}>
          {isCounterfeit ? (
            <>
              <Pressable
                style={styles.primaryButton}
                onPress={handleReportProduct}
                accessibilityRole="button"
                accessibilityLabel="Report product"
              >
                <Text style={styles.primaryButtonText}>Report product</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleReviewDetails}
                accessibilityRole="button"
                accessibilityLabel="Review details"
              >
                <Text style={styles.secondaryButtonText}>Review details</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={styles.primaryButton}
                onPress={handleReviewDetails}
                accessibilityRole="button"
                accessibilityLabel="Review details"
              >
                <Text style={styles.primaryButtonText}>Review details</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={handleReportProduct}
                accessibilityRole="button"
                accessibilityLabel="Report product"
              >
                <Text style={styles.secondaryButtonText}>Report product</Text>
              </Pressable>
            </>
          )}
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
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 20,
    color: '#161616',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  suspiciousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 99,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  counterfeitBadge: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  suspiciousBadgeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
  },
  counterfeitBadgeText: {
    color: '#991B1B',
  },
  resultCardTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 20,
    lineHeight: 26,
    color: '#161616',
    marginBottom: 6,
  },
  resultCardDescription: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  productInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  packageIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productTextCol: {
    flex: 1,
  },
  productBrandText: {
    fontFamily: 'Geist_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    color: '#666666',
  },
  productNameText: {
    fontFamily: 'Geist_700Bold',
    fontSize: 16,
    lineHeight: 22,
    color: '#161616',
    marginTop: 2,
  },
  productDetailsText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  findingsSection: {
    marginBottom: 20,
  },
  findingsHeading: {
    fontFamily: 'Geist_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: '#161616',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginBottom: 12,
  },
  inlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  counterfeitNotice: {
    backgroundColor: '#FEF2F2',
  },
  noticeTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  noticeText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    color: '#161616',
    flex: 1,
  },
  noticeLink: {
    fontFamily: 'Geist_500Medium',
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
  },
  counterfeitNoticeLink: {
    color: '#991B1B',
  },
  metadataBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    padding: 14,
    marginBottom: 24,
  },
  metaCol: {},
  metaTitle: {
    fontFamily: 'Geist_700Bold',
    fontSize: 10,
    color: '#666666',
    marginBottom: 4,
  },
  metaDataText: {
    fontFamily: 'Geist_700Bold',
    fontSize: 14,
    color: '#161616',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 52,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3D52D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#3D52D5',
  },
});
