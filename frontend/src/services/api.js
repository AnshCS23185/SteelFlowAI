import axiosInstance from './axios';
import {
  defaultInventory,
  defaultProduction,
  defaultTransportation,
  defaultDailyProgress,
  defaultIssues,
  defaultPhotos
} from '../utils/mockData';

// Helper to initialize localStorage for mocked modules
const getOrInit = (key, defaultData) => {
  const data = localStorage.getItem(`steelflow_v2_${key}`);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(`steelflow_v2_${key}`, JSON.stringify(defaultData));
  return defaultData;
};

const state = {
  inventory: getOrInit('inventory', defaultInventory),
  production: getOrInit('production', defaultProduction),
  transportation: getOrInit('transportation', defaultTransportation),
  dailyProgress: getOrInit('dailyProgress', defaultDailyProgress),
  issues: getOrInit('issues', defaultIssues),
  photos: getOrInit('photos', defaultPhotos)
};

const saveState = (key) => {
  localStorage.setItem(`steelflow_v2_${key}`, JSON.stringify(state[key]));
};

export const api = {
  // Auth
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    const response = await axiosInstance.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
  },

  // Users
  getUsers: async () => {
    const response = await axiosInstance.get('/users/');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post('/users/', userData);
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await axiosInstance.post(`/users/${userId}/toggle-status`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await axiosInstance.get('/projects/');
    return response.data;
  },
  
  getProjectById: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await axiosInstance.post('/projects/', projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await axiosInstance.delete(`/projects/${projectId}`);
    return response.data;
  },

  assignUser: async (projectId, userId, role) => {
    const response = await axiosInstance.post(`/projects/${projectId}/assign`, {
      user_id: userId,
      assignment_role: role
    });
    return response.data;
  },

  // Documents
  getDocuments: async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/documents`);
    return response.data;
  },

  uploadDocument: async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(`/projects/${projectId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  uploadShippingList: async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(`/projects/${projectId}/shipping-lists`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getShippingLists: async (projectId) => {
    const response = await axiosInstance.get(`/projects/${projectId}/shipping-lists`);
    return response.data;
  },

  // Daily Progress
  getDailyProgress: (projectId) => {
    return state.dailyProgress[projectId] || [];
  },

  addDailyProgress: (projectId, logData) => {
    const list = state.dailyProgress[projectId] || [];
    const newLog = {
      id: `dp_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...logData
    };
    list.unshift(newLog); // newest first
    state.dailyProgress[projectId] = list;
    saveState('dailyProgress');
    return newLog;
  },

  // Issues
  getIssues: (projectId) => {
    return state.issues[projectId] || [];
  },

  reportIssue: (projectId, issueData) => {
    const list = state.issues[projectId] || [];
    const newIssue = {
      id: `is_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Open',
      response: '',
      ...issueData
    };
    list.unshift(newIssue);
    state.issues[projectId] = list;
    saveState('issues');
    return newIssue;
  },

  respondToIssue: (projectId, issueId, responseText) => {
    const list = state.issues[projectId] || [];
    const index = list.findIndex(issue => issue.id === issueId);
    if (index !== -1) {
      list[index] = { ...list[index], response: responseText, status: 'Resolved' };
      state.issues[projectId] = list;
      saveState('issues');
      return list[index];
    }
    return null;
  },

  // Photos
  getPhotos: (projectId) => {
    return state.photos[projectId] || [];
  },

  uploadPhoto: (projectId, photoData) => {
    const list = state.photos[projectId] || [];
    const newPhoto = {
      id: `ph_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...photoData
    };
    list.unshift(newPhoto);
    state.photos[projectId] = list;
    saveState('photos');
    return newPhoto;
  }
};
