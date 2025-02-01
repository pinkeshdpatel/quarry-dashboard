export interface QuarryData {
  id: number;
  loading_date: string;
  limestone_rate: number;
  quarry_name: string;
  challan: number;
  challan_owner: string;
  diesel: number;
  driver_allowance: number;
  weightment_charge: number;
  total: number;
  sale_to: string;
  sale_price: number;
  profit: number;
  maintenance_expense: number;
  fleet_charges: number;
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