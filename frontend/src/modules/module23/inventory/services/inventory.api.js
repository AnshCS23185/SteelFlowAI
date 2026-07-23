import { inventoryApi as axiosInstance } from '../../../../services/axios';

export const inventoryApi = {
  getDashboardSummary: async () => {
    const response = await axiosInstance.get('/dashboard');
    return response.data;
  },
  
  getInventoryStock: async () => {
    const response = await axiosInstance.get('/inventory');
    return response.data;
  }
};
