# Quarry Dashboard

A comprehensive dashboard application for managing quarry operations, built with React, TypeScript, and Google Sheets integration.

## Features

- 📊 Real-time data visualization with interactive charts
- 💰 Financial metrics tracking (revenue, profit, expenses)
- 🚛 Fleet management and tracking
- 👥 Customer information management
- 📈 Statistical analysis and reporting
- 📱 Responsive design for all devices

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A Google account with access to Google Sheets API

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/pinkeshdpatel/quarry-dashboard.git
   cd quarry-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Google Sheets Setup**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Sheets API
   - Create service account credentials
   - Download the credentials JSON file
   - Rename it to `credentials.json` and place it in the `server` directory

4. **Environment Configuration**
   - Create a `.env` file in the `server` directory
   - Add your Google Sheet ID:
     ```
     SHEET_ID=your_google_sheet_id_here
     ```

5. **Share Google Sheet**
   - Share your Google Sheet with the service account email (found in credentials.json)
   - Ensure the service account has edit access

6. **Start the Development Server**
   ```bash
   # Start the backend server
   cd server
   npm install
   node index.js

   # In a new terminal, start the frontend
   cd ..
   npm run dev
   ```

## Project Structure

```
quarry-dashboard/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and service functions
│   └── types/          # TypeScript type definitions
├── server/             # Backend server files
└── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Deployment

To deploy to GitHub Pages:

1. Update `homepage` in `package.json`:
   ```json
   {
     "homepage": "https://your-username.github.io/quarry-dashboard"
   }
   ```

2. Update `base` in `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/quarry-dashboard/',
     // ... other config
   });
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Data Structure

The Google Sheet should have the following columns:
- Loading Date
- Stats Data
- Quarry name
- Challan
- Challan Owner
- Diesel
- Driver Allowance
- Weightment Charge
- Total
- Sale to
- Sale Price
- Profit
- Maintenance expense
- Fleet charges

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Notes

- Never commit sensitive credentials to version control
- Always use environment variables for sensitive information
- Keep your service account credentials secure

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository. 