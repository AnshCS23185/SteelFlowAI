import { inventoryApi as axiosInstance } from '../../../../services/axios';

export const materialsApi = {
  getMaterials: async () => {
    const response = await axiosInstance.get('/materials');
    return response.data;
  },
  
  createMaterial: async (data) => {
    const response = await axiosInstance.post('/materials', data);
    return response.data;
  },
  
  updateMaterial: async (id, data) => {
    const response = await axiosInstance.put(`/materials/${id}`, data);
    return response.data;
  },
  
  deleteMaterial: async (id) => {
    const response = await axiosInstance.delete(`/materials/${id}`);
    return response.data;
  }
};
