
import { Product, Movement, MovementType } from '../types';

const STORAGE_KEY_PRODUCTS = 'inventory_pro_products';
const STORAGE_KEY_MOVEMENTS = 'inventory_pro_movements';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'MacBook Pro 14"', sku: 'MBP-14-M2', category: 'Electronics', unitPrice: 1999, quantityInStock: 15, alertThreshold: 5 },
  { id: '2', name: 'Dell UltraSharp 27"', sku: 'DELL-U2723', category: 'Monitors', unitPrice: 580, quantityInStock: 3, alertThreshold: 5 },
  { id: '3', name: 'Logitech MX Master 3S', sku: 'LOGI-MX3S', category: 'Peripherals', unitPrice: 99, quantityInStock: 0, alertThreshold: 10 },
  { id: '4', name: 'Keychron Q1 V2', sku: 'KEY-Q1V2', category: 'Peripherals', unitPrice: 170, quantityInStock: 8, alertThreshold: 5 },
];

export class StockService {
  private static getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  }

  private static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  private static getMovements(): Movement[] {
    const data = localStorage.getItem(STORAGE_KEY_MOVEMENTS);
    return data ? JSON.parse(data) : [];
  }

  private static saveMovements(movements: Movement[]): void {
    localStorage.setItem(STORAGE_KEY_MOVEMENTS, JSON.stringify(movements));
  }

  static getAllProducts(): Product[] {
    return this.getProducts();
  }

  static addOrUpdateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) {
      products[index] = product;
    } else {
      products.push(product);
    }
    this.saveProducts(products);
  }

  static deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  static recordMovement(movement: Movement): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === movement.productId);
    
    if (!product) throw new Error("Product not found");

    if (movement.type === MovementType.ENTRY) {
      product.quantityInStock += movement.quantity;
    } else {
      if (product.quantityInStock < movement.quantity) {
         throw new Error("Insufficient stock for this exit movement");
      }
      product.quantityInStock -= movement.quantity;
    }

    const movements = this.getMovements();
    movements.unshift({ ...movement, productName: product.name });
    
    this.saveProducts(products);
    this.saveMovements(movements);
  }

  static getAllMovements(): Movement[] {
    return this.getMovements();
  }

  static getStats() {
    const products = this.getProducts();
    return {
      totalProducts: products.length,
      lowStockItems: products.filter(p => p.quantityInStock > 0 && p.quantityInStock <= p.alertThreshold).length,
      outOfStockItems: products.filter(p => p.quantityInStock === 0).length,
      totalInventoryValue: products.reduce((acc, p) => acc + (p.unitPrice * p.quantityInStock), 0)
    };
  }
}
