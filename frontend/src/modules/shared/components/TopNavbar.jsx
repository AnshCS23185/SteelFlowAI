import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Menu,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';
import { useState } from 'react';

export default function TopNavbar({ onMenuClick }) {
  const { toggleTheme, isDark } = useTheme();
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const roles = [
    { id: 'admin', name: 'Administrator' },
    { id: 'supervisor', name: 'Project Supervisor' },
    { id: 'client', name: 'Client Portal' }
  ];

  const handleRoleChange = (roleId) => {
    switchRole(roleId);
    setShowRoleSelector(false);
    if (roleId === 'admin') navigate('/admin/projects');
    else if (roleId === 'supervisor') navigate('/supervisor/projects');
    else if (roleId === 'client') navigate('/client/project');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border-base bg-surface-base/80 backdrop-blur-md px-6 flex items-center justify-between transition-colors duration-250">
      {/* Mobile Burger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-surface-elevated md:hidden transition-all"
        >
          <Menu className="w-5 h-5 text-text-primary" />
        </button>

        {/* Premium Clean Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search projects, inventory, assembly logs..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-surface-elevated border border-border-base rounded-md outline-none text-text-primary placeholder-text-secondary focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Role Quick Switcher (Great for previewing) */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[11px] font-semibold text-brand-orange hover:bg-orange-500/10 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Switch Role</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showRoleSelector && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowRoleSelector(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-surface-base border border-border-base rounded-md shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-wider border-b border-border-base">
                  Simulate Experience
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-surface-elevated transition-colors ${
                      user?.role === r.id ? 'text-brand-orange font-semibold' : 'text-text-primary'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-md hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-orange" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-border-base">
          <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-primary border border-border-base">
            {user?.avatar || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
