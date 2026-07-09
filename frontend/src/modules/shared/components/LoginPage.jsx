import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Shield, Hammer, UserCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);

  const handleRoleSelect = (role) => {
    setLoadingRole(role);
    setTimeout(() => {
      login(role);
      if (role === 'admin') {
        navigate('/admin/projects');
      } else if (role === 'supervisor') {
        navigate('/supervisor/projects');
      } else if (role === 'client') {
        navigate('/client/project');
      }
    }, 600);
  };

  const roles = [
    {
      id: 'admin',
      title: 'Administrator',
      desc: 'Project Hub, scheduling, reports, user invites and system overview.',
      icon: Shield,
      color: 'hover:border-brand-orange/40'
    },
    {
      id: 'supervisor',
      title: 'Project Supervisor',
      desc: 'Weld tracking, inventory logs, daily progress and shop issues.',
      icon: Hammer,
      color: 'hover:border-brand-yellow/40'
    },
    {
      id: 'client',
      title: 'Client Portal',
      desc: 'Milestones, dispatch shipping status, shared QA docs and photo feed.',
      icon: UserCheck,
      color: 'hover:border-blue-500/40'
    }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Small Screen Header */}
      <div className="lg:hidden flex flex-col items-center mb-10 text-center">
        <div className="w-12 h-12 rounded bg-[#F64A14] flex items-center justify-center font-display font-bold text-white text-xl mb-4">
          SF
        </div>
        <h1 className="text-2xl font-display font-bold text-text-primary">
          SteelFlow AI
        </h1>
        <p className="text-xs text-text-secondary uppercase tracking-wider">
          Enterprise SaaS Portal
        </p>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-text-primary">
          Sign In
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary">
          Select your credentials role profile to access SteelFlow AI modules.
        </p>
      </div>

      {/* Role Options */}
      <div className="space-y-4">
        {roles.map((r, i) => {
          const Icon = r.icon;
          const isCurrentLoading = loadingRole === r.id;

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
            >
              <button
                onClick={() => handleRoleSelect(r.id)}
                disabled={loadingRole !== null}
                className={`w-full text-left p-5 border border-border-base bg-surface-base rounded-lg transition-all duration-180 cursor-pointer ${
                  r.color
                } hover:scale-[1.01] flex items-center gap-4 ${
                  loadingRole !== null && !isCurrentLoading ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className={`p-3 rounded-md bg-surface-elevated ${
                  isCurrentLoading ? 'animate-pulse text-brand-orange' : 'text-text-primary'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {r.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {r.desc}
                  </p>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="text-[11px] text-text-muted text-center lg:text-left">
        By continuing, you agree to the SteelFlow AI Terms of Service and Privacy Guidelines.
      </div>
    </div>
  );
}
