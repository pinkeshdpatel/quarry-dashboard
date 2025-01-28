import { useState, useEffect } from 'react';
import { googleSheetsService } from '../services/googleSheets';

export function useGoogleSheets<T>(dataType: 'stats' | 'customers' | 'transactions') {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        switch (dataType) {
          case 'stats':
            result = await googleSheetsService.getStats();
            break;
          case 'customers':
            result = await googleSheetsService.getCustomers();
            break;
          case 'transactions':
            result = await googleSheetsService.getTransactions();
            break;
          default:
            throw new Error(`Invalid data type: ${dataType}`);
        }
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataType]);

  const updateData = async (range: string, values: any[][]) => {
    try {
      await googleSheetsService.updateData(range, values);
      // Refresh data after update
      const result = await googleSheetsService.getTransactions();
      setData(result as T);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return { data, loading, error, updateData };
} 