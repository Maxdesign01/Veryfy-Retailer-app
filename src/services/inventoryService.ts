import { InventoryItem, Product } from '../types';
import { mockProducts } from '../api/mockData';

// Initial realistic inventory data matching Figma references
const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-cerave-01',
    product: {
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
    },
    quantityInStock: 120,
    lastVerifiedDate: '13 Jun',
    status: 'verified',
    notes: 'Shelf A3 - Skincare',
  },
  {
    id: 'inv-pg-01',
    product: {
      id: 'prod-pg-01',
      name: 'PureGlow Face Cream',
      brand: 'PureGlow',
      category: 'Skincare',
      manufacturer: 'PureGlow Cosmetics Ltd.',
      nafdacRegNo: '02-8812',
      batchNumber: 'BN-PG-1102',
      mfgDate: '2024-05-10',
      expDate: '2027-05-09',
      packageSize: '50 ml',
    },
    quantityInStock: 48,
    lastVerifiedDate: '13 Jun',
    status: 'verified',
  },
  {
    id: 'inv-pg-02',
    product: {
      id: 'prod-pg-02',
      name: 'PureGlow Face Cream',
      brand: 'PureGlow',
      category: 'Skincare',
      manufacturer: 'PureGlow Cosmetics Ltd.',
      nafdacRegNo: '02-8812',
      batchNumber: 'BN-PG-1103',
      mfgDate: '2024-05-10',
      expDate: '2027-05-09',
      packageSize: '100 ml',
    },
    quantityInStock: 32,
    lastVerifiedDate: '13 Jun',
    status: 'verified',
  },
  {
    id: 'inv-cw-01',
    product: {
      id: 'prod-cw-01',
      name: 'Chocolate wafers',
      brand: 'VitaCore',
      category: 'Confectionery',
      manufacturer: 'Wafer Snacks Ltd.',
      nafdacRegNo: '03-4411',
      batchNumber: 'BN-CW-402',
      mfgDate: '2024-03-01',
      expDate: '2025-03-01',
      packageSize: '150 g',
    },
    quantityInStock: 24,
    lastVerifiedDate: '12 Jun',
    status: 'verified',
  },
  {
    id: 'inv-cw-02',
    product: {
      id: 'prod-cw-02',
      name: 'Chocolate wafers',
      brand: 'VitaCore',
      category: 'Confectionery',
      manufacturer: 'Unlicensed Vendor',
      nafdacRegNo: '03-9999 (Invalid)',
      batchNumber: 'BN-CW-INV-01',
      mfgDate: '2024-01-01',
      expDate: '2024-12-31',
      packageSize: '150 g',
    },
    quantityInStock: 1,
    lastVerifiedDate: '12 Jun',
    status: 'invalid',
    notes: 'Source unclear',
  },
  {
    id: 'inv-cw-03',
    product: {
      id: 'prod-cw-03',
      name: 'Chocolate wafers',
      brand: 'VitaCore',
      category: 'Confectionery',
      manufacturer: 'Unknown Source',
      nafdacRegNo: 'None',
      batchNumber: 'FAKE-CW-009',
      mfgDate: '2023-11-01',
      expDate: '2024-11-01',
      packageSize: '150 g',
    },
    quantityInStock: 1,
    lastVerifiedDate: '12 Jun',
    status: 'counterfeit',
    notes: 'Not verified',
  },
  {
    id: 'inv-panadol-01',
    product: mockProducts[0],
    quantityInStock: 120,
    lastVerifiedDate: '11 Jun',
    status: 'verified',
  },
  {
    id: 'inv-lonart-01',
    product: mockProducts[1],
    quantityInStock: 48,
    lastVerifiedDate: '10 Jun',
    status: 'verified',
  },
  {
    id: 'inv-dettol-01',
    product: mockProducts[2],
    quantityInStock: 75,
    lastVerifiedDate: 'Yesterday',
    status: 'verified',
  },
];

class InventoryService {
  private items: InventoryItem[] = [...INITIAL_INVENTORY];
  private listeners: Array<() => void> = [];

  public getItems(): InventoryItem[] {
    return [...this.items];
  }

  public addItem(item: InventoryItem): InventoryItem {
    // Check if item already exists by ID
    const existingIndex = this.items.findIndex(
      (i) => i.id === item.id || (i.product.id === item.product.id && i.product.batchNumber === item.product.batchNumber)
    );

    if (existingIndex >= 0) {
      // Update quantity on existing batch
      this.items[existingIndex].quantityInStock += item.quantityInStock;
      this.items[existingIndex].lastVerifiedDate = 'Just now';
      if (item.notes) {
        this.items[existingIndex].notes = item.notes;
      }
      this.notify();
      return this.items[existingIndex];
    } else {
      // Prepend new item
      this.items.unshift(item);
      this.notify();
      return item;
    }
  }

  public getCounts() {
    const verified = this.items.filter((i) => i.status === 'verified').length;
    const invalid = this.items.filter((i) => i.status === 'invalid').length;
    const counterfeit = this.items.filter(
      (i) => i.status === 'counterfeit'
    ).length;

    return {
      all: this.items.length,
      verified,
      invalid,
      counterfeit,
    };
  }

  public searchAndFilter(
    query: string,
    filter: 'all' | 'verified' | 'invalid' | 'counterfeit'
  ): InventoryItem[] {
    const trimmedQuery = query.trim().toLowerCase();

    return this.items.filter((item) => {
      // Filter tab
      let matchesFilter = true;
      if (filter === 'verified') {
        matchesFilter = item.status === 'verified';
      } else if (filter === 'invalid') {
        matchesFilter = item.status === 'invalid';
      } else if (filter === 'counterfeit') {
        matchesFilter = item.status === 'counterfeit';
      }

      if (!matchesFilter) return false;

      // Search query across name, batchNumber, category, manufacturer, packageSize, notes
      if (!trimmedQuery) return true;

      const p = item.product;
      const haystack = [
        p.name,
        p.brand,
        p.category,
        p.batchNumber,
        p.manufacturer,
        p.packageSize,
        p.nafdacRegNo,
        item.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(trimmedQuery);
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const inventoryService = new InventoryService();
