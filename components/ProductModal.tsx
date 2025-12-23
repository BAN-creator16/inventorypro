
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Product } from '../types';
import { StockService } from '../services/stockService';

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    sku: '',
    category: '',
    unitPrice: 0,
    quantityInStock: 0,
    alertThreshold: 5,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        unitPrice: product.unitPrice,
        quantityInStock: product.quantityInStock,
        alertThreshold: product.alertThreshold,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StockService.addOrUpdateProduct({
      ...formData,
      id: product?.id || Date.now().toString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">SKU</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Unit Price ($)</label>
              <input 
                required
                type="number" 
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.unitPrice}
                onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Stock Alert Threshold</label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.alertThreshold}
                onChange={e => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
              />
            </div>
          </div>

          {!product && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Initial Stock</label>
              <input 
                required
                type="number" 
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.quantityInStock}
                onChange={e => setFormData({ ...formData, quantityInStock: parseInt(e.target.value) })}
              />
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
