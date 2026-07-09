import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { api } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Download, 
  BrainCircuit, 
  Sun, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList, 
  Layers, 
  Package, 
  Activity, 
  ShieldCheck, 
  Truck, 
  Clock, 
  FileText, 
  BarChart3,
  Flame,
  LayoutGrid,
  Bell
} from 'lucide-react';
import PersistentCopilot from '../modules/shared/components/PersistentCopilot';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectWorkspaceLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(true);

  useEffect(() => {
    const data = api.getProjectById(id);
    if (!data) {
      navigate('/login');
      return;
    }
    setProject(data);
  }, [id, navigate]);

  if (!project) return null;

  const currentPath = location.pathname.split('/').pop();
  
  const menuItems = [
    { name: 'Overview', path: 'overview', icon: ClipboardList },
    { name: 'Project', path: 'module1', icon: Layers },
    { name: 'Planning', path: 'planning', icon: Clock },
    { name: 'Manufacturing', path: 'manufacturing', icon: Activity },
    { name: 'Dispatch', path: 'dispatch', icon: ShieldCheck },
    { name: 'Transportation', path: 'transportation', icon: Truck },
    { name: 'Documents', path: 'documents', icon: FileText },
    { name: 'Insights', path: 'insights', icon: BarChart3 },
    { name: 'Settings', path: 'settings', icon: Settings }
  ];

  const handleBackToDashboard = () => {
    if (user?.role === 'admin') navigate('/admin/projects');
    else if (user?.role === 'supervisor') navigate('/supervisor/projects');
    else navigate('/client/project');
  };

  return (
    <div className="h-screen flex flex-col bg-bg-base text-text-primary transition-colors duration-250 overflow-hidden font-sans">
      
      {/* Immersive Top Workspace Navbar */}
      <header className="h-14 border-b border-border-base bg-surface-base px-4 flex items-center justify-between flex-shrink-0 z-30 transition-colors duration-250">
        
        {/* Left Side: Breadcrumb & Back button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors py-1.5 px-2.5 rounded hover:bg-surface-elevated cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-sans font-medium text-xs">Hub</span>
          </button>
          
          <div className="h-4 w-px bg-border-base" />
          
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
            Fabrication OS v2.6
          </span>
        </div>

        {/* Center: System Status Bar */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] uppercase font-bold tracking-wider text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Factory Health: <strong className="text-emerald-500 font-bold">Stable</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F64A14]" />
            <span>Progress: <strong className="text-[#F64A14] font-bold">{project.progress}%</strong></span>
          </div>
        </div>

        {/* Right Side: Quick Actions Panel */}
        <div className="flex items-center gap-2">
          <button 
            title="Export Workspace Data"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>

          <button 
            title="Share Workspace Link"
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setCopilotOpen(!copilotOpen)}
            className={`p-2 rounded transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              copilotOpen 
                ? 'bg-brand-orange/10 text-brand-orange' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span className="hidden sm:inline font-sans">Copilot</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side Navigation Sidebar */}
        <aside 
          className={`border-r border-border-base bg-surface-base flex flex-col justify-between transition-all duration-220 ease-in-out ${
            leftSidebarCollapsed ? 'w-14' : 'w-52'
          }`}
        >
          {/* Navigation links */}
          <nav className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(`/project/${project.id}/${item.path}`)}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 rounded text-left transition-all duration-180 group cursor-pointer ${
                    isActive 
                      ? 'bg-brand-orange/5 text-brand-orange font-semibold dark:bg-brand-orange/10' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/70'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-brand-orange' : ''}`} />
                  {!leftSidebarCollapsed && (
                    <span className="text-[13px] font-sans font-medium">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Toggle Sidebar Collapse */}
          <div className="p-2 border-t border-border-base flex justify-end">
            <button 
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1.5 hover:bg-surface-elevated rounded text-text-secondary cursor-pointer"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* Center: Scrollable Workspace Content (Figma Canvas / Editor like) */}
        <main className="flex-1 overflow-y-auto bg-bg-base p-6 lg:p-8 transition-colors duration-250">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet context={{ project, setProject }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Right Side: Persistent Copilot Panel */}
        <PersistentCopilot isOpen={copilotOpen} setIsOpen={setCopilotOpen} project={project} />

      </div>
    </div>
  );
}
