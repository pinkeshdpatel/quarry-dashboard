import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Customers from './pages/Customers';
import Fleet from './pages/Fleet';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;