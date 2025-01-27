import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
  loading_date: string;
  quarry_name: string;
  sale_to: string;
  sale_price: number;
  profit: number;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${transaction.profit > 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {transaction.profit > 0 ? (
                    <ArrowUpRight className="text-emerald-600" size={20} />
                  ) : (
                    <ArrowDownRight className="text-red-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.quarry_name}</p>
                  <p className="text-sm text-gray-500">Sold to {transaction.sale_to}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{transaction.sale_price.toLocaleString()}</p>
                <p className={`text-sm ${transaction.profit > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {transaction.profit > 0 ? '+' : ''}{transaction.profit.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;