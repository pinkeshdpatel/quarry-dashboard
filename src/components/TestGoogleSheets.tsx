import React from 'react';
import { useGoogleSheets } from '../hooks/useGoogleSheets';

const TestGoogleSheets = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useGoogleSheets('stats');
  const { data: customersData, loading: customersLoading, error: customersError } = useGoogleSheets('customers');
  const { data: fleetData, loading: fleetLoading, error: fleetError } = useGoogleSheets('fleet');
  const { data: transactionsData, loading: transactionsLoading, error: transactionsError } = useGoogleSheets('transactions');

  if (statsLoading || customersLoading || fleetLoading || transactionsLoading) {
    return <div className="p-4">Loading data...</div>;
  }

  const hasError = statsError || customersError || fleetError || transactionsError;
  if (hasError) {
    return (
      <div className="p-4 text-red-500">
        Error loading data:
        <pre className="mt-2 text-sm">
          {statsError?.message || customersError?.message || fleetError?.message || transactionsError?.message}
        </pre>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Google Sheets Test</h2>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">Stats Data:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(statsData, null, 2)}
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Customers Data:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(customersData, null, 2)}
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Fleet Data:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(fleetData, null, 2)}
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Transactions Data:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(transactionsData, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default TestGoogleSheets; 