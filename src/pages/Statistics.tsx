import React from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Statistics = () => {
  const { data: transactionsData, loading } = useGoogleSheets('transactions');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  // Process data for monthly revenue
  const monthlyRevenue = transactionsData?.reduce((acc: any, transaction: any) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    acc[monthYear] += transaction.amount || 0;
    return acc;
  }, {});

  const revenueData = Object.entries(monthlyRevenue || {}).map(([month, amount]) => ({
    month,
    revenue: amount,
  }));

  // Process data for material types
  const materialStats = transactionsData?.reduce((acc: any, transaction: any) => {
    if (!acc[transaction.material_type]) {
      acc[transaction.material_type] = 0;
    }
    acc[transaction.material_type] += transaction.quantity || 0;
    return acc;
  }, {});

  const materialData = Object.entries(materialStats || {}).map(([material, quantity]) => ({
    material,
    quantity,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Material Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Material Distribution</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={materialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="material" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#10B981" name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 