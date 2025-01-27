import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Users, 
  Truck, 
  Receipt, 
  Settings, 
  Shield 
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-emerald-900 text-white h-screen p-4">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Truck className="mr-2" />
          QuarryDash
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-xs uppercase text-gray-400 font-semibold">MENU</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <LayoutDashboard className="mr-3" size={20} />
                Overview
              </Link>
            </li>
            <li>
              <Link
                to="/statistics"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/statistics') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <BarChart2 className="mr-3" size={20} />
                Statistics
              </Link>
            </li>
            <li>
              <Link
                to="/customers"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/customers') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <Users className="mr-3" size={20} />
                Customers
              </Link>
            </li>
            <li>
              <Link
                to="/fleet"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/fleet') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <Truck className="mr-3" size={20} />
                Fleet
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/transactions') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <Receipt className="mr-3" size={20} />
                Transactions
              </Link>
            </li>
          </ul>
        </nav>

        <h2 className="text-xs uppercase text-gray-400 font-semibold mt-8">GENERAL</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-lg ${
                  isActive('/settings') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <Settings className="mr-3" size={20} />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;