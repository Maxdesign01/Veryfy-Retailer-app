import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Hash,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { VerificationResult } from '../types';
import { StatusBadge } from './StatusBadge';

interface VerificationResultCardProps {
  result: VerificationResult;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result }) => {
  const { product, outcome, confidenceScore, tamperSealVerified, findings, warnings } = result;

  const isVerified = outcome === 'verified';
  const isSuspicious = outcome === 'suspicious';
  const isCounterfeit = outcome === 'counterfeit' || outcome === 'invalid';

  return (
    <View style={styles.card}>
      {/* Header / Outcome Banner */}
      <View
        style={[
          styles.headerBanner,
          isVerified && { backgroundColor: colors.verifiedBg },
          isSuspicious && { backgroundColor: colors.suspiciousBg },
          isCounterfeit && { backgroundColor: colors.counterfeitBg },
        ]}
      >
        <View style={styles.statusRow}>
          <StatusBadge status={outcome} size="medium" />
          <Text style={styles.confidenceText}>
            Confidence: <Text style={styles.confidenceScore}>{confidenceScore}%</Text>
          </Text>
        </View>

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productBrand}>{product.brand} • {product.category}</Text>
      </View>

      {/* Product Details Grid */}
      <View style={styles.detailsBody}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <ShieldCheck size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>NAFDAC REG. NO</Text>
              <Text style={styles.detailValue}>{product.nafdacRegNo}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Hash size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>BATCH NUMBER</Text>
              <Text style={styles.detailValue}>{product.batchNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Building2 size={16} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>MANUFACTURER</Text>
              <Text style={styles.detailValue} numberOfLines={2}>
                {product.manufacturer}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Calendar size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>MFG / EXPIRY</Text>
              <Text style={styles.detailValue}>
                {product.mfgDate} — {product.expDate}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              {tamperSealVerified ? (
                <CheckCircle2 size={16} color={colors.verified} />
              ) : (
                <ShieldAlert size={16} color={colors.counterfeit} />
              )}
            </View>
            <View>
              <Text style={styles.detailLabel}>TAMPER SEAL</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: tamperSealVerified ? colors.verified : colors.counterfeit },
                ]}
              >
                {tamperSealVerified ? 'Intact & Verified' : 'Breached / Missing'}
              </Text>
            </View>
          </View>
        </View>

        {/* Warnings or Inspection Findings */}
        {warnings && warnings.length > 0 && (
          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={18} color={colors.counterfeit} />
              <Text style={styles.warningTitle}>Immediate Action Guidance</Text>
            </View>
            {warnings.map((w, idx) => (
              <Text key={idx} style={styles.warningItem}>
                • {w}
              </Text>
            ))}
          </View>
        )}

        {findings && findings.length > 0 && (
          <View style={styles.findingsBox}>
            <Text style={styles.findingsTitle}>System Verification Log:</Text>
            {findings.map((f, idx) => (
              <Text key={idx} style={styles.findingItem}>
                ✓ {f}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginVertical: spacing.md,
    ...shadows.card,
  },
  headerBanner: {
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  confidenceText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  confidenceScore: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  productName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  productBrand: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsBody: {
    padding: spacing.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  detailLabel: {
    ...typography.overline,
    color: colors.textSecondary,
    fontSize: 10,
  },
  detailValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginTop: 1,
  },
  warningBox: {
    backgroundColor: colors.counterfeitBg,
    borderWidth: 1,
    borderColor: colors.counterfeitBorder,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  warningTitle: {
    ...typography.bodyBold,
    color: colors.counterfeit,
    marginLeft: spacing.xs,
  },
  warningItem: {
    ...typography.caption,
    color: '#7F1D1D',
    marginTop: 2,
  },
  findingsBox: {
    backgroundColor: colors.verifiedBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  findingsTitle: {
    ...typography.captionMedium,
    color: colors.verified,
    marginBottom: spacing.xs,
  },
  findingItem: {
    ...typography.caption,
    color: '#14532D',
    marginTop: 2,
  },
});
