import { Product, VerificationOutcome, VerificationResult } from '../types/index';
import { mockCeraveProduct, mockProducts } from '../api/mockData';

export interface CodeVerificationConfig {
  code: string;
  outcome: VerificationOutcome;
  statusLabel: string;
  heading: string;
  supportingMessage: string;
  product: Product;
  confidenceScore: number;
  tamperSealVerified: boolean;
  warnings?: string[];
  findings?: string[];
}

export const mockUnverifiedProduct: Product = {
  id: 'prod-unverified',
  name: 'FreshSpring Purified Water 75cl',
  brand: 'FreshSpring',
  category: 'Beverages',
  manufacturer: 'Spring Waters Bottling Ltd.',
  nafdacRegNo: '01-9281',
  batchNumber: 'VERIFY-2026-002',
  mfgDate: '2025-06-12',
  expDate: '2027-06-11',
  packageSize: '750 ml',
};

export const mockInvalidProduct: Product = {
  id: 'prod-invalid',
  name: 'Unrecognized Product Code',
  brand: 'UNKNOWN',
  category: 'Unverified',
  manufacturer: 'Unregistered Entity',
  nafdacRegNo: 'Not registered',
  batchNumber: 'VERIFY-2026-003',
  mfgDate: 'N/A',
  expDate: 'N/A',
};

export const mockSuspiciousProduct: Product = {
  id: 'prod-suspicious',
  name: 'Amoxil 500mg Amoxicillin Trihydrate',
  brand: 'Amoxil',
  category: 'Antibiotics',
  manufacturer: 'Unverified Overseas Distributor',
  nafdacRegNo: '04-9912 (Mismatch)',
  batchNumber: 'VERIFY-2026-004',
  mfgDate: '03/2024',
  expDate: '03/2027',
  dosageForm: 'Capsules',
};

/**
 * Authoritative Central Demo Code Registry
 * Map of normalized uppercase codes to deterministic verification configurations.
 */
