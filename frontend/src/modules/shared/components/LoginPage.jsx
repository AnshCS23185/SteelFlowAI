import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../../../services/api';
import logo from '../../../assets/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fallbackAccounts = [
    { role: 'super_admin', name: 'Administrator', title: 'System Administrator', avatar: 'AD' },
    { role: 'project_manager', name: 'Project Manager', title: 'Project Manager', avatar: 'PM' },
    { role: 'inventory_manager', name: 'Inventory Manager', title: 'Inventory Manager', avatar: 'IM' },
    { role: 'client', name: 'Client Portal', title: 'Client Portal', avatar: 'CP' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(email.trim(), password);
      
      const { access_token, user: apiUser } = response;
      localStorage.setItem('token', access_token);

      const account = fallbackAccounts.find((acc) => acc.role === apiUser.role) || fallbackAccounts[3];
      
      const userData = {
        id: apiUser.id,
        name: account.name,
        email: apiUser.email,
        role: apiUser.role,
        title: account.title,
        avatar: account.avatar
      };
      
      login(userData);

      if (userData.role === 'super_admin') {
        navigate('/admin/projects');
      } else if (userData.role === 'inventory_manager') {
        navigate('/inventory/dashboard');
      } else if (userData.role === 'project_manager') {
        navigate('/supervisor/projects');
      } else {
        navigate('/client/project');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row font-sans m-0 p-0 overflow-hidden">
      
      {/* Left Side */}
      <div className="w-full lg:w-1/2 bg-[#111111] flex flex-col justify-between p-8 lg:p-12 xl:p-16 relative h-full">
        <div className="flex flex-col h-full flex-grow">
          {/* Logo - Wider and more visible */}
          <div className="mb-8 lg:mb-12 w-48 sm:w-56 lg:w-64">
            <img 
              src={logo} 
              alt="SteelFlow AI" 
              className="w-full h-auto object-contain brightness-0 invert" 
            />
          </div>

          <div className="my-auto space-y-4 max-w-2xl">
            <h3 className="text-[#FF5A1F] text-[10px] lg:text-xs font-bold tracking-widest uppercase">
              Steel Fabrication Operating Platform
            </h3>
            <h1 className="text-white text-3xl lg:text-[40px] xl:text-[44px] leading-[1.1] font-bold tracking-tight">
              Manage Every Fabrication Project From Drawing To Dispatch.
            </h1>
            <p className="text-[#A8A8A8] text-xs lg:text-[14px] leading-relaxed max-w-xl">
              Centralize project planning, inventory, production execution, warehouse operations and dispatch management in one integrated platform designed for steel fabrication industries.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] lg:text-[11px] text-[#7B7B7B]">
          <span>Version 1.0</span>
          <span>Developed for Industrial Fabrication Management</span>
        </div>
      </div>

      {/* Right Side - Clean form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-[#F7F7F5] h-full overflow-y-auto lg:overflow-hidden">
        
        <div className="w-full max-w-[420px] bg-white border border-[#ECECEC] rounded-2xl shadow-sm flex flex-col p-8 my-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#171717] tracking-tight mb-1">
              Welcome Back
            </h2>
            <p className="text-sm text-[#707070]">
              Sign in to continue to SteelFlow AI
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col flex-grow">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#707070] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E] group-focus-within:text-[#F64A14] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-[#F7F7F5] border border-[#ECECEC] rounded-lg text-sm text-[#171717] placeholder:text-[#8E8E8E] focus:outline-none focus:border-[#F64A14] focus:ring-1 focus:ring-[#F64A14] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#707070] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E8E] group-focus-within:text-[#F64A14] transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-11 pl-10 pr-10 bg-[#F7F7F5] border border-[#ECECEC] rounded-lg text-sm text-[#171717] placeholder:text-[#8E8E8E] focus:outline-none focus:border-[#F64A14] focus:ring-1 focus:ring-[#F64A14] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E8E] hover:text-[#171717] transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 mb-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#F64A14] hover:bg-[#E04A10] text-white font-semibold text-sm rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Security Footer */}
            <div className="mt-auto pt-4 border-t border-[#ECECEC] flex justify-between items-center text-[10px] text-[#8E8E8E]">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Protected Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted Sessions</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
