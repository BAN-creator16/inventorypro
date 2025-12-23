
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { StockService } from '../services/stockService';
import { Product } from '../types';
import ProductModal from './ProductModal';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = () => {
    setProducts(StockService.getAllProducts());
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, sortField, sortOrder]);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      StockService.deleteProduct(id);
      refreshProducts();
    }
  };

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(undefined);
    refreshProducts();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Products</h2>
          <p className="text-slate-500">View and manage your product inventory.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm"
        >
          <Plus size={20} />
          Add Product
        </button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, SKU or category..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <SortableHeader label="SKU" field="sku" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Name" field="name" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Category" field="category" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Price" field="unitPrice" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Stock" field="quantityInStock" currentSort={sortField} sortOrder={sortOrder} onSort={handleSort} />
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedProducts.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">${p.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        p.quantityInStock === 0 ? 'bg-rose-100 text-rose-700' :
                        p.quantityInStock <= p.alertThreshold ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {p.quantityInStock}
                      </span>
                      {p.quantityInStock <= p.alertThreshold && (
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Low Stock Alert" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(p)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

interface SortableHeaderProps {
  label: string;
  field: keyof Product;
  currentSort: keyof Product;
  sortOrder: 'asc' | 'desc';
  onSort: (field: keyof Product) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ label, field, currentSort, sortOrder, onSort }) => (
  <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 group" onClick={() => onSort(field)}>
    <div className="flex items-center gap-1">
      {label}
      <span className={`transition-opacity ${currentSort === field ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
        {currentSort === field && sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </span>
    </div>
  </th>
);

export default ProductList;
