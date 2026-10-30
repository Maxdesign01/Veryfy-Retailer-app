import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { mockProducts } from '../../api/mockData';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { StatusBadge } from '../../components/StatusBadge';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { InventoryItem, VerificationOutcome } from '../../types';

interface AddStockModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [quantity, setQuantity] = useState('24');
  const [batchOverride, setBatchOverride] = useState('');
  const [status, setStatus] = useState<VerificationOutcome>('verified');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const qtyNum = parseInt(quantity, 10);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Please enter a valid stock quantity');
      return;
    }
    setError('');

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      product: {
        ...selectedProduct,
        batchNumber: batchOverride || selectedProduct.batchNumber,
      },
      quantityInStock: qtyNum,
      lastVerifiedDate: 'Just now',
      status,
      notes: notes || undefined,
    };

    onAdd(newItem);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Save to inventory</Text>
              <Text style={styles.modalSubtitle}>
                Add verified batch units to your merchant stock register.
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Product selection preview */}
            <Text style={styles.sectionLabel}>SELECT PRODUCT</Text>
            <View style={styles.productSelectionRow}>
              {mockProducts.slice(0, 3).map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                return (
                  <Pressable
                    key={prod.id}
                    onPress={() => setSelectedProduct(prod)}
                    style={[
                      styles.productOption,
                      isSelected && styles.productOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.productOptionName,
                        isSelected && styles.productOptionNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {prod.name}
                    </Text>
                    <Text style={styles.productOptionBatch}>
                      Batch: {prod.batchNumber}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <InputField
              label="Quantity in Stock *"
              placeholder="Enter the total number of units in your stock"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="number-pad"
              helperText="Count total blisters/cartons received"
            />

            <InputField
              label="Batch Number Override (Optional)"
              placeholder={selectedProduct.batchNumber}
              value={batchOverride}
              onChangeText={setBatchOverride}
            />

            {/* Status Selector */}
            <Text style={styles.sectionLabel}>VERIFICATION STATUS</Text>
            <View style={styles.statusSelectRow}>
              {(['verified', 'suspicious', 'counterfeit'] as VerificationOutcome[]).map(
                (st) => (
                  <Pressable
                    key={st}
                    onPress={() => setStatus(st)}
                    style={[
                      styles.statusPill,
                      status === st && styles.statusPillActive,
                    ]}
                  >
                    <StatusBadge status={st} size="small" />
                  </Pressable>
                )
              )}
            </View>

            <InputField
              label="Stock Notes / Shelf Location"
              placeholder="e.g. Backroom Shelf B4 - Received from main distributor"
              value={notes}
              onChangeText={setNotes}
              isTextArea
            />

            {Boolean(error) && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title="Save to Inventory"
              onPress={handleSave}
              style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdrop: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  modalBody: {
    paddingVertical: spacing.md,
  },
  sectionLabel: {
    ...typography.overline,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  productSelectionRow: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  productOption: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
  },
  productOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  productOptionName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  productOptionNameSelected: {
    color: colors.primaryDark,
  },
  productOptionBatch: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusPill: {
    padding: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusPillActive: {
    borderColor: colors.primary,
  },
  errorText: {
    ...typography.captionMedium,
    color: colors.counterfeit,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
});
