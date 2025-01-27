import React, { useState } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Transaction {
  loading_date: string;
  sale_to: string;
  quarry_name: string;
  sale_price: number;
  stats_data: number;
}

interface CustomerStats {
  total_purchases: number;
  total_spent: number;
  total_limestone: number;
  last_purchase: string | null;
  transactions: Transaction[];
}

const COLORS = ['#0EA5E9', '#059669', '#8B5CF6', '#EF4444', '#F59E0B', '#6366F1'];

function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: transactionsData, loading } = useGoogleSheets('transactions');

  if (loading) {
    return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
  }

  const transactions = transactionsData as Transaction[];

  // Calculate customer statistics
  const customerStats = transactions.reduce<Record<string, CustomerStats>>((acc, curr) => {
    const customer = curr.sale_to;
    if (!acc[customer]) {
      acc[customer] = {
        total_purchases: 0,
        total_spent: 0,
        total_limestone: 0,
        last_purchase: null,
        transactions: [],
      };
    }
    acc[customer].total_purchases += 1;
    acc[customer].total_spent += curr.sale_price || 0;
    acc[customer].total_limestone += curr.stats_data || 0;
    acc[customer].last_purchase = curr.loading_date;
    acc[customer].transactions.push(curr);
    return acc;
  }, {});

  // Prepare data for pie chart
  const customerData = Object.entries(customerStats).map(([name, stats]: [string, CustomerStats]) => ({
    name,
    value: stats.total_spent,
  }));

  // Filter customers based on search
  const filteredCustomers = Object.entries(customerStats)
    .filter(([name]) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b[1].total_spent - a[1].total_spent);

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-600">Customer analysis and transaction history</p>
        </div>
        <input
          type="text"
          placeholder="Search customers..."
          className="border rounded-lg px-4 py-2 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm col-span-2">
          <h2 className="text-xl font-semibold mb-4">Customer Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer Name</th>
                  <th className="text-right py-3 px-4">Total Purchases</th>
                  <th className="text-right py-3 px-4">Total Spent</th>
                  <th className="text-right py-3 px-4">Total Limestone</th>
                  <th className="text-left py-3 px-4">Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(([name, stats]: [string, CustomerStats]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-3 px-4">{name}</td>
                    <td className="text-right py-3 px-4">{stats.total_purchases}</td>
                    <td className="text-right py-3 px-4">₹{stats.total_spent.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{stats.total_limestone.toLocaleString()}</td>
                    <td className="py-3 px-4">{stats.last_purchase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Revenue Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  dataKey="value"
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
                <Tooltip
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Quarry</th>
                <th className="text-right py-3 px-4">Limestone</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter((t) => t.sale_to.toLowerCase().includes(searchTerm.toLowerCase()))
                .slice(0, 10)
                .map((transaction, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">{transaction.loading_date}</td>
                    <td className="py-3 px-4">{transaction.sale_to}</td>
                    <td className="py-3 px-4">{transaction.quarry_name}</td>
                    <td className="text-right py-3 px-4">{transaction.stats_data?.toLocaleString() || 0}</td>
                    <td className="text-right py-3 px-4">₹{transaction.sale_price?.toLocaleString() || 0}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers; 