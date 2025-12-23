
export enum MovementType {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT'
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  quantityInStock: number;
  alertThreshold: number;
}

export interface Movement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  date: string;
  reason: string;
  productName?: string;
}

export interface StockStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalInventoryValue: number;
}
