import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import StatCard from '../components/StatCard';
import TransactionList from '../components/TransactionList';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

const COLORS = ['#8B5CF6', '#0EA5E9', '#059669', '#EC4899'];

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');

  const { data: statsData, loading: statsLoading } = useGoogleSheets('stats');
  const { data: transactionsData, loading: transactionsLoading } = useGoogleSheets('transactions');

  if (statsLoading || transactionsLoading) {
    return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
  }

  const stats = statsData as any;
  const transactions = transactionsData as any[];

  // Calculate expense breakdown for pie chart
  const expenseBreakdown = [
    { name: 'Maintenance', value: transactions.reduce((sum, item) => sum + (item.maintenace_expense || 0), 0) },
    { name: 'Driver Allowance', value: transactions.reduce((sum, item) => sum + (item.driver_allownace || 0), 0) },
    { name: 'Diesel', value: transactions.reduce((sum, item) => sum + (item.diesel || 0), 0) },
    { name: 'Fleet Charges', value: transactions.reduce((sum, item) => sum + (item.fleet_charges || 0), 0) },
    { name: 'Manager Expenses', value: transactions.reduce((sum, item) => sum + (item['Managers expenses'] || 0), 0) }
  ];

  // Calculate total manager expenses
  const totalManagerExpenses = transactions.reduce((sum, item) => sum + (item['Managers expenses'] || 0), 0);

  // Prepare data for revenue trend
  const trendData = transactions.map(item => ({
    date: item.loading_date,
    revenue: item.sale_price,
    profit: item.profit
  }));

  // Filter data based on search term
  const filteredData = transactions.filter(item => 
    item.quarry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.challan_owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sale_to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome to your quarry management dashboard</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                <h3 className="font-semibold mb-2">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm">New transaction recorded</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded">
                    <p className="text-sm">Profit target achieved</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={stats.total_revenue}
          change={12.5}
        />
        <StatCard
          title="Total Profit"
          value={stats.total_profit}
          change={8.2}
        />
        <StatCard
          title="Total Expenses"
          value={stats.total_expenses}
          change={-3.1}
        />
        <StatCard
          title="Manager Expenses"
          value={totalManagerExpenses}
          change={0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
            <select 
              className="border rounded-lg px-3 py-1"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Revenue"
                  stroke="#059669" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit"
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Quarry Performance</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarry_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stats_data" name="Limestone Rate" fill="#059669" />
              <Bar dataKey="profit" name="Profit" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TransactionList transactions={filteredData.slice(0, 5)} />
    </div>
  );
}

export default Dashboard; 