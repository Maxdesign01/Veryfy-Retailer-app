import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { LocationPinIcon } from '../../components/icons/LocationPinIcon';
import { RadioIcon } from '../../components/icons/RadioIcon';
import { VeryfyBottomNav } from '../../components/VeryfyBottomNav';
import { mockReports } from '../../api/mockData';
import { Product, ProductReport, ReportCategory } from '../../types';

interface ReportProductScreenProps {
  navigation: any;
  route: any;
}

const REPORT_REASONS: ReportCategory[] = [
  'Suspected counterfeit',
  'Verification failed',
  'Packaging looks unusual',
  'Product source is unclear',
  'Other',
];

export const ReportProductScreen: React.FC<ReportProductScreenProps> = ({
  navigation,
  route,
}) => {
  const prefilledProduct: Partial<Product> | undefined =
    route?.params?.prefilledProduct;

  const [productName, setProductName] = useState(prefilledProduct?.name || '');
  const [selectedReason, setSelectedReason] =
    useState<ReportCategory>('Suspected counterfeit');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState('Main store');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', { screen: 'Reports' });
    }
  };

  const handleAddPhoto = () => {
    setHasPhoto(!hasPhoto);
    Alert.alert(
      hasPhoto ? 'Photo Removed' : 'Photo Attached',
      hasPhoto
        ? 'The attached packaging photo has been removed.'
        : 'Sample packaging photo has been captured and attached to the report.'
    );
  };

  const handleSubmit = () => {
    if (!productName.trim()) {
      setErrorMessage('Please input the product name');
      return;
    }
    setErrorMessage('');

    const newReportId = `VFY-RP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReport: ProductReport = {
      id: `rep-${Date.now()}`,
      reportId: newReportId,
      productName: productName.trim(),
      category: selectedReason,
      description: details.trim() || 'Reported by retailer for safety review.',
      status: 'Open',
      dateSubmitted: 'Today, Just now',
      batchNumber: prefilledProduct?.batchNumber || 'BN-PENDING',
      photoUri: hasPhoto ? 'attached-photo' : undefined,
    };

    // Prepend to mock data list
    mockReports.unshift(newReport);

    // Navigate to Figma "Report received" confirmation screen
    navigation.navigate('ReportSuccess', {
      reportId: newReportId,
      productName: productName.trim(),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top App Bar (Frame 503:4440) */}
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
          <Text style={styles.topBarTitle}>Report a product</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Step header (Frame 503:4443) */}
          <View style={styles.stepHeader}>
            <Text style={styles.stepBadgeText}>STEP 1 OF 1</Text>
            <Text style={styles.questionTitle}>
              Why are you reporting this product?
            </Text>
            <Text style={styles.questionSubtitle}>
              Your report helps us review potentially unsafe products.
            </Text>
          </View>

          {/* Product name field (503:4448) */}
          <View style={styles.fieldGroup}>
            <View
              style={[
                styles.inputBox,
                errorMessage ? styles.inputBoxError : null,
              ]}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Input the product name"
                placeholderTextColor="#666666"
                value={productName}
                onChangeText={(val) => {
                  setProductName(val);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </View>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          {/* Radio Reasons Group (Frame 503:4449) */}
          <View style={styles.radioGroup}>
            {REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <Pressable
                  key={reason}
                  style={styles.radioRow}
                  onPress={() => setSelectedReason(reason)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <RadioIcon selected={isSelected} size={20} color="#3D52D5" />
                  <Text style={styles.radioLabel}>{reason}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Add Details Section (Frame 503:4465) */}
          <View style={styles.detailsSection}>
            <View style={styles.detailsHeaderRow}>
              <Text style={styles.detailsHeading}>Add details</Text>
              <Text style={styles.optionalBadge}>Optional</Text>
            </View>

            {/* Photo Upload Box (503:4469) */}
            <Pressable
              style={styles.photoUploadCard}
              onPress={handleAddPhoto}
              accessibilityRole="button"
              accessibilityLabel="Add photo"
            >
              <View style={styles.photoIconWrapper}>
                <LocationPinIcon width={18} height={18} color="#0A0A0A" />
              </View>
              <View style={styles.photoTextCol}>
                <Text style={styles.photoCardTitle}>
                  {hasPhoto ? 'Photo attached (1)' : 'Add photo'}
                </Text>
                <Text style={styles.photoCardSubtitle}>
                  Optional · JPG or PNG, up to 5 MB
                </Text>
              </View>
              <ChevronRightIcon size={20} color="#0A0A0A" />
            </Pressable>

            {/* Textarea for comments (503:4470) */}
            <View style={styles.textAreaBox}>
              <TextInput
                style={styles.textAreaInput}
                placeholder="Tell us what you noticed"
                placeholderTextColor="#666666"
                multiline
                numberOfLines={3}
                value={details}
                onChangeText={setDetails}
                textAlignVertical="top"
              />
            </View>

            {/* Location input (503:4471) */}
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Add location"
                placeholderTextColor="#666666"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Submit Button (Frame 503:4438) */}
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Submit Report"
          >
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Unified Bottom Nav with Reports active */}
      <VeryfyBottomNav activeTab="Reports" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
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
    fontSize: 16,
    color: '#0A0A0A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
  },
  stepHeader: {
    marginBottom: 20,
  },
  stepBadgeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 12,
    letterSpacing: 0.5,
    color: '#666666',
    marginBottom: 6,
  },
  questionTitle: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    color: '#0A0A0A',
    marginBottom: 6,
  },
  questionSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#666666',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  inputBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputBoxError: {
    borderColor: '#DC2626',
  },
  textInput: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#0A0A0A',
    padding: 0,
  },
  errorText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  radioGroup: {
    marginBottom: 24,
    gap: 14,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#0A0A0A',
    marginLeft: 10,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailsHeading: {
    fontFamily: 'Geist_700Bold',
    fontSize: 14,
    color: '#0A0A0A',
  },
  optionalBadge: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#767676',
  },
  photoUploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  photoIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  photoTextCol: {
    flex: 1,
  },
  photoCardTitle: {
    fontFamily: 'Geist_500Medium',
    fontSize: 14,
    color: '#161616',
  },
  photoCardSubtitle: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  textAreaBox: {
    minHeight: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  textAreaInput: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#0A0A0A',
    padding: 0,
  },
  submitButton: {
    height: 52,
    backgroundColor: '#3D52D5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    paddingTop: 8,
    paddingHorizontal: 10,
    minHeight: 83,
  },
  tabItem: {
    width: 70,
    height: 51,
    borderRadius: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: '#F7F7FF',
  },
  tabIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: 'Geist_500Medium',
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#2E40B8',
  },
  scanTabWrapper: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3D52D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