export const DEMO_VERIFICATION_CODES: Record<string, CodeVerificationConfig> = {
  // Primary User Specified Codes (VF-2026-0001 to VF-2026-0004)
  'VF-2026-0001': {
    code: 'VF-2026-0001',
    outcome: 'verified',
    statusLabel: 'Verified',
    heading: 'Product Successfully Verified',
    supportingMessage:
      'This product has been successfully authenticated. It has passed the verification check and is recognized as a verified item.',
    product: {
      ...mockCeraveProduct,
      batchNumber: 'VF-2026-0001',
    },
    confidenceScore: 99.8,
    tamperSealVerified: true,
    findings: [
      'Genuine manufacturer cryptographic signature verified',
      'Batch number and NAFDAC registered with manufacturer',
      'Tamper-evident seal confirmed intact',
    ],
  },

  'VF-2026-0002': {
    code: 'VF-2026-0002',
    outcome: 'not_verified',
    statusLabel: 'Not Verified',
    heading: 'Product Not Verified',
    supportingMessage:
      'We could not verify the authenticity of this product. Please exercise caution and contact the manufacturer or authorized retailer for further assistance.',
    product: mockUnverifiedProduct,
    confidenceScore: 48.0,
    tamperSealVerified: false,
    warnings: [
      'Product authenticity could not be confirmed with manufacturer records',
      'Exercise caution before stocking, selling, or dispensing this item',
      'Contact the authorized distributor or manufacturer for confirmation',
    ],
    findings: [
      'Code exists but lacks active authorized batch verification record',
      'Physical inspection of seals and supplier invoices recommended',
    ],
  },

  'VF-2026-0003': {
    code: 'VF-2026-0003',
    outcome: 'invalid',
    statusLabel: 'Invalid Code',
    heading: 'Invalid Verification Code',
    supportingMessage:
      'The verification code you entered is invalid or does not exist in our verification records. Please check the code and try again.',
    product: mockInvalidProduct,
    confidenceScore: 0.0,
    tamperSealVerified: false,
    warnings: [
      'The code entered does not match any genuine registered product record.',
      'Check for typos, missing characters, or smudged print on packaging.',
    ],
    findings: [
      'Zero matching records in national product registration database',
    ],
  },

  'VF-2026-0004': {
    code: 'VF-2026-0004',
    outcome: 'suspicious',
    statusLabel: 'Suspicious',
    heading: 'Suspicious Product Detected',
    supportingMessage:
      'This product has been flagged as suspicious and may be counterfeit. We strongly recommend that you do not purchase, use, or distribute this item until its authenticity has been confirmed. Please contact the manufacturer or relevant verification authority.',
    product: mockSuspiciousProduct,
    confidenceScore: 12.0,
    tamperSealVerified: false,
    warnings: [
      'CRITICAL: This product has been flagged for suspicious packaging or duplicated batch numbers.',
      'Do not purchase, use, dispense, or distribute this item.',
      'Isolate stock immediately and file a formal report with regulatory enforcement.',
    ],
    findings: [
      'Cryptographic signature verification failed or duplicated across multiple regions',
      'Serial code duplicate observed in known counterfeit database',
    ],
  },

  // 1. Verified Product (Alias VERIFY-2026-001)
  'VERIFY-2026-001': {
    code: 'VERIFY-2026-001',
    outcome: 'verified',
    statusLabel: 'Verified',
    heading: 'Product Successfully Verified',
    supportingMessage:
      'This product has been successfully authenticated. It has passed the verification check and is recognized as a verified item.',
    product: {
      ...mockCeraveProduct,
      batchNumber: 'VERIFY-2026-001',
    },
    confidenceScore: 99.8,
    tamperSealVerified: true,
    findings: [
      'Genuine manufacturer cryptographic signature verified',
      'Batch number and NAFDAC registered with manufacturer',
      'Tamper-evident seal confirmed intact',
    ],
  },

  // 2. Not Verified / Unverified Product (Alias VERIFY-2026-002)
  'VERIFY-2026-002': {
    code: 'VERIFY-2026-002',
    outcome: 'not_verified',
    statusLabel: 'Not Verified',
    heading: 'Product Not Verified',
    supportingMessage:
      'We could not verify the authenticity of this product. Please exercise caution and contact the manufacturer or authorized retailer for further assistance.',
    product: mockUnverifiedProduct,
    confidenceScore: 48.0,
    tamperSealVerified: false,
    warnings: [
      'Product authenticity could not be confirmed with manufacturer records',
      'Exercise caution before stocking, selling, or dispensing this item',
      'Contact the authorized distributor or manufacturer for confirmation',
    ],
    findings: [
      'Code exists but lacks active authorized batch verification record',
      'Physical inspection of seals and supplier invoices recommended',
    ],
  },

  // 3. Invalid Code (Alias VERIFY-2026-003)
  'VERIFY-2026-003': {
    code: 'VERIFY-2026-003',
    outcome: 'invalid',
    statusLabel: 'Invalid Code',
    heading: 'Invalid Verification Code',
    supportingMessage:
      'The verification code you entered is invalid or does not exist in our verification records. Please check the code and try again.',
    product: mockInvalidProduct,
    confidenceScore: 0.0,
    tamperSealVerified: false,
    warnings: [
      'The code entered does not match any genuine registered product record.',
      'Check for typos, missing characters, or smudged print on packaging.',
    ],
    findings: [
      'Zero matching records in national product registration database',
    ],
  },

  // 4. Suspicious / Counterfeit Product (Alias VERIFY-2026-004)
  'VERIFY-2026-004': {
    code: 'VERIFY-2026-004',
    outcome: 'suspicious',
    statusLabel: 'Suspicious',
    heading: 'Suspicious Product Detected',
    supportingMessage:
      'This product has been flagged as suspicious and may be counterfeit. We strongly recommend that you do not purchase, use, or distribute this item until its authenticity has been confirmed. Please contact the manufacturer or relevant verification authority.',
    product: mockSuspiciousProduct,
    confidenceScore: 12.0,
    tamperSealVerified: false,
    warnings: [
      'CRITICAL: This product has been flagged for suspicious packaging or duplicated batch numbers.',
      'Do not purchase, use, dispense, or distribute this item.',
      'Isolate stock immediately and file a formal report with regulatory enforcement.',
    ],
    findings: [
      'Cryptographic signature verification failed or duplicated across multiple regions',
      'Serial code duplicate observed in known counterfeit database',
    ],
  },

  // Legacy & Figma Demo Codes for seamless backward compatibility
  'VFY-2849-1036': {
    code: 'VFY-2849-1036',
    outcome: 'verified',
    statusLabel: 'Verified',
    heading: 'Product Successfully Verified',
    supportingMessage:
      'This product has been successfully authenticated. It has passed the verification check and is recognized as a verified item.',
    product: mockCeraveProduct,
    confidenceScore: 99.8,
    tamperSealVerified: true,
    findings: [
      'Genuine manufacturer cryptographic signature verified',
      'Batch number and NAFDAC registered with manufacturer',
      'Tamper-evident seal confirmed intact',
    ],
  },
  'VF-4829-7610': {
    code: 'VF-4829-7610',
    outcome: 'verified',
    statusLabel: 'Verified',
    heading: 'Product Successfully Verified',
    supportingMessage:
      'This product has been successfully authenticated. It has passed the verification check and is recognized as a verified item.',
    product: mockCeraveProduct,
    confidenceScore: 99.8,
    tamperSealVerified: true,
    findings: [
      'Genuine manufacturer cryptographic signature verified',
      'Batch number and NAFDAC registered with manufacturer',
    ],
  },
  'VF-4829-7611': {
    code: 'VF-4829-7611',
    outcome: 'suspicious',
    statusLabel: 'Suspicious',
    heading: 'Suspicious Product Detected',
    supportingMessage:
      'This product has been flagged as suspicious and may be counterfeit. We strongly recommend that you do not purchase, use, or distribute this item until its authenticity has been confirmed. Please contact the manufacturer or relevant verification authority.',
    product: mockSuspiciousProduct,
    confidenceScore: 15.0,
    tamperSealVerified: false,
  },
  'VF-4829-7612': {
    code: 'VF-4829-7612',
    outcome: 'not_verified',
    statusLabel: 'Not Verified',
    heading: 'Product Not Verified',
    supportingMessage:
      'We could not verify the authenticity of this product. Please exercise caution and contact the manufacturer or authorized retailer for further assistance.',
    product: mockUnverifiedProduct,
    confidenceScore: 45.0,
    tamperSealVerified: false,
  },
  'VF-4829-7613': {
    code: 'VF-4829-7613',
    outcome: 'invalid',
    statusLabel: 'Invalid Code',
    heading: 'Invalid Verification Code',
    supportingMessage:
      'The verification code you entered is invalid or does not exist in our verification records. Please check the code and try again.',
    product: mockInvalidProduct,
    confidenceScore: 0.0,
    tamperSealVerified: false,
  },
};

