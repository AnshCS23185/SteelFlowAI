import {
  defaultProjects,
  defaultInventory,
  defaultProduction,
  defaultTransportation,
  defaultDocuments,
  defaultDailyProgress,
  defaultIssues,
  defaultPhotos
} from '../utils/mockData';

// Helper to initialize localStorage
const getOrInit = (key, defaultData) => {
  const data = localStorage.getItem(`steelflow_${key}`);
  if (data) {
    return JSON.parse(data);
  }
  localStorage.setItem(`steelflow_${key}`, JSON.stringify(defaultData));
  return defaultData;
};

// State initialized reactively from localStorage
const state = {
  projects: getOrInit('projects', defaultProjects),
  inventory: getOrInit('inventory', defaultInventory),
  production: getOrInit('production', defaultProduction),
  transportation: getOrInit('transportation', defaultTransportation),
  documents: getOrInit('documents', defaultDocuments),
  dailyProgress: getOrInit('dailyProgress', defaultDailyProgress),
  issues: getOrInit('issues', defaultIssues),
  photos: getOrInit('photos', defaultPhotos)
};

const saveState = (key) => {
  localStorage.setItem(`steelflow_${key}`, JSON.stringify(state[key]));
};

export const api = {
  // Projects
  getProjects: () => {
    return [...state.projects];
  },
  
  getProjectById: (id) => {
    return state.projects.find(p => p.id === id) || null;
  },

  createProject: (projectData) => {
    const newProject = {
      id: String(state.projects.length + 1),
      progress: 0,
      status: 'Active',
      phases: [
        { id: 'p1', name: 'Detailing & Shop Drawings', progress: 0, status: 'Active' },
        { id: 'p2', name: 'Raw Material Procurement', progress: 0, status: 'Planning' },
        { id: 'p3', name: 'Cutting & Drilling', progress: 0, status: 'Planning' },
        { id: 'p4', name: 'Assembly & Welding', progress: 0, status: 'Planning' },
        { id: 'p5', name: 'QA Inspection & NDT', progress: 0, status: 'Planning' },
        { id: 'p6', name: 'Blasting & Painting', progress: 0, status: 'Planning' },
        { id: 'p7', name: 'Dispatch & Assembly on Site', progress: 0, status: 'Planning' }
      ],
      ...projectData
    };
    state.projects.push(newProject);
    saveState('projects');

    // Init associated arrays
    state.inventory[newProject.id] = [];
    state.production[newProject.id] = [];
    state.transportation[newProject.id] = [];
    state.documents[newProject.id] = [];
    state.dailyProgress[newProject.id] = [];
    state.issues[newProject.id] = [];
    state.photos[newProject.id] = [];

    saveState('inventory');
    saveState('production');
    saveState('transportation');
    saveState('documents');
    saveState('dailyProgress');
    saveState('issues');
    saveState('photos');

    return newProject;
  },

  updateProject: (id, projectUpdates) => {
    const index = state.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      state.projects[index] = { ...state.projects[index], ...projectUpdates };
      saveState('projects');
      return state.projects[index];
    }
    return null;
  },

  archiveProject: (id) => {
    return api.updateProject(id, { status: 'Archived' });
  },

  // Inventory
  getInventory: (projectId) => {
    return state.inventory[projectId] || [];
  },

  updateInventoryItem: (projectId, itemId, updates) => {
    const list = state.inventory[projectId] || [];
    const index = list.findIndex(item => item.id === itemId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      state.inventory[projectId] = list;
      saveState('inventory');
      return list[index];
    }
    return null;
  },

  // Production
  getProduction: (projectId) => {
    return state.production[projectId] || [];
  },

  updateProductionItem: (projectId, itemId, updates) => {
    const list = state.production[projectId] || [];
    const index = list.findIndex(item => item.id === itemId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      state.production[projectId] = list;
      saveState('production');
      return list[index];
    }
    return null;
  },

  // Transportation
  getTransportation: (projectId) => {
    return state.transportation[projectId] || [];
  },

  addTransportationLoad: (projectId, loadData) => {
    const list = state.transportation[projectId] || [];
    const newLoad = {
      id: `t_${Date.now()}`,
      status: 'Scheduled',
      dispatchDate: new Date().toISOString().split('T')[0],
      ...loadData
    };
    list.push(newLoad);
    state.transportation[projectId] = list;
    saveState('transportation');
    return newLoad;
  },

  // Documents
  getDocuments: (projectId) => {
    return state.documents[projectId] || [];
  },

  uploadDocument: (projectId, docData) => {
    const list = state.documents[projectId] || [];
    const newDoc = {
      id: `d_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...docData
    };
    list.push(newDoc);
    state.documents[projectId] = list;
    saveState('documents');
    return newDoc;
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
