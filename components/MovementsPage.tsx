
import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, History, PackageCheck, AlertCircle } from 'lucide-react';
import { StockService } from '../services/stockService';
import { Product, Movement, MovementType } from '../types';

const MovementsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [type, setType] = useState<MovementType>(MovementType.ENTRY);
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setProducts(StockService.getAllProducts());
    setMovements(StockService.getAllMovements());
  };

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedProductId) {
      setError('Please select a product');
      return;
    }

    try {
      StockService.recordMovement({
        id: Date.now().toString(),
        productId: selectedProductId,
        type,
        quantity,
        date: new Date().toISOString(),
        reason: reason || (type === MovementType.ENTRY ? 'Stock replenishment' : 'Customer sale'),
      });

      // Reset form
      setQuantity(1);
      setReason('');
      refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to record movement');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Stock Movements</h2>
        <p className="text-slate-500">Record stock entries (replenishment) and exits (sales/losses).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <PlusCircle size={18} className="text-indigo-600" />
            New Operation
          </h3>
          
          <form onSubmit={handleRecord} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Operation Type</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setType(MovementType.ENTRY)}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    type === MovementType.ENTRY 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle size={16} />
                  Entry
                </button>
                <button 
                  type="button"
                  onClick={() => setType(MovementType.EXIT)}
                  className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                    type === MovementType.EXIT 
                      ? 'bg-rose-50 border-rose-200 text-rose-700 ring-2 ring-rose-500/20' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <MinusCircle size={16} />
                  Exit
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Product</label>
              <select 
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku}) - {p.quantityInStock} available</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
              <input 
                required
                type="number" 
                min="1"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Reason / Notes</label>
              <textarea 
                className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                placeholder="E.g. Monthly restock, Sale to client #123..."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${
                type === MovementType.ENTRY ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              Record {type === MovementType.ENTRY ? 'Entry' : 'Exit'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <History size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-800">History Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200 z-10">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Qty</th>
                  <th className="px-6 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {new Date(m.date).toLocaleDateString()}<br/>
                      <span className="text-[10px]">{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-800">{m.productName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${m.type === MovementType.ENTRY ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                        {m.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${m.type === MovementType.ENTRY ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {m.type === MovementType.ENTRY ? '+' : '-'}{m.quantity}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate" title={m.reason}>
                      {m.reason}
                    </td>
                  </tr>
                ))}
                {movements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <PackageCheck size={48} className="opacity-20" />
                        <p className="italic">No movements recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementsPage;
