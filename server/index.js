const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Sheets client
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    token_uri: 'https://oauth2.googleapis.com/token',
    client_x509_cert_url: process.env.GOOGLE_CERT_URL,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Helper function to transform sheet data
function transformData(values) {
  if (!values || values.length === 0) return [];
  const headers = values[0];
  console.log('Raw headers:', headers);
  
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Convert header to lowercase and replace spaces with underscores
      const key = header.toLowerCase().replace(/\s+/g, '_');
      // Convert numeric strings to numbers
      const value = row[index];
      obj[key] = isNaN(value) || value === '' ? value : Number(value);
    });
    return obj;
  });
}

// Get all data and process it for different endpoints
async function getAllData() {
  try {
    console.log('Fetching data from sheet...');
    console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);
    
    // First, get the sheet name
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });
    
    const sheetName = spreadsheet.data.sheets[0].properties.title;
    console.log('Sheet name:', sheetName);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A1:O100`,
    });
    
    if (!response.data.values) {
      console.log('No data found in sheet');
      throw new Error('No data found in the sheet');
    }
    
    console.log('Number of rows:', response.data.values.length);
    console.log('Headers:', response.data.values[0]);
    
    const transformedData = transformData(response.data.values);
    console.log('Sample transformed data:', transformedData[0]);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

// Routes
app.get('/api/stats', async (req, res) => {
  try {
    const data = await getAllData();
    console.log('Processing stats for', data.length, 'records');
    
    // Calculate stats
    const stats = {
      total_revenue: data.reduce((sum, row) => sum + (row.sale_price || 0), 0),
      total_profit: data.reduce((sum, row) => sum + (row.profit || 0), 0),
      total_expenses: data.reduce((sum, row) => sum + (row.maintenace_expense || 0) + (row.fleet_charges || 0), 0),
      total_transactions: data.length,
      average_profit_per_transaction: data.length > 0 ? data.reduce((sum, row) => sum + (row.profit || 0), 0) / data.length : 0,
      total_limestone: data.reduce((sum, row) => sum + (row.limestone_rate || 0), 0),
      total_diesel: data.reduce((sum, row) => sum + (row.diesel || 0), 0),
    };
    
    console.log('Calculated stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const data = await getAllData();
    // Get unique customers (sellers)
    const customers = [...new Set(data.map(row => row.sale_to))].map(customer => {
      const customerTransactions = data.filter(row => row.sale_to === customer);
      return {
        name: customer,
        total_transactions: customerTransactions.length,
        total_revenue: customerTransactions.reduce((sum, row) => sum + (row.sale_price || 0), 0),
        total_profit: customerTransactions.reduce((sum, row) => sum + (row.profit || 0), 0),
        total_limestone: customerTransactions.reduce((sum, row) => sum + (row.limestone_rate || 0), 0),
      };
    });
    res.json(customers);
  } catch (error) {
    console.error('Error in /api/customers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fleet', async (req, res) => {
  try {
    const data = await getAllData();
    // Get fleet data grouped by quarry
    const fleet = [...new Set(data.map(row => row.quarry_name))].map(quarry => {
      const quarryData = data.filter(row => row.quarry_name === quarry);
      return {
        quarry_name: quarry,
        total_trips: quarryData.length,
        total_diesel: quarryData.reduce((sum, row) => sum + (row.diesel || 0), 0),
        total_fleet_charges: quarryData.reduce((sum, row) => sum + (row.fleet_charges || 0), 0),
        total_maintenance: quarryData.reduce((sum, row) => sum + (row.maintenace_expense || 0), 0),
        total_limestone: quarryData.reduce((sum, row) => sum + (row.limestone_rate || 0), 0),
        total_driver_allowance: quarryData.reduce((sum, row) => sum + (row.driver_allownace || 0), 0),
      };
    });
    res.json(fleet);
  } catch (error) {
    console.error('Error in /api/fleet:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const data = await getAllData();
    res.json(data);
  } catch (error) {
    console.error('Error in /api/transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 