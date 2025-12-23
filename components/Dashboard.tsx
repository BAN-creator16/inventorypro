
import React, { useState, useEffect } from 'react';
import { StockService } from '../services/stockService';
import { StockStats, Movement } from '../types';
import StatsCards from './StatsCards';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StockStats>({ totalProducts: 0, lowStockItems: 0, outOfStockItems: 0, totalInventoryValue: 0 });
  const [movements, setMovements] = useState<Movement[]>([]);

  useEffect(() => {
    setStats(StockService.getStats());
    setMovements(StockService.getAllMovements().slice(0, 5));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Inventory Overview</h2>
        <p className="text-slate-500">Manage your stock levels and monitor performance.</p>
      </header>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Movements */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Recent Movements</h3>
            <Clock size={18} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100">
            {movements.length > 0 ? movements.map((m) => (
              <div key={m.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${m.type === 'ENTRY' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {m.type === 'ENTRY' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{m.productName}</p>
                    <p className="text-xs text-slate-500">{m.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${m.type === 'ENTRY' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {m.type === 'ENTRY' ? '+' : '-'}{m.quantity}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">{new Date(m.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 italic">No recent activity</div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Critical Stock Alerts</h3>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider">Priority</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">In Stock</th>
                  <th className="px-6 py-3">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {StockService.getAllProducts().filter(p => p.quantityInStock <= p.alertThreshold).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.sku}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${p.quantityInStock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {p.quantityInStock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{p.alertThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
