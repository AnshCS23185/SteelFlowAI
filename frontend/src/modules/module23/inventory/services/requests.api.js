import { inventoryApi as axiosInstance } from '../../../../services/axios';

export const requestsApi = {
  getRequests: async () => {
    const response = await axiosInstance.get('/material-requests');
    return response.data;
  },
  
  createRequest: async (data) => {
    const response = await axiosInstance.post('/material-requests', data);
    return response.data;
  },
  
  approveRequest: async (id) => {
    const response = await axiosInstance.post(`/material-requests/approve/${id}`);
    return response.data;
  },
  
  rejectRequest: async (id) => {
    const response = await axiosInstance.post(`/material_requests/reject/${id}`);
    return response.data;
  }
};
