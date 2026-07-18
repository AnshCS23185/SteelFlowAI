import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';
import logoImg from '../../../assets/logo.png';
import { 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Menu
} from 'lucide-react';

export default function TopNavbar({ onMenuClick }) {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] px-6 flex items-center justify-between transition-colors duration-250 select-none">
      {/* Brand Logo & Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 pr-4 md:border-r md:border-[#E5E7EB] dark:border-gray-800 h-8 flex-shrink-0">
          <img 
            src={logoImg} 
            alt="SteelFlow" 
            className={`h-10 w-auto object-contain transition-all ${isDark ? 'brightness-100' : 'brightness-0'}`}
          />
        </div>

        {/* Mobile Burger */}
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden transition-all"
        >
          <Menu className="w-5 h-5 text-text-primary" />
        </button>

        {/* Premium Clean Search Bar */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search projects, inventory, assembly logs..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded-md outline-none text-[#111827] dark:text-white placeholder-[#6B7280] focus:border-[#FF5A1F] focus:ring-1 focus:ring-[#FF5A1F] transition-all"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-all cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E5E7EB] dark:border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-gray-700">
            {user?.avatar || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#111827] dark:text-white leading-none">{user?.name}</p>
            <p className="text-[9px] text-[#6B7280] font-medium tracking-wide mt-0.5 uppercase">{user?.title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
