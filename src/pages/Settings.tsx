import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';

interface SettingsSection {
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'toggle';
    value: string | number | boolean;
    options?: { value: string; label: string }[];
    description?: string;
  }[];
}

function Settings() {
  const [settings, setSettings] = useState<SettingsSection[]>([
    {
      title: 'General Settings',
      description: 'Configure basic application settings',
      fields: [
        {
          id: 'company_name',
          label: 'Company Name',
          type: 'text',
          value: 'Your Company Name',
          description: 'This will be displayed throughout the application',
        },
        {
          id: 'currency',
          label: 'Currency',
          type: 'select',
          value: 'INR',
          options: [
            { value: 'INR', label: 'Indian Rupee (₹)' },
            { value: 'USD', label: 'US Dollar ($)' },
            { value: 'EUR', label: 'Euro (€)' },
          ],
          description: 'Currency used for financial calculations',
        },
      ],
    },
    {
      title: 'Data Sync',
      description: 'Configure data synchronization settings',
      fields: [
        {
          id: 'auto_sync',
          label: 'Auto Sync',
          type: 'toggle',
          value: true,
          description: 'Automatically sync data with Google Sheets',
        },
        {
          id: 'sync_interval',
          label: 'Sync Interval (minutes)',
          type: 'number',
          value: 5,
          description: 'How often to sync data with Google Sheets',
        },
      ],
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences',
      fields: [
        {
          id: 'email_notifications',
          label: 'Email Notifications',
          type: 'toggle',
          value: false,
          description: 'Receive email notifications for important updates',
        },
        {
          id: 'notification_email',
          label: 'Notification Email',
          type: 'text',
          value: '',
          description: 'Email address for notifications',
        },
      ],
    },
  ]);

  const handleFieldChange = (sectionIndex: number, fieldId: string, newValue: string | number | boolean) => {
    const newSettings = [...settings];
    const field = newSettings[sectionIndex].fields.find(f => f.id === fieldId);
    if (field) {
      field.value = newValue;
    }
    setSettings(newSettings);
  };

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log('Saving settings:', settings);
  };

  const handleSync = () => {
    // TODO: Implement manual sync functionality
    console.log('Manual sync triggered');
  };

  const [notifications, setNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>

        {/* Notifications Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Notifications</h3>
            <p className="text-gray-600 text-sm">Receive notifications about important updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Email Reports Setting */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h3 className="font-medium">Email Reports</h3>
            <p className="text-gray-600 text-sm">Receive daily summary reports via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={emailReports}
              onChange={(e) => setEmailReports(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Dark Mode Setting */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-gray-600 text-sm">Switch to dark theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            Update Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings; 