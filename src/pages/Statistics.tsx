import React from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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
      acc[monthYear] = {
        revenue: 0,
        profit: 0,
        transactions: 0,
      };
    }
    acc[monthYear].revenue += transaction.amount || 0;
    acc[monthYear].profit += transaction.profit || 0;
    acc[monthYear].transactions += 1;
    return acc;
  }, {});

  const revenueData = Object.entries(monthlyRevenue || {}).map(([month, data]: [string, any]) => ({
    month,
    revenue: data.revenue,
    profit: data.profit,
    transactions: data.transactions,
  }));

  // Process data for material types
  const materialStats = transactionsData?.reduce((acc: any, transaction: any) => {
    if (!acc[transaction.material_type]) {
      acc[transaction.material_type] = {
        quantity: 0,
        revenue: 0,
        count: 0,
      };
    }
    acc[transaction.material_type].quantity += transaction.quantity || 0;
    acc[transaction.material_type].revenue += transaction.amount || 0;
    acc[transaction.material_type].count += 1;
    return acc;
  }, {});

  const materialData = Object.entries(materialStats || {}).map(([material, data]: [string, any]) => ({
    material,
    quantity: data.quantity,
    revenue: data.revenue,
    count: data.count,
  }));

  // Calculate summary statistics
  const totalRevenue = transactionsData?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
  const totalProfit = transactionsData?.reduce((sum: number, t: any) => sum + (t.profit || 0), 0) || 0;
  const totalQuantity = transactionsData?.reduce((sum: number, t: any) => sum + (t.quantity || 0), 0) || 0;
  const averageOrderValue = totalRevenue / (transactionsData?.length || 1);

  // Process customer data
  const customerStats = transactionsData?.reduce((acc: any, transaction: any) => {
    if (!acc[transaction.customer_name]) {
      acc[transaction.customer_name] = {
        revenue: 0,
        transactions: 0,
      };
    }
    acc[transaction.customer_name].revenue += transaction.amount || 0;
    acc[transaction.customer_name].transactions += 1;
    return acc;
  }, {});

  const customerData = Object.entries(customerStats || {})
    .map(([name, data]: [string, any]) => ({
      name,
      revenue: data.revenue,
      transactions: data.transactions,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Profit</h3>
          <p className="text-2xl font-bold">₹{totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Quantity</h3>
          <p className="text-2xl font-bold">{totalQuantity.toLocaleString()} tons</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Order Value</h3>
          <p className="text-2xl font-bold">₹{averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue & Profit</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Customers by Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Material Details Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Material Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Material</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Orders</th>
                </tr>
              </thead>
              <tbody>
                {materialData.map((item) => (
                  <tr key={item.material} className="border-b">
                    <td className="py-2">{item.material}</td>
                    <td className="text-right">{item.quantity.toLocaleString()}</td>
                    <td className="text-right">₹{item.revenue.toLocaleString()}</td>
                    <td className="text-right">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Customers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Customer</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Orders</th>
                  <th className="text-right py-2">Avg. Order Value</th>
                </tr>
              </thead>
              <tbody>
                {customerData.map((customer) => (
                  <tr key={customer.name} className="border-b">
                    <td className="py-2">{customer.name}</td>
                    <td className="text-right">₹{customer.revenue.toLocaleString()}</td>
                    <td className="text-right">{customer.transactions}</td>
                    <td className="text-right">₹{(customer.revenue / customer.transactions).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
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

export default Statistics; 