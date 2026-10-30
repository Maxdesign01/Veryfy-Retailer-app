export type VerificationOutcome = 'verified' | 'suspicious' | 'counterfeit' | 'invalid';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  manufacturer: string;
  nafdacRegNo: string;
  batchNumber: string;
  mfgDate: string;
  expDate: string;
  imageUrl?: string;
  dosageForm?: string;
  packageSize?: string;
}

export interface VerificationResult {
  scanId: string;
  timestamp: string;
  outcome: VerificationOutcome;
  product: Product;
  confidenceScore: number;
  tamperSealVerified: boolean;
  warnings?: string[];
  findings?: string[];
  scannedQrCode: string;
}

export interface InventoryItem {
  id: string;
  product: Product;
  quantityInStock: number;
  lastVerifiedDate: string;
  status: VerificationOutcome;
  notes?: string;
}

export type ReportCategory =
  | 'Suspected counterfeit'
  | 'Verification failed'
  | 'Packaging looks unusual'
  | 'Product source is unclear'
  | 'Other';

export type ReportStatus = 'Open' | 'Reviewed' | 'Investigating';

export interface ProductReport {
  id: string;
  reportId: string; // e.g. VFY-RP-10482
  productName: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  dateSubmitted: string;
  reviewerNotes?: string;
  photoUri?: string;
  batchNumber?: string;
}

export interface RetailerProfile {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  licenseNumber: string;
  verifiedRetailer: boolean;
  clusterId?: string;
}

export interface RecentScan {
  id: string;
  name: string;
  category: string;
  date: string;
  status: 'verified' | 'suspicious' | 'not_verified';
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: { screen?: keyof MainTabParamList; params?: any } | undefined;
  Welcome: undefined;
  RoleSelection: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  OtpVerification: { phoneOrEmail: string; purpose: 'register' | 'login' };
  PostRegistrationWelcome: undefined;
  ForgotPassword: undefined;
  SafetyGuidance: { fromNewStore?: boolean } | undefined;
  Notifications: undefined;
  VerifyingProduct: { result?: VerificationResult; code?: string; isSimulatedOffline?: boolean };
  VerificationResult: { result: VerificationResult };
  SuspiciousResult: { result: VerificationResult };
  ReportProduct: { prefilledProduct?: Partial<Product> };
  ReportDetails: { reportId: string };
  ReportSuccess: { reportId: string; productName?: string };
  AddStock: { product?: Product; onAdded?: (item: InventoryItem) => void } | undefined;
  Scan: undefined;
  Inventory: undefined;
  ConnectionLost: { code?: string; result?: VerificationResult; errorReason?: 'offline' | 'timeout' | 'server_error' } | undefined;
  VerifySmsUssd: { code?: string } | undefined;
};

export type MainTabParamList = {
  Home: { isNewStore?: boolean } | undefined;
  Inventory: undefined;
  Scan: undefined;
  Reports: undefined;
  Profile: undefined;
};
