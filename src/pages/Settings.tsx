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

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-600">Configure application preferences</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleSync}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {settings.map((section, sectionIndex) => (
          <div key={section.title} className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 mb-6">{section.description}</p>
            
            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label htmlFor={field.id} className="font-medium">
                    {field.label}
                  </label>
                  
                  {field.type === 'text' && (
                    <input
                      type="text"
                      id={field.id}
                      className="border rounded-lg px-4 py-2 w-full max-w-md"
                      value={field.value as string}
                      onChange={(e) => handleFieldChange(sectionIndex, field.id, e.target.value)}
                    />
                  )}
                  
                  {field.type === 'number' && (
                    <input
                      type="number"
                      id={field.id}
                      className="border rounded-lg px-4 py-2 w-full max-w-md"
                      value={field.value as number}
                      onChange={(e) => handleFieldChange(sectionIndex, field.id, Number(e.target.value))}
                    />
                  )}
                  
                  {field.type === 'select' && (
                    <select
                      id={field.id}
                      className="border rounded-lg px-4 py-2 w-full max-w-md"
                      value={field.value as string}
                      onChange={(e) => handleFieldChange(sectionIndex, field.id, e.target.value)}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {field.type === 'toggle' && (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={field.value as boolean}
                        onChange={(e) => handleFieldChange(sectionIndex, field.id, e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {field.value ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  )}
                  
                  {field.description && (
                    <p className="text-sm text-gray-500">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings; 