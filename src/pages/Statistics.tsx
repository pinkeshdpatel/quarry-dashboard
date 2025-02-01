import React from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { QuarryData } from '../types';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface MonthlyData {
  revenue: number;
  profit: number;
  transactions: number;
  manager_expenses: number;
}

interface ManagerStats {
  salary: number;
  food_allowance: number;
  travel_allowance: number;
  total_expenses: number;
  transactions: number;
}

const Statistics = () => {
  const { data: transactionsData, loading } = useGoogleSheets('transactions');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  // Log the first transaction to check the data structure
  console.log('First transaction:', transactionsData?.[0]);

  // Process data for monthly revenue
  const monthlyRevenue = (transactionsData as QuarryData[])?.reduce((acc: Record<string, MonthlyData>, transaction: QuarryData) => {
    const date = new Date(transaction.loading_date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        revenue: 0,
        profit: 0,
        transactions: 0,
        manager_expenses: 0,
      };
    }
    acc[monthYear].revenue += Number(transaction.sale_price) || 0;
    acc[monthYear].profit += Number(transaction.profit) || 0;
    acc[monthYear].transactions += 1;
    
    const managerExpense = Number(transaction.managers_expenses);
    console.log('Manager expense for month:', monthYear, 
                'Manager:', transaction.manager_name,
                'Expense:', transaction.managers_expenses,
                'Salary:', transaction.manager_salary);
    acc[monthYear].manager_expenses += isNaN(managerExpense) ? 0 : managerExpense;
    
    return acc;
  }, {});

  const revenueData = Object.entries(monthlyRevenue || {}).map(([month, data]: [string, MonthlyData]) => ({
    month,
    revenue: data.revenue,
    profit: data.profit,
    transactions: data.transactions,
    manager_expenses: data.manager_expenses,
  }));

  // Process data for material types
  const materialStats = transactionsData?.reduce((acc: any, transaction: any) => {
    const materialType = transaction.material_type || 'Unknown';
    if (!acc[materialType]) {
      acc[materialType] = {
        quantity: 0,
        revenue: 0,
        count: 0,
      };
    }
    acc[materialType].quantity += transaction.limestone_rate || 0;
    acc[materialType].revenue += transaction.sale_price || 0;
    acc[materialType].count += 1;
    return acc;
  }, {});

  const materialData = Object.entries(materialStats || {}).map(([material, data]: [string, any]) => ({
    material,
    quantity: data.quantity,
    revenue: data.revenue,
    count: data.count,
  }));

  // Calculate summary statistics
  const transactions = transactionsData as QuarryData[];
  const totalRevenue = transactions?.reduce((sum: number, t: QuarryData) => sum + (Number(t.sale_price) || 0), 0) || 0;
  const totalProfit = transactions?.reduce((sum: number, t: QuarryData) => sum + (Number(t.profit) || 0), 0) || 0;
  const totalQuantity = transactions?.reduce((sum: number, t: QuarryData) => sum + (Number(t.stats_data) || 0), 0) || 0;
  
  // Calculate total manager expenses with logging
  const totalManagerExpenses = transactions?.reduce((sum: number, t: QuarryData) => {
    const expense = Number(t.managers_expenses);
    console.log('Manager expense item:', 
                'Manager:', t.manager_name,
                'Expense:', t.managers_expenses,
                'Salary:', t.manager_salary);
    return sum + (isNaN(expense) ? 0 : expense);
  }, 0) || 0;

  console.log('Total manager expenses:', totalManagerExpenses);

  const averageOrderValue = totalRevenue / (transactions?.length || 1);

  // Process customer data
  const customerStats = transactionsData?.reduce((acc: any, transaction: any) => {
    const customerName = transaction.sale_to || 'Unknown';
    if (!acc[customerName]) {
      acc[customerName] = {
        revenue: 0,
        transactions: 0,
      };
    }
    acc[customerName].revenue += transaction.sale_price || 0;
    acc[customerName].transactions += 1;
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

  // Process manager data with detailed logging
  const managerStats = transactions?.reduce((acc: Record<string, ManagerStats>, transaction: QuarryData) => {
    const managerName = transaction.manager_name;
    const managerExpense = Number(transaction.managers_expenses);
    const salary = Number(transaction.manager_salary);
    const foodAllowance = Number(transaction.manager_weekly_food_allowance);
    const travelAllowance = Number(transaction.manager_weekly_travel_allowance);

    console.log('Processing transaction:', {
      managerName,
      managerExpense,
      salary,
      foodAllowance,
      travelAllowance,
      raw: transaction
    });

    if (!managerName || (!managerExpense && !salary && !foodAllowance && !travelAllowance)) {
      return acc;
    }

    if (!acc[managerName]) {
      acc[managerName] = {
        salary: 0,
        food_allowance: 0,
        travel_allowance: 0,
        total_expenses: 0,
        transactions: 0,
      };
    }

    if (!isNaN(managerExpense) && managerExpense > 0) {
      acc[managerName].total_expenses += managerExpense;
    }
    if (!isNaN(salary) && salary > 0) {
      acc[managerName].salary += salary;
    }
    if (!isNaN(foodAllowance) && foodAllowance > 0) {
      acc[managerName].food_allowance += foodAllowance;
    }
    if (!isNaN(travelAllowance) && travelAllowance > 0) {
      acc[managerName].travel_allowance += travelAllowance;
    }
    acc[managerName].transactions += 1;

    return acc;
  }, {});

  const managerData = Object.entries(managerStats || {})
    .map(([name, data]: [string, ManagerStats]) => ({
      name,
      ...data,
    }))
    .sort((a, b) => b.total_expenses - a.total_expenses);

  // Process expense breakdown for pie chart
  const expenseBreakdown = [
    { 
      name: 'Manager Expenses', 
      value: transactions?.reduce((sum: number, t: QuarryData) => {
        const expense = Number(t.managers_expenses);
        return sum + (isNaN(expense) ? 0 : expense);
      }, 0) || 0 
    }
  ];

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
          <h3 className="text-gray-500 text-sm">Manager Expenses</h3>
          <p className="text-2xl font-bold">₹{totalManagerExpenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Monthly Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Revenue & Profit Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue & Profit</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Manager Expenses Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Manager Expenses</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="manager_expenses" stroke="#8B5CF6" name="Manager Expenses" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Manager Expenses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manager Expenses Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manager Expenses Breakdown</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={true}
                  label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Manager Details Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manager Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Manager</th>
                  <th className="text-right py-2">Salary</th>
                  <th className="text-right py-2">Food</th>
                  <th className="text-right py-2">Travel</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {managerData.map((manager) => (
                  <tr key={manager.name} className="border-b">
                    <td className="py-2">{manager.name}</td>
                    <td className="text-right">₹{manager.salary.toLocaleString()}</td>
                    <td className="text-right">₹{manager.food_allowance.toLocaleString()}</td>
                    <td className="text-right">₹{manager.travel_allowance.toLocaleString()}</td>
                    <td className="text-right">₹{manager.total_expenses.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <YAxis yAxisId="left" orientation="left" stroke="#10B981" />
                <YAxis yAxisId="right" orientation="right" stroke="#3B82F6" />
                <Tooltip formatter={(value, name) => [
                  name === "quantity" ? `${value.toLocaleString()} tons` : `₹${value.toLocaleString()}`,
                  name === "quantity" ? "Quantity" : "Revenue"
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#10B981" name="Quantity" />
                <Bar yAxisId="right" dataKey="revenue" fill="#3B82F6" name="Revenue" />
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
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
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
                  <th className="text-right py-2">Quantity (tons)</th>
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