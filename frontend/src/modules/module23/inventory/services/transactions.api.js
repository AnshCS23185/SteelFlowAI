import { inventoryApi as axiosInstance } from '../../../../services/axios';

export const transactionsApi = {
  getTransactions: async () => {
    const response = await axiosInstance.get('/transactions');
    return response.data;
  },
  
  getTransactionsByMaterial: async (materialId) => {
    const response = await axiosInstance.get(`/transactions/material/${materialId}`);
    return response.data;
  }
};
