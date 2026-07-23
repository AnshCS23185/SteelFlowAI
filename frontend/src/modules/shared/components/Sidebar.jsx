import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Briefcase, 
  Terminal, 
  Layers,
  LayoutGrid,
  Package,
  ClipboardList,
  Activity,
  User
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user } = useAuth();

  if (!user) return null;

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
    { name: 'Material Master', path: '/inventory/materials', icon: Package },
    { name: 'Requests', path: '/inventory/requests', icon: ClipboardList },
    { name: 'Allocation Logs', path: '/inventory/allocation-logs', icon: Activity }
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
        className={`fixed top-16 bottom-0 left-0 z-40 flex flex-col w-[72px] border-r border-border-base bg-surface-base transition-transform duration-220 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links */}
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
                    ? 'text-brand-orange bg-surface-elevated font-semibold' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left orange indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-brand-orange rounded-r" />
                    )}
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    
                    {/* Hover Tooltip Card */}
                    <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-background text-text-primary text-[10px] font-bold uppercase tracking-wider rounded border border-border-base shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-150 whitespace-nowrap z-50">
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