/**
 * Normalizes user input verification codes:
 * - Trims leading and trailing whitespace
 * - Converts to uppercase
 * - Strips redundant surrounding quotes
 */
export function normalizeVerificationCode(rawCode?: string | null): string {
  if (!rawCode) return '';
  return rawCode
    .trim()
    .replace(/^["']+|["']+$/g, '')
    .toUpperCase();
}

/**
 * Check if a code matches any of the predefined demo codes (case-insensitively)
 */
export function isDemoCode(rawCode: string): boolean {
  const normalized = normalizeVerificationCode(rawCode);
  return Boolean(DEMO_VERIFICATION_CODES[normalized]);
}

/**
 * Central deterministic resolver for verification codes.
 * - Matches known demo codes case-insensitively and whitespace-trimmed.
 * - Handles descriptive keyword fallbacks for automated testing.
 * - Unrecognized or unknown codes ALWAYS default to 'invalid' (never 'verified').
 */
export function resolveVerificationCode(rawCode: string): VerificationResult {
  const normalized = normalizeVerificationCode(rawCode);
  const scanId = `SCN-${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const timestamp = `Today, ${timeStr}`;

  // 1. Direct match in Central Demo Code Registry
  if (DEMO_VERIFICATION_CODES[normalized]) {
    const config = DEMO_VERIFICATION_CODES[normalized];
    return {
      scanId,
      timestamp,
      outcome: config.outcome,
      product: {
        ...config.product,
        batchNumber: config.code,
      },
      confidenceScore: config.confidenceScore,
      tamperSealVerified: config.tamperSealVerified,
      scannedQrCode: config.code,
      heading: config.heading,
      supportingMessage: config.supportingMessage,
      statusLabel: config.statusLabel,
      warnings: config.warnings,
      findings: config.findings,
    };
  }

  // 2. Keyword-based matching for testing or simulator strings
  if (normalized.includes('SUS') || normalized.includes('ATTN') || normalized.includes('FAKE') || normalized.includes('COUNT')) {
    const config = DEMO_VERIFICATION_CODES['VERIFY-2026-004'];
    return {
      scanId,
      timestamp,
      outcome: 'suspicious',
      product: {
        ...config.product,
        batchNumber: normalized,
      },
      confidenceScore: config.confidenceScore,
      tamperSealVerified: config.tamperSealVerified,
      scannedQrCode: normalized,
      heading: config.heading,
      supportingMessage: config.supportingMessage,
      statusLabel: config.statusLabel,
      warnings: config.warnings,
      findings: config.findings,
    };
  }

  if (normalized.includes('NOT') || normalized.includes('UNVER') || normalized.includes('NO_MATCH')) {
    const config = DEMO_VERIFICATION_CODES['VERIFY-2026-002'];
    return {
      scanId,
      timestamp,
      outcome: 'not_verified',
      product: {
        ...config.product,
        batchNumber: normalized,
      },
      confidenceScore: config.confidenceScore,
      tamperSealVerified: config.tamperSealVerified,
      scannedQrCode: normalized,
      heading: config.heading,
      supportingMessage: config.supportingMessage,
      statusLabel: config.statusLabel,
      warnings: config.warnings,
      findings: config.findings,
    };
  }

  if (normalized.includes('VER') && (normalized.endsWith('001') || normalized.includes('CERAVE'))) {
    const config = DEMO_VERIFICATION_CODES['VERIFY-2026-001'];
    return {
      scanId,
      timestamp,
      outcome: 'verified',
      product: {
        ...config.product,
        batchNumber: normalized,
      },
      confidenceScore: config.confidenceScore,
      tamperSealVerified: config.tamperSealVerified,
      scannedQrCode: normalized,
      heading: config.heading,
      supportingMessage: config.supportingMessage,
      statusLabel: config.statusLabel,
      warnings: config.warnings,
      findings: config.findings,
    };
  }

  // 3. Fallback for ANY unrecognized code:
  // Must return Invalid Code state. Never default to Verified!
  const invalidConfig = DEMO_VERIFICATION_CODES['VERIFY-2026-003'];
  return {
    scanId,
    timestamp,
    outcome: 'invalid',
    product: {
      id: `prod-unknown-${Date.now()}`,
      name: 'Unrecognized Product',
      brand: 'UNKNOWN',
      category: 'Unverified',
      manufacturer: 'Unknown / Unregistered Manufacturer',
      nafdacRegNo: 'Not registered',
      batchNumber: normalized || 'UNKNOWN-CODE',
      mfgDate: 'N/A',
      expDate: 'N/A',
    },
    confidenceScore: 0.0,
    tamperSealVerified: false,
    scannedQrCode: normalized || 'UNKNOWN-CODE',
    heading: invalidConfig.heading,
    supportingMessage: invalidConfig.supportingMessage,
    statusLabel: invalidConfig.statusLabel,
    warnings: [
      'The verification code entered does not match any registered product record in our verification database.',
      'Check for typos or contact the distributor if you believe this is an error.',
    ],
    findings: [
      'No matching manufacturer registration found for this code',
    ],
  };
}

/**
 * Returns the primary 4 demo codes for UI display and testing
 */
export function getPrimaryDemoCodes(): Array<{ code: string; label: string; outcome: VerificationOutcome }> {
  return [
    { code: 'VF-2026-0001', label: 'Verified', outcome: 'verified' },
    { code: 'VF-2026-0002', label: 'Not Verified', outcome: 'not_verified' },
    { code: 'VF-2026-0003', label: 'Invalid Code', outcome: 'invalid' },
    { code: 'VF-2026-0004', label: 'Suspicious', outcome: 'suspicious' },
  ];
}
