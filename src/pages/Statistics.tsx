import React, { useState } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';

function Statistics() {
  const [timeRange, setTimeRange] = useState('all');
  const { data: transactionsData, loading } = useGoogleSheets('transactions');

  if (loading) {
    return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
  }

  const transactions = transactionsData as any[];

  // Calculate quarry-wise statistics
  const quarryStats = transactions.reduce((acc, curr) => {
    const quarry = curr.quarry_name;
    if (!acc[quarry]) {
      acc[quarry] = {
        total_limestone: 0,
        total_revenue: 0,
        total_profit: 0,
        total_trips: 0,
      };
    }
    acc[quarry].total_limestone += curr.stats_data || 0;
    acc[quarry].total_revenue += curr.sale_price || 0;
    acc[quarry].total_profit += curr.profit || 0;
    acc[quarry].total_trips += 1;
    return acc;
  }, {});

  // Convert to array for charts
  const quarryData = Object.entries(quarryStats).map(([name, stats]: [string, any]) => ({
    name,
    ...stats,
    average_profit_per_trip: stats.total_profit / stats.total_trips
  }));

  // Daily trends
  const dailyData = transactions.reduce((acc, curr) => {
    const date = curr.loading_date;
    if (!acc[date]) {
      acc[date] = {
        date,
        revenue: 0,
        profit: 0,
        limestone: 0,
      };
    }
    acc[date].revenue += curr.sale_price || 0;
    acc[date].profit += curr.profit || 0;
    acc[date].limestone += curr.stats_data || 0;
    return acc;
  }, {});

  const trendData = Object.values(dailyData);

  // Calculate overall statistics
  const totalRevenue = transactions.reduce((sum, item) => sum + (item.sale_price || 0), 0);
  const totalProfit = transactions.reduce((sum, item) => sum + (item.profit || 0), 0);
  const totalLimestone = transactions.reduce((sum, item) => sum + (item.stats_data || 0), 0);
  const averageProfitPerTrip = totalProfit / transactions.length;

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-gray-600">Detailed analysis of your quarry operations</p>
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={totalRevenue}
          change={12.5}
        />
        <StatCard
          title="Total Profit"
          value={totalProfit}
          change={8.2}
        />
        <StatCard
          title="Total Limestone"
          value={totalLimestone}
          change={5.7}
        />
        <StatCard
          title="Avg. Profit/Trip"
          value={averageProfitPerTrip}
          change={3.4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Quarry Performance Comparison</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_revenue" name="Revenue" fill="#059669" />
                <Bar dataKey="total_profit" name="Profit" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Daily Trends</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#059669" />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#0EA5E9" />
                <Line type="monotone" dataKey="limestone" name="Limestone" stroke="#8B5CF6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Quarry-wise Analysis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Quarry Name</th>
                <th className="text-right py-3 px-4">Total Trips</th>
                <th className="text-right py-3 px-4">Total Limestone</th>
                <th className="text-right py-3 px-4">Total Revenue</th>
                <th className="text-right py-3 px-4">Total Profit</th>
                <th className="text-right py-3 px-4">Avg. Profit/Trip</th>
              </tr>
            </thead>
            <tbody>
              {quarryData.map((quarry) => (
                <tr key={quarry.name} className="border-b border-gray-100">
                  <td className="py-3 px-4">{quarry.name}</td>
                  <td className="text-right py-3 px-4">{quarry.total_trips}</td>
                  <td className="text-right py-3 px-4">{quarry.total_limestone.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{quarry.total_revenue.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{quarry.total_profit.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{quarry.average_profit_per_trip.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Statistics; 