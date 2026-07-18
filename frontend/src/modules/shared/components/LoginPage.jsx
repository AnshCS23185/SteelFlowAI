import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Shield, Hammer, UserCheck, Package, Lock, Mail, AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      name: 'Administrator',
      email: 'admin@gmail.com',
      password: '1234',
      title: 'System Administrator',
      avatar: 'AD',
      icon: Shield
    },
    {
      role: 'inventory',
      name: 'Inventory Manager',
      email: 'inventory@gmail.com',
      password: '1234',
      title: 'Inventory Manager',
      avatar: 'IM',
      icon: Package
    },
    {
      role: 'supervisor',
      name: 'Production Supervisor',
      email: 'supervisor@gmail.com',
      password: '1234',
      title: 'Production Supervisor',
      avatar: 'PS',
      icon: Hammer
    },
    {
      role: 'client',
      name: 'Client Portal',
      email: 'client@gmail.com',
      password: '1234',
      title: 'Client Portal',
      avatar: 'CP',
      icon: Building2
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const account = demoAccounts.find(
        (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
      );

      if (account) {
        const userData = {
          name: account.name,
          email: account.email,
          role: account.role,
          title: account.title,
          avatar: account.avatar
        };
        
        login(userData);

        if (account.role === 'admin') {
          navigate('/admin/projects');
        } else if (account.role === 'inventory') {
          navigate('/inventory/dashboard');
        } else if (account.role === 'supervisor') {
          navigate('/supervisor/dashboard');
        } else if (account.role === 'client') {
          navigate('/client/project');
        }
      } else {
        setError('Invalid email or password.');
      }
      setLoading(false);
    }, 500);
  };

  const fillCredentials = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="flex flex-col justify-center font-sans">
      <div className="bg-white p-5 border border-gray-200 rounded shadow-sm max-w-md w-full mx-auto space-y-4">
        
        {/* Title & Slogan */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-[#111111] font-display">
            Welcome Back
          </h2>
          <p className="text-[11px] text-[#6B7280]">
            Sign in to continue to SteelFlow.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded flex items-center gap-2.5 text-xs font-semibold"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#FAFAFA] border border-gray-200 rounded text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#FF5A1F] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#FAFAFA] border border-gray-200 rounded text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#FF5A1F] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-bold text-xs rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative px-2 bg-white text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
            Demo Accounts
          </span>
        </div>

        {/* Demo Accounts List Table */}
        <div className="border border-gray-200 rounded divide-y divide-gray-100 overflow-hidden bg-[#FAFAFA] text-xs">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon;
            return (
              <div key={acc.role} className="p-2 flex items-center justify-between gap-3 hover:bg-white transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 bg-white border border-gray-200 rounded text-[#FF5A1F]">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#111111] text-[11px] truncate">{acc.name}</p>
                    <p className="text-[9px] text-[#6B7280] font-mono truncate">{acc.email} | PW: {acc.password}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fillCredentials(acc)}
                  className="px-2 py-1 border border-gray-200 hover:border-[#FF5A1F] bg-white text-[#111111] hover:text-[#FF5A1F] rounded text-[9px] font-bold transition-all cursor-pointer flex-shrink-0"
                >
                  Use Account
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
