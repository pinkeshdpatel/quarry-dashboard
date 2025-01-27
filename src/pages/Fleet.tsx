import React, { useState } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Vehicle {
  vehicle_number: string;
  vehicle_type: string;
  capacity: number;
  driver_name: string;
  maintenance_date?: string;
  status: 'active' | 'maintenance' | 'inactive';
}

interface Trip {
  loading_date: string;
  vehicle_number: string;
  quarry_name: string;
  sale_to: string;
  sale_price: number;
  stats_data: number;
}

function Fleet() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: fleetData, loading: fleetLoading } = useGoogleSheets('fleet');
  const { data: transactionsData, loading: transactionsLoading } = useGoogleSheets('transactions');

  if (fleetLoading || transactionsLoading) {
    return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
  }

  const fleet = fleetData as Vehicle[];
  const transactions = transactionsData as Trip[];

  // Calculate vehicle performance metrics
  const vehicleStats = transactions.reduce((acc, curr) => {
    const vehicle = curr.vehicle_number;
    if (!acc[vehicle]) {
      acc[vehicle] = {
        total_trips: 0,
        total_revenue: 0,
        total_limestone: 0,
        trips: [],
      };
    }
    acc[vehicle].total_trips += 1;
    acc[vehicle].total_revenue += curr.sale_price || 0;
    acc[vehicle].total_limestone += curr.stats_data || 0;
    acc[vehicle].trips.push(curr);
    return acc;
  }, {} as Record<string, { total_trips: number; total_revenue: number; total_limestone: number; trips: Trip[] }>);

  // Filter vehicles based on search
  const filteredVehicles = fleet
    .filter((vehicle) => 
      vehicle.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Prepare data for performance chart
  const performanceData = fleet.map((vehicle) => {
    const stats = vehicleStats[vehicle.vehicle_number] || {
      total_trips: 0,
      total_revenue: 0,
      total_limestone: 0,
    };
    return {
      name: vehicle.vehicle_number,
      trips: stats.total_trips,
      revenue: stats.total_revenue,
      limestone: stats.total_limestone,
    };
  });

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Fleet Management</h1>
          <p className="text-gray-600">Vehicle tracking and performance analysis</p>
        </div>
        <input
          type="text"
          placeholder="Search vehicles or drivers..."
          className="border rounded-lg px-4 py-2 w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Vehicles</h3>
          <p className="text-3xl font-bold">{fleet.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Active Vehicles</h3>
          <p className="text-3xl font-bold text-green-600">
            {fleet.filter((v) => v.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">In Maintenance</h3>
          <p className="text-3xl font-bold text-yellow-500">
            {fleet.filter((v) => v.status === 'maintenance').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Inactive</h3>
          <p className="text-3xl font-bold text-red-500">
            {fleet.filter((v) => v.status === 'inactive').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Vehicle Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#0EA5E9" />
                <YAxis yAxisId="right" orientation="right" stroke="#059669" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="trips" name="Total Trips" fill="#0EA5E9" />
                <Bar yAxisId="right" dataKey="limestone" name="Total Limestone" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Revenue by Vehicle</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8B5CF6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Fleet Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Vehicle Number</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Driver</th>
                <th className="text-right py-3 px-4">Capacity</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Total Trips</th>
                <th className="text-right py-3 px-4">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => {
                const stats = vehicleStats[vehicle.vehicle_number] || {
                  total_trips: 0,
                  total_revenue: 0,
                };
                return (
                  <tr key={vehicle.vehicle_number} className="border-b border-gray-100">
                    <td className="py-3 px-4">{vehicle.vehicle_number}</td>
                    <td className="py-3 px-4">{vehicle.vehicle_type}</td>
                    <td className="py-3 px-4">{vehicle.driver_name}</td>
                    <td className="text-right py-3 px-4">{vehicle.capacity} tons</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4">{stats.total_trips}</td>
                    <td className="text-right py-3 px-4">₹{stats.total_revenue.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Fleet; 