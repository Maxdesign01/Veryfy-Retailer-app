import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { StatusBar } from 'expo-status-bar';
import { ArrowBackIcon } from '../../components/icons/ArrowBackIcon';
import { ChevronDownIcon } from '../../components/icons/ChevronDownIcon';
import { LocationPinIcon } from '../../components/icons/LocationPinIcon';
import { VerifiedBadgeIcon } from '../../components/icons/VerifiedBadgeIcon';
import { VeryfyBottomNav } from '../../components/VeryfyBottomNav';
import { inventoryService } from '../../services/inventoryService';
import { InventoryItem, Product } from '../../types';

interface AddStockScreenProps {
  navigation: any;
  route?: {
    params?: {
      product?: Product;
      onAdded?: (item: InventoryItem) => void;
    };
  };
}

const DEFAULT_PRODUCT: Product = {
  id: 'prod-cerave',
  name: 'Cerave Moisturizing Lotion',
  brand: 'Cerave',
  category: 'Skincare',
  manufacturer: 'VitaCore Health Ltd.',
  nafdacRegNo: '01-5391',
  batchNumber: 'VFY-2849-1036',
  mfgDate: '2024-01-30',
  expDate: '2029-01-29',
  packageSize: '235 ml',
};

const AVAILABLE_LOCATIONS = [
  'Main store',
  'Backroom storage',
  'Display shelf A',
  'Display shelf B',
  'Warehouse branch',
];

export const AddStockScreen: React.FC<AddStockScreenProps> = ({
  navigation,
  route,
}) => {
  const product = route?.params?.product || DEFAULT_PRODUCT;

  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Main store');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation?.navigate('Main', { screen: 'Inventory' });
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    const trimmedQty = quantity.trim();
    if (!trimmedQty) {
      setErrorMessage('Please enter the quantity in stock');
      return;
    }

    // Validate that quantity is a strictly positive whole number
    const isWholeNumber = /^[1-9]\d*$/.test(trimmedQty);
    if (!isWholeNumber) {
      setErrorMessage('Quantity must be a positive whole number (e.g. 10)');
      return;
    }

    const qtyNum = parseInt(trimmedQty, 10);
    setErrorMessage('');
    setIsSaving(true);

    try {
      const newItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        product,
        quantityInStock: qtyNum,
        lastVerifiedDate: 'Just now',
        status: 'verified',
        notes: notes.trim()
          ? `${location ? `[${location}] ` : ''}${notes.trim()}`
          : location
          ? `[${location}]`
          : undefined,
      };

      // Persist to unified inventory service
      inventoryService.addItem(newItem);

      // Trigger optional callback
      if (route?.params?.onAdded) {
        route.params.onAdded(newItem);
      }

      if (Platform.OS === 'web') {
        navigation.navigate('Main', {
          screen: 'Inventory',
          params: { newItem },
        });
        return;
      }

      Alert.alert(
        'Stock Added',
        `${qtyNum} unit${qtyNum > 1 ? 's' : ''} of ${product.name} have been added to your inventory.`,
        [
          {
            text: 'View Inventory',
            onPress: () => {
              navigation.navigate('Main', {
                screen: 'Inventory',
                params: { newItem },
              });
            },
          },
        ]
      );
    } catch {
      Alert.alert(
        'Save Failed',
        'Could not save stock to inventory. Please check your network and try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectLocation = (loc: string) => {
    setLocation(loc);
    setShowLocationPicker(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header section (Frame 503:4238) */}
          <View style={styles.headerContainer}>
            <Pressable
              onPress={handleBack}
              hitSlop={12}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <ArrowBackIcon size={24} color="#0A0A0A" />
            </Pressable>

            <Text style={styles.titleText}>Add stock to Inventory</Text>

            <Text style={styles.subtitleText}>
              Enter the quantity you have in stock for this product. This will be added to your inventory.
            </Text>
          </View>

          {/* Selected Product Card (Frame 503:4245 - Light Lavender Card) */}
          <View style={styles.productCard}>
            <View style={styles.productImageWrapper}>
              <Image
                source={
                  product.imageUrl
                    ? { uri: product.imageUrl }
                    : require('../../../assets/cerave_lotion.png')
                }
                style={styles.productImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.productDetailsCol}>
              <Text style={styles.productNameText} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={styles.productSubtitleText} numberOfLines={1}>
                {product.category} · {product.packageSize || '235 ml'}
              </Text>

              {/* Authentic Status Badge (Frame 503:4251) */}
              <View style={styles.statusBadge}>
                <VerifiedBadgeIcon size={13} color="#161616" />
                <Text style={styles.statusBadgeText}>Authentic</Text>
              </View>
            </View>
          </View>

          {/* Form Fields Container */}
          <View style={styles.formContainer}>
            {/* Field: Quantity in Stock * (Frame 503:4252) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Quantity in Stock *</Text>
              <View
                style={[
                  styles.inputBox,
                  errorMessage ? styles.inputBoxError : null,
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  placeholder="E.g 10"
                  placeholderTextColor="#767676"
                  value={quantity}
                  onChangeText={(val) => {
                    setQuantity(val);
                    if (errorMessage) setErrorMessage('');
                  }}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  editable={!isSaving}
                />
              </View>
              {errorMessage ? (
                <Text style={styles.fieldErrorText}>{errorMessage}</Text>
              ) : (
                <Text style={styles.fieldDescription}>
                  Enter the total number of units in your stock
                </Text>
              )}
            </View>

            {/* Field: Location (Optional) (Frame 503:4254) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location (Optional)</Text>
              <Pressable
                style={styles.locationSelectorBox}
                onPress={() => setShowLocationPicker(!showLocationPicker)}
                accessibilityRole="button"
                accessibilityLabel="Select location"
                disabled={isSaving}
              >
                <View style={styles.locationLeftRow}>
                  <LocationPinIcon width={16} height={16} color="#666666" />
                  <Text style={styles.locationValueText}>{location}</Text>
                </View>
                <ChevronDownIcon width={10} height={7} color="#666666" />
              </Pressable>

              {/* Location Options Dropdown */}
              {showLocationPicker && (
                <View style={styles.dropdownMenu}>
                  {AVAILABLE_LOCATIONS.map((loc) => {
                    const isSelected = loc === location;
                    return (
                      <Pressable
                        key={loc}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleSelectLocation(loc)}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.dropdownItemTextSelected,
                          ]}
                        >
                          {loc}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Field: Notes (Optional) (Frame 503:4267) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Notes (Optional)</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Any additional information"
                  placeholderTextColor="#767676"
                  value={notes}
                  onChangeText={setNotes}
                  autoCapitalize="sentences"
                  editable={!isSaving}
                />
              </View>
            </View>
          </View>

          {/* Primary Save Button (Frame 503:4269) */}
          <Pressable
            style={[
              styles.saveButton,
              isSaving && { opacity: 0.7 },
            ]}
            onPress={handleSave}
            disabled={isSaving}
            accessibilityRole="button"
            accessibilityLabel="Save to inventory"
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save to inventory</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Shared Bottom Navigation matching the reference */}
      <VeryfyBottomNav activeTab="Inventory" navigation={navigation} />
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
  },
  headerContainer: {
    marginBottom: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 22,
    lineHeight: 30,
    color: '#0A0A0A',
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    lineHeight: 19,
    color: '#666666',
  },
  productCard: {
    backgroundColor: '#F5F6FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  productImageWrapper: {
    width: 54,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: 44,
    height: 62,
  },
  productDetailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  productNameText: {
    fontFamily: 'Geist_600SemiBold',
    fontSize: 15,
    lineHeight: 20,
    color: '#161616',
    marginBottom: 2,
  },
  productSubtitleText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  statusBadgeText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 11,
    color: '#166534',
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  fieldGroup: {
    width: '100%',
  },
  fieldLabel: {
    fontFamily: 'Geist_500Medium',
    fontSize: 13,
    color: '#161616',
    marginBottom: 6,
  },
  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  textInput: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#161616',
  },
  fieldDescription: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11,
    color: '#666666',
    marginTop: 4,
  },
  fieldErrorText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
  },
  locationSelectorBox: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  locationLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationValueText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 14,
    color: '#161616',
  },
  dropdownMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontFamily: 'Geist_400Regular',
    fontSize: 13,
    color: '#374151',
  },
  dropdownItemTextSelected: {
    color: '#2E40B8',
    fontFamily: 'Geist_600SemiBold',
  },
  saveButton: {
    height: 50,
    backgroundColor: '#3D52D5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontFamily: 'Geist_500Medium',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
