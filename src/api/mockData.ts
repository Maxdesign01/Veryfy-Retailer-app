import { InventoryItem, Product, ProductReport, RecentScan, RetailerProfile, VerificationResult } from '../types';

export const mockProfile: RetailerProfile = {
  id: 'ret-001',
  storeName: 'Ikeja Central Meds & Provisions',
  ownerName: 'Samuel Okonjo',
  email: 'samuel@ikejacentral.ng',
  phone: '+234 803 123 4567',
  address: '14 Allen Avenue, Ikeja',
  city: 'Lagos',
  state: 'Lagos State',
  licenseNumber: 'PCN-RET-884920',
  verifiedRetailer: true,
  clusterId: 'LAG-IKJ-04',
};

export const mockProducts: Product[] = [
  {
    id: 'prod-01',
    name: 'Panadol Extra Tablets 500mg/65mg',
    brand: 'Panadol',
    category: 'Pharmaceuticals',
    manufacturer: 'GSK Consumer Nigeria Plc',
    nafdacRegNo: '04-1234',
    batchNumber: 'BN-88392-A',
    mfgDate: '10/2025',
    expDate: '10/2028',
    dosageForm: 'Tablets, 24 blister pack',
  },
  {
    id: 'prod-02',
    name: 'Lonart Forte Artemether/Lumefantrine',
    brand: 'Lonart',
    category: 'Antimalarial',
    manufacturer: 'Bliss GVS Pharma Ltd',
    nafdacRegNo: 'B4-0239',
    batchNumber: 'LNT-2024-91',
    mfgDate: '01/2026',
    expDate: '01/2029',
    dosageForm: 'Tablets, 6 tablets',
  },
  {
    id: 'prod-03',
    name: 'Dettol Antiseptic Liquid 250ml',
    brand: 'Dettol',
    category: 'Personal Care',
    manufacturer: 'Reckitt Benckiser Nigeria Ltd',
    nafdacRegNo: '01-4491',
    batchNumber: 'DTL-8821',
    mfgDate: '05/2025',
    expDate: '05/2028',
    dosageForm: 'Liquid antiseptic',
  },
  {
    id: 'prod-04',
    name: 'Amoxil 500mg Amoxicillin Trihydrate',
    brand: 'Amoxil',
    category: 'Antibiotics',
    manufacturer: 'Unverified Overseas Distributor',
    nafdacRegNo: '04-9912 (Mismatch)',
    batchNumber: 'FAKE-AMX-001',
    mfgDate: '03/2024',
    expDate: '03/2027',
    dosageForm: 'Capsules',
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-01',
    product: mockProducts[0],
    quantityInStock: 120,
    lastVerifiedDate: 'Today, 11:30 AM',
    status: 'verified',
  },
  {
    id: 'inv-02',
    product: mockProducts[1],
    quantityInStock: 48,
    lastVerifiedDate: 'Today, 09:15 AM',
    status: 'verified',
  },
  {
    id: 'inv-03',
    product: mockProducts[2],
    quantityInStock: 75,
    lastVerifiedDate: 'Yesterday',
    status: 'verified',
  },
  {
    id: 'inv-04',
    product: mockProducts[3],
    quantityInStock: 6,
    lastVerifiedDate: 'Yesterday',
    status: 'counterfeit',
    notes: 'Quarantined after scanning - seal was broken and batch code invalid.',
  },
];

export const mockReports: ProductReport[] = [
  {
    id: 'rep-01',
    reportId: 'VFY-RP-10482',
    productName: 'Amoxil 500mg Capsules',
    category: 'Suspected counterfeit',
    description: 'Received carton with blurred NAFDAC registration mark and mismatched serial barcode.',
    status: 'Reviewed',
    dateSubmitted: '26 Oct 2026',
    reviewerNotes: 'Verified counterfeit batch alert broadcast to cluster. Product impounded for regulator dispatch.',
    batchNumber: 'FAKE-AMX-001',
  },
  {
    id: 'rep-02',
    reportId: 'VFY-RP-10499',
    productName: 'Augmentin 625mg',
    category: 'Packaging looks unusual',
    description: 'Holographic security strip missing from side flap.',
    status: 'Open',
    dateSubmitted: 'Today, 10:45 AM',
    batchNumber: 'AUG-88129',
  },
];

export const mockCeraveProduct: Product = {
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

export const mockVerificationResults: Record<string, VerificationResult> = {
  verified: {
    scanId: 'SCN-998210',
    timestamp: 'Today, 12:45 PM',
    outcome: 'verified',
    product: mockCeraveProduct,
    confidenceScore: 99.8,
    tamperSealVerified: true,
    scannedQrCode: 'VFY-2849-1036',
    findings: [
      'Genuine manufacturer cryptographic signature verified',
      'Batch number and NAFDAC registered with manufacturer',
      'Tamper-evident seal confirmed intact',
    ],
  },
  suspicious: {
    scanId: 'SCN-998211',
    timestamp: 'Today, 12:48 PM',
    outcome: 'suspicious',
    product: {
      ...mockProducts[1],
      batchNumber: 'LNT-2024-EXPIRED-TEST',
    },
    confidenceScore: 64.2,
    tamperSealVerified: false,
    scannedQrCode: 'https://verify.ng/p/LNT-SUS-99',
    warnings: [
      'Batch number registered to a different manufacturing site',
      'QR code has been scanned across multiple non-adjacent locations',
      'Verify packaging typography matches official manufacturer guidelines',
    ],
    findings: [
      'Digital signature is valid but location anomaly detected',
      'Physical verification recommended before selling',
    ],
  },
  counterfeit: {
    scanId: 'SCN-998212',
    timestamp: 'Today, 12:51 PM',
    outcome: 'counterfeit',
    product: mockProducts[3],
    confidenceScore: 12.0,
    tamperSealVerified: false,
    scannedQrCode: 'https://verify.ng/p/FAKE-AMX-001',
    warnings: [
      'CRITICAL: This QR code is counterfeit and does not match any genuine NAFDAC registration.',
      'Do not dispense or sell this product.',
      'Isolate this stock immediately and report to Veryfy enforcement.',
    ],
    findings: [
      'Cryptographic signature verification failed',
      'Serial code duplicate observed in known counterfeit database',
    ],
  },
};

export const mockRecentScans: RecentScan[] = [
  {
    id: 'scan-01',
    name: 'VitaCore Paracetamol',
    category: 'Medicine',
    date: 'Today',
    status: 'verified',
  },
  {
    id: 'scan-02',
    name: 'PureGlow Face Cream',
    category: 'Cosmetics',
    date: 'Yesterday',
    status: 'suspicious',
  },
  {
    id: 'scan-03',
    name: 'FreshSpring Water',
    category: 'Drinks',
    date: '12 Jun',
    status: 'not_verified',
  },
];
