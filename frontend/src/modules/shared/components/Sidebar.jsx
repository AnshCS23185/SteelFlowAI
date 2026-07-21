import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Briefcase, 
  LogOut, 
  Terminal, 
  Layers,
  LayoutGrid,
  Package,
  Home,
  FileText,
  ClipboardList,
  Activity,
  User
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
    { name: 'Team & Users', path: '/admin/users', icon: User },
  ];

  const supervisorLinks = [
    { name: 'My Projects', path: '/supervisor/projects', icon: Layers }
  ];

  const clientLinks = [
    { name: 'Project Portal', path: '/client/project', icon: Terminal },
  ];

  const inventoryLinks = [
    { name: 'Dashboard', path: '/inventory/dashboard', icon: LayoutGrid },
    { name: 'Materials Catalog', path: '/inventory/materials', icon: Package },
    { name: 'Warehouses', path: '/inventory/warehouses', icon: Home },
    { name: 'Inventory Levels', path: '/inventory/stock', icon: Layers },
    { name: 'Goods Receipts', path: '/inventory/goods-receipts', icon: FileText },
    { name: 'Material Requests', path: '/inventory/requests', icon: ClipboardList },
    { name: 'Transactions Log', path: '/inventory/transactions', icon: Activity }
  ];

  let links = [];
  if (user.role === 'super_admin') links = adminLinks;
  else if (user.role === 'project_manager') links = supervisorLinks;
  else if (user.role === 'client') links = clientLinks;
  else if (user.role === 'inventory_manager') links = inventoryLinks;

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
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col w-[72px] border-r border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] transition-transform duration-220 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links (No overflow clipping so tooltips display fully) */}
        <nav className="flex-1 py-4 space-y-2 flex flex-col items-center">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  relative w-12 h-12 flex items-center justify-center rounded transition-all duration-150 group cursor-pointer
                  ${isActive 
                    ? 'text-[#FF5A1F] bg-gray-100 dark:bg-gray-800 font-semibold' 
                    : 'text-[#6B7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left orange indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#FF5A1F] rounded-r" />
                    )}
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    
                    {/* Hover Tooltip Card (Translates slightly on hover, rendering above all elements) */}
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700/20 dark:border-gray-200 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 whitespace-nowrap z-50">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="py-4 border-t border-[#E5E7EB] dark:border-gray-800 flex flex-col items-center justify-center">
          <button
            onClick={handleLogout}
            className="relative w-12 h-12 flex items-center justify-center text-red-500 hover:text-red-600 hover:bg-red-500/5 dark:hover:bg-red-500/10 rounded transition-all duration-150 group cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            
            {/* Sign Out Tooltip */}
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[10px] font-bold uppercase tracking-wider rounded border border-gray-700/20 dark:border-gray-200 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 whitespace-nowrap z-50">
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
