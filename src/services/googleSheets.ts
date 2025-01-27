import { QuarryData } from '../types';

const API_URL = 'http://localhost:3001/api';

class GoogleSheetsService {
  async getStats() {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return [];
    }
  }

  async getCustomers() {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async getFleet() {
    try {
      const response = await fetch(`${API_URL}/fleet`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching fleet:', error);
      return [];
    }
  }

  async getTransactions() {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async updateData(range: string, values: any[][]) {
    try {
      const response = await fetch(`${API_URL}/update`, {
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