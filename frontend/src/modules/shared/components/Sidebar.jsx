import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Briefcase, 
  LogOut, 
  Terminal, 
  Layers 
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Project Hub', path: '/admin/projects', icon: Briefcase },
  ];

  const supervisorLinks = [
    { name: 'My Projects', path: '/supervisor/projects', icon: Layers },
  ];

  const clientLinks = [
    { name: 'Project Portal', path: '/client/project', icon: Terminal },
  ];

  let links = [];
  if (user.role === 'admin') links = adminLinks;
  else if (user.role === 'supervisor') links = supervisorLinks;
  else if (user.role === 'client') links = clientLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#191919] transition-transform duration-220 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 h-16 px-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded bg-[#F64A14] flex items-center justify-center font-display font-bold text-white text-base">
            SF
          </div>
          <div>
            <span className="font-display font-bold tracking-tight text-gray-900 dark:text-white block text-sm">
              SteelFlow AI
            </span>
            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block -mt-0.5">
              Enterprise SaaS
            </span>
          </div>
        </div>

        {/* User Info Quick Badge */}
        <div className="p-4 mx-4 my-4 rounded-lg bg-gray-50 dark:bg-[#222222]/55 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F64A14]/10 dark:bg-[#F64A14]/20 flex items-center justify-center text-sm font-bold text-[#F64A14]">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user.title}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  relative flex items-center gap-3.5 px-4 py-3.5 text-[15px] font-medium transition-all duration-180 group rounded-md cursor-pointer
                  ${isActive 
                    ? 'text-[#F64A14] bg-[#F64A14]/5 dark:bg-[#F64A14]/10 font-semibold' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#F64A14] rounded-r" />
                    )}
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-sans font-medium">{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 text-[15px] font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-md transition-all duration-180 cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
