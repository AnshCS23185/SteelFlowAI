import api from './axios';

export const module4Api = {
  fetchDispatchKPIs: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/dispatch/kpis`);
    return response.data;
  },

  fetchDispatchRecommendations: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/dispatch/recommendations`);
    return response.data;
  },

  createDispatchBatch: async (projectId, recommendationId) => {
    const response = await api.post(`/projects/${projectId}/dispatch/batches?recommendation_id=${recommendationId}`);
    return response.data;
  }
};
