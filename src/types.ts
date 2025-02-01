export interface QuarryData {
  id?: number;
  loading_date: string;
  serial_no: number;
  truck_no: number;
  quarry_name: string;
  stats_data: number;
  challan: number;
  challan_owner: string;
  diesel: number;
  driver_allownace: number;
  weightment_charge: number;
  maintenace_expense: number;
  total: number;
  sale_to: string;
  sale_price: number;
  profit: number;
  'Manager Name'?: string;
  'Manager Salary'?: number;
  'Manager weekly food allowance'?: number;
  'Manager weekly travel allowance'?: number;
  'Managers expenses'?: number;
}

declare module '*.json' {
  const value: any;
  export default value;
}