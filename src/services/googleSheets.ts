import { QuarryData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class GoogleSheetsService {
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  }

  async getCustomers() {
    try {
      const response = await fetch(`${API_URL}/api/customers`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async getFleet() {
    try {
      const response = await fetch(`${API_URL}/api/fleet`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fleet:', error);
      return [];
    }
  }

  async getTransactions() {
    try {
      const response = await fetch(`${API_URL}/api/transactions`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async updateData(range: string, values: any[][]) {
    try {
      const response = await fetch(`${API_URL}/api/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ range, values }),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService(); 