import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { Calendar, ArrowRight } from 'lucide-react';

export default function SupervisorProjectHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // RLAC: The backend automatically filters this list based on the user's role!
        const data = await api.getProjects();
        const mappedData = data.map(p => ({
          ...p,
          name: p.title,
          description: p.description,
          deadline: '2027-01-01', // Dummy until we add deadline to DB
        }));
        
        setProjects(mappedData);

        // If only one project exists, redirect automatically (unless explicitly skipping)
        if (mappedData.length === 1 && !location.state?.skipRedirect) {
          navigate(`/project/${mappedData[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error("Failed to fetch assigned projects", err);
      }
    };
    fetchProjects();
  }, [user, navigate]);

  if (projects.length === 1 && !location.state?.skipRedirect) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-xs text-text-secondary animate-pulse">Loading assigned project workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-border-base">
        <p className="text-xs font-semibold text-brand-orange uppercase tracking-widest">Supervisor Workspace</p>
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary mt-1.5">
          My Active Projects
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Select one of your assigned fabrication contracts below to update production logs, mark items ready, or report floor issues.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/project/${p.id}`)}
              className="p-6 bg-surface-base border border-border-base rounded-lg transition-all duration-200 hover:scale-[1.01] hover:border-brand-orange/30 cursor-pointer flex flex-col justify-between h-48"
            >
              <div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {p.status}
                </span>
                <h2 className="text-base font-display font-bold text-text-primary mt-2 hover:text-brand-orange transition-colors">
                  {p.name}
                </h2>
                <p className="text-xs text-text-secondary line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border-base">
                <span className="text-[10px] text-text-secondary font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due {p.deadline}
                </span>
                <span className="text-xs font-semibold text-brand-orange flex items-center gap-1 group">
                  Open Workspace <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-border-base rounded-lg">
          <p className="text-xs text-text-secondary">No projects currently assigned to your supervisor profile.</p>
        </div>
      )}
    </div>
  );
}
