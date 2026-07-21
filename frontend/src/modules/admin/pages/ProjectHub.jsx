import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { Plus, Search, Calendar, User, Compass, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Create Project State
  const [newProject, setNewProject] = useState({
    name: '',
    clientName: '',
    clientUserId: '',
    supervisorId: '',
    tonnage: '',
    deadline: '',
    description: '',
    location: 'Zone A - Fabrication Bay 3'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, usersData] = await Promise.all([
          api.getProjects(),
          api.getUsers()
        ]);
        
        const mappedData = projectsData.map(p => ({
          ...p,
          name: p.title,
          clientName: p.client_id, // Wait, backend should return client name eventually, but for now ID
          progress: 0,
          supervisorName: 'Assigned PM',
          tonnage: p.tonnage || 0
        }));
        setProjects(mappedData);
        setAvailableUsers(usersData.filter(u => u.is_active));
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name || !newProject.clientName) return;

    setIsSubmitting(true);
    try {
      await api.createProject({
        title: newProject.name,
        description: newProject.description,
        client_name: newProject.clientName,
        tonnage: parseInt(newProject.tonnage) || 0,
        supervisor_id: newProject.supervisorId || undefined,
        client_user_id: newProject.clientUserId || undefined
      });
      
      const updatedData = await api.getProjects();
      const mappedData = updatedData.map(p => ({
          ...p,
          name: p.title,
          clientName: p.client_id,
          progress: 0,
          supervisorName: 'Assigned PM',
          tonnage: p.tonnage || 0
      }));
      setProjects(mappedData);
      setShowCreateModal(false);
      setNewProject({
        name: '',
        clientName: '',
        clientUserId: '',
        supervisorId: '',
        tonnage: '',
        deadline: '',
        description: '',
        location: 'Zone A - Fabrication Bay 3'
      });
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // prevent card click
    if (window.confirm("Are you sure you want to permanently delete this project? All associated shipping lists and documents will also be removed.")) {
      try {
        await api.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (err) {
        console.error("Failed to delete project", err);
        alert(err.response?.data?.detail || "Failed to delete project.");
      }
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' 
      ? p.status.toLowerCase() !== 'archived' 
      : filter === 'Planning' 
        ? (p.status.toLowerCase() === 'planning' || p.status.toLowerCase() === 'registered') 
        : p.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10">
      {/* Header section with spacious design */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-base">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest">
            Overview Hub
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-text-primary">
            Good Morning, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm text-text-secondary max-w-xl">
            Monitor and coordinate structural fabrication logs, mill certificates, and shipping schedules across active projects.
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs font-semibold rounded-md shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-5 border border-border-base bg-surface-base rounded-lg">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Active projects</p>
          <p className="text-2xl font-display font-bold text-text-primary mt-1">
            {projects.filter(p => p.status.toLowerCase() === 'active').length}
          </p>
        </div>
        <div className="p-5 border border-border-base bg-surface-base rounded-lg">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Total Tonnage</p>
          <p className="text-2xl font-display font-bold text-text-primary mt-1">
            {projects.reduce((acc, p) => acc + (p.tonnage || 0), 0).toLocaleString()} Tons
          </p>
        </div>
        <div className="p-5 border border-border-base bg-surface-base rounded-lg">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Average Progress</p>
          <p className="text-2xl font-display font-bold text-text-primary mt-1">
            {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / (projects.length || 1))}%
          </p>
        </div>
        <div className="p-5 border border-border-base bg-surface-base rounded-lg">
          <p className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Planning Phase</p>
          <p className="text-2xl font-display font-bold text-text-primary mt-1">
            {projects.filter(p => p.status.toLowerCase() === 'planning' || p.status.toLowerCase() === 'registered').length}
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {['All', 'Active', 'Planning'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === status
                  ? 'bg-text-primary text-white dark:bg-white dark:text-[#111111]'
                  : 'bg-surface-base text-text-secondary border border-border-base hover:bg-surface-elevated'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid with Hover scale animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              if (user?.role === 'super_admin') {
                alert("Administrators are restricted to high-level hub oversight and user management. Only assigned managers can enter specific project workspaces.");
              } else {
                navigate(`/project/${p.id}`);
              }
            }}
            className="group block p-6 border border-border-base bg-surface-base rounded-lg transition-all duration-200 hover:scale-[1.01] hover:border-brand-orange/30 cursor-pointer flex flex-col justify-between h-64"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                  p.status === 'Active' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}>
                  {p.status}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Due {p.deadline}
                  </span>
                  <button 
                    onClick={(e) => handleDeleteProject(e, p.id)}
                    className="p-1 rounded text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-lg font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                {p.name}
              </h2>
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-base">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-secondary">Fabrication Progress</span>
                  <span className="text-text-primary">{p.progress}%</span>
                </div>
                <div className="h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-orange transition-all duration-500" 
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>

              {/* Stakeholders info */}
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1.5 truncate max-w-[45%]">
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{p.clientName}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-[45%]">
                  <Compass className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{p.supervisorName}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal Drawer */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-bg-base border-l border-border-base shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-bold text-text-primary">
                    Create New Project
                  </h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="p-1.5 hover:bg-surface-elevated rounded-md transition-all cursor-pointer text-text-secondary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Project Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Apex Commercial Tower"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Client Company Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Apex Corp"
                        value={newProject.clientName}
                        onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                        className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">Project Manager</label>
                        <select
                          required
                          value={newProject.supervisorId}
                          onChange={(e) => setNewProject({...newProject, supervisorId: e.target.value})}
                          className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                        >
                          <option value="">Select Project Manager...</option>
                          {availableUsers
                            .filter(u => u.role === 'project_manager')
                            .map(u => (
                              <option key={u.id} value={u.id}>{u.full_name ? `${u.full_name} (${u.email})` : u.email}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-text-secondary uppercase">Client Representative</label>
                        <select
                          required
                          value={newProject.clientUserId}
                          onChange={(e) => setNewProject({...newProject, clientUserId: e.target.value})}
                          className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                        >
                          <option value="">Select Client User...</option>
                          {availableUsers
                            .filter(u => u.role === 'client')
                            .map(u => (
                              <option key={u.id} value={u.id}>{u.full_name ? `${u.full_name} (${u.email})` : u.email}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Tonnage (Tons)</label>
                      <input
                        type="number"
                        placeholder="4200"
                        value={newProject.tonnage}
                        onChange={(e) => setNewProject({...newProject, tonnage: e.target.value})}
                        className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">Deadline</label>
                      <input
                        required
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                        className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">Project Description</label>
                    <textarea
                      rows={3}
                      placeholder="Add brief details of structural components, paint requirements..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      className="w-full p-3 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange resize-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-brand-orange text-white hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold rounded-md shadow-sm transition-all cursor-pointer"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-3 bg-surface-base border border-border-base text-xs font-semibold rounded-md transition-all cursor-pointer text-text-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
