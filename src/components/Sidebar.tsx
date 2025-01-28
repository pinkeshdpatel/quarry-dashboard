import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Receipt,
  BarChart2,
  Settings as SettingsIcon
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-emerald-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-bold flex items-center">
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
                className={`block py-2.5 px-4 rounded transition duration-200 ${
                  isActive('/') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/statistics"
                className={`block py-2.5 px-4 rounded transition duration-200 ${
                  isActive('/statistics') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart2 size={20} />
                  <span>Statistics</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/customers"
                className={`block py-2.5 px-4 rounded transition duration-200 ${
                  isActive('/customers') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users size={20} />
                  <span>Customers</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                to="/transactions"
                className={`block py-2.5 px-4 rounded transition duration-200 ${
                  isActive('/transactions') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Receipt size={20} />
                  <span>Transactions</span>
                </div>
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
                className={`block py-2.5 px-4 rounded transition duration-200 ${
                  isActive('/settings') ? 'bg-emerald-800' : 'hover:bg-emerald-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SettingsIcon size={20} />
                  <span>Settings</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;