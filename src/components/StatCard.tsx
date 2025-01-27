import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">₹{value.toLocaleString()}</h3>
        </div>
        <div className={`flex items-center px-2.5 py-0.5 rounded-full text-sm ${
          change >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
        }`}>
          {change >= 0 ? (
            <ArrowUpRight size={16} className="mr-1" />
          ) : (
            <ArrowDownRight size={16} className="mr-1" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

export default StatCard;