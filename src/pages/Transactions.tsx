import React, { useState } from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  loading_date: string;
  vehicle_number: string;
  quarry_name: string;
  sale_to: string;
  sale_price: number;
  profit: number;
  stats_data: number;
}

function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState<keyof Transaction>('loading_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { data: transactionsData, loading } = useGoogleSheets('transactions');

  if (loading) {
    return <div className="flex min-h-screen bg-gray-100 items-center justify-center">Loading...</div>;
  }

  const transactions = transactionsData as Transaction[];

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const searchMatch = 
      transaction.sale_to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.quarry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') return searchMatch;
    if (filterType === 'profit') return searchMatch && transaction.profit > 0;
    if (filterType === 'loss') return searchMatch && transaction.profit < 0;
    return searchMatch;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Calculate summary statistics
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.sale_price, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.profit, 0);
  const averageProfit = totalProfit / filteredTransactions.length;
  const profitableTransactions = filteredTransactions.filter(t => t.profit > 0).length;

  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-600">Complete transaction history and analysis</p>
        </div>
        <div className="flex gap-4">
          <select
            className="border rounded-lg px-3 py-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="profit">Profitable Only</option>
            <option value="loss">Loss Only</option>
          </select>
          <input
            type="text"
            placeholder="Search transactions..."
            className="border rounded-lg px-4 py-2 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold">{filteredTransactions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Average Profit</h3>
          <p className="text-3xl font-bold">₹{averageProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Profitable Transactions</h3>
          <p className="text-3xl font-bold text-green-600">{profitableTransactions}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('loading_date')}
                >
                  Date {sortField === 'loading_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('quarry_name')}
                >
                  Quarry {sortField === 'quarry_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('sale_to')}
                >
                  Customer {sortField === 'sale_to' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('vehicle_number')}
                >
                  Vehicle {sortField === 'vehicle_number' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('stats_data')}
                >
                  Limestone {sortField === 'stats_data' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('sale_price')}
                >
                  Amount {sortField === 'sale_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="text-right py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('profit')}
                >
                  Profit {sortField === 'profit' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4">{transaction.loading_date}</td>
                  <td className="py-3 px-4">{transaction.quarry_name}</td>
                  <td className="py-3 px-4">{transaction.sale_to}</td>
                  <td className="py-3 px-4">{transaction.vehicle_number}</td>
                  <td className="text-right py-3 px-4">{transaction.stats_data.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">₹{transaction.sale_price.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {transaction.profit > 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={transaction.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{Math.abs(transaction.profit).toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions; 