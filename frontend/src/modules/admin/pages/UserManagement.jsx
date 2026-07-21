import { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { Plus, Search, Shield, ShieldOff, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'project_manager'
  });

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInviteUser = async (e) => {
    e.preventDefault();
    setError(null);
    if (!newUser.email || !newUser.password || !newUser.full_name) return;

    setIsSubmitting(true);
    try {
      await api.createUser(newUser);
      setShowInviteModal(false);
      setNewUser({ full_name: '', email: '', password: '', role: 'project_manager' });
      fetchUsers();
    } catch (err) {
      console.error("Failed to create user", err);
      setError(err.response?.data?.detail || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle user status", err);
      alert(err.response?.data?.detail || "Action failed.");
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-base">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest">
            Administration
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-text-primary">
            Team & Users
          </h1>
          <p className="text-sm text-text-secondary max-w-xl">
            Provision access for Project Managers, Inventory Managers, and Clients.
          </p>
        </div>
        
        <button
          onClick={() => {
            setError(null);
            setNewUser({ full_name: '', email: '', password: '', role: 'project_manager' });
            setShowPassword(false);
            setShowInviteModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 text-xs font-semibold rounded-md shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-surface-base border border-border-base rounded-md outline-none text-text-primary focus:border-brand-orange transition-all"
        />
      </div>

      <div className="bg-surface-base border border-border-base rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs text-text-secondary">
          <thead className="bg-surface-elevated uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-surface-elevated/50 transition-colors">
                <td className="px-6 py-4 font-medium text-text-primary">
                  {user.full_name || 'N/A'}<br/>
                  <span className="text-[10px] text-text-secondary font-normal">{user.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded bg-surface-elevated border border-border-base text-text-primary uppercase text-[10px] tracking-wider font-bold">
                    {user.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.is_active ? (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  {user.role !== 'super_admin' && (
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.is_active ? "Deactivate User" : "Reactivate User"}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        user.is_active 
                          ? 'text-red-500 hover:bg-red-500/10' 
                          : 'text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                    >
                      {user.is_active ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-text-secondary">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showInviteModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black"
              onClick={() => setShowInviteModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-bg-base border-l border-border-base shadow-2xl p-8 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-display font-bold text-text-primary">
                  Invite New User
                </h2>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-1.5 hover:bg-surface-elevated rounded-md transition-all cursor-pointer text-text-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleInviteUser} className="space-y-5 flex-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Full Name</label>
                  <input
                    required
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                    className="w-full p-2.5 text-xs bg-surface-base border border-border-base rounded outline-none text-text-primary focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Email Address</label>
                  <input
                    required
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full p-2.5 text-xs bg-surface-base border border-border-base rounded outline-none text-text-primary focus:border-brand-orange"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Temporary Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full p-2.5 pr-10 text-xs bg-surface-base border border-border-base rounded outline-none text-text-primary focus:border-brand-orange"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">Assign Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full p-2.5 text-xs bg-surface-base border border-border-base rounded outline-none text-text-primary focus:border-brand-orange"
                  >
                    <option value="project_manager">Project Manager</option>
                    <option value="inventory_manager">Inventory Manager</option>
                    <option value="client">Client Representative</option>
                  </select>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-brand-orange text-white hover:bg-brand-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold rounded shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
