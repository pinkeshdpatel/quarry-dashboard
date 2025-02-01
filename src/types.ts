export interface QuarryData {
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
  total: number;
  sale_to: string;
  sale_price: number;
  profit: number;
  maintenace_expense: number;
  date_of_maintenace: string;
  fleet_charges: number;
  manager_name: string;
  manager_salary: number;
  manager_weekly_food_allowance: number;
  manager_weekly_travel_allowance: number;
  managers_expenses: number;
}

declare module '*.json' {
  const value: any;
  export default value;
}