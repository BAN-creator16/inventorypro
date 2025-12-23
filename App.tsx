
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, History, PlusCircle, AlertTriangle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import MovementsPage from './components/MovementsPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
        {/* Sidebar */}
        <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Box className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">InventoryPro</h1>
            </div>
            
            <div className="space-y-1">
              <NavLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavLink to="/products" icon={<Box size={20} />} label="Products" />
              <NavLink to="/movements" icon={<History size={20} />} label="Movements" />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/movements" element={<MovementsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-indigo-50 text-indigo-700 font-semibold' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;
