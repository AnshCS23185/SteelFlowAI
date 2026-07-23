import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import logoImg from '../../../assets/logo.png';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Menu,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNavbar({ onMenuClick }) {
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border-base bg-surface-base px-6 flex items-center justify-between transition-colors duration-250 select-none">
      {/* Brand Logo & Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 pr-4 md:border-r md:border-border-base h-8 flex-shrink-0">
          <img 
            src={logoImg} 
            alt="SteelFlow" 
            className={`h-8 w-auto object-contain transition-all ${isDark ? 'brightness-100' : 'brightness-0'}`}
          />
        </div>

        {/* Mobile Burger */}
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-hover-bg md:hidden transition-all text-text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Premium Clean Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects, inventory, assembly logs..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-surface-elevated border border-border-base rounded-md outline-none text-text-primary placeholder-text-muted focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-hover-bg text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-md hover:bg-hover-bg text-text-secondary hover:text-text-primary transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative pl-3 border-l border-border-base" ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-primary border border-border-base">
              {user?.avatar || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-text-primary leading-none">{user?.name}</p>
              <p className="text-[9px] text-text-secondary font-medium tracking-wide mt-0.5 uppercase">{user?.title}</p>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-48 bg-surface-base border border-border-base rounded-lg shadow-lg overflow-hidden flex flex-col py-1 z-50"
              >
                <div className="px-4 py-2 border-b border-border-base md:hidden">
                  <p className="text-xs font-bold text-text-primary leading-none">{user?.name}</p>
                  <p className="text-[9px] text-text-secondary font-medium tracking-wide mt-0.5 uppercase">{user?.title}</p>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-hover-bg hover:text-text-primary transition-colors text-left w-full">
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-hover-bg hover:text-text-primary transition-colors text-left w-full">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <div className="border-t border-border-base my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
