export interface QuarryData {
  'Loading Date': string;
  'serial no': number;
  'Truck No': number;
  'Quarry name': string;
  'Stats Data': number;
  'Challan': number;
  'Challan Owner': string;
  'Diesel': number;
  'Driver Allownace': number;
  'Weightment Charge': number;
  'Total': number;
  'Sale to': string;
  'Sale Price': number;
  'Profit': number;
  'maintenace expense': number;
  'Date of maintenace': string;
  'Fleet charges': number;
  'Manager Name': string;
  'Manager Salary': number;
  'Manager weekly food allowance': number;
  'Manager weekly travel allowance': number;
  'Managers expenses': number;
}

declare module '*.json' {
  const value: any;
  export default value;
}