
import React from 'react';
import { Package, AlertCircle, DollarSign, XCircle } from 'lucide-react';
import { StockStats } from '../types';

interface StatsCardsProps {
  stats: StockStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Products" 
        value={stats.totalProducts} 
        icon={<Package className="text-blue-600" />} 
        bgColor="bg-blue-50"
      />
      <StatCard 
        title="Out of Stock" 
        value={stats.outOfStockItems} 
        icon={<XCircle className="text-rose-600" />} 
        bgColor="bg-rose-50"
        highlight={stats.outOfStockItems > 0}
      />
      <StatCard 
        title="Low Stock" 
        value={stats.lowStockItems} 
        icon={<AlertCircle className="text-amber-600" />} 
        bgColor="bg-amber-50"
        highlight={stats.lowStockItems > 0}
      />
      <StatCard 
        title="Inventory Value" 
        value={`$${stats.totalInventoryValue.toLocaleString()}`} 
        icon={<DollarSign className="text-emerald-600" />} 
        bgColor="bg-emerald-50"
      />
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string, highlight?: boolean }> = ({ title, value, icon, bgColor, highlight }) => (
  <div className={`p-6 rounded-xl border border-slate-200 bg-white transition-all hover:shadow-md ${highlight ? 'ring-1 ring-rose-200' : ''}`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${bgColor}`}>
        {icon}
      </div>
      {highlight && <span className="flex h-2 w-2 rounded-full bg-rose-500"></span>}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default StatsCards;
