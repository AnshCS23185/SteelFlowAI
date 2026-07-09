import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('steelflow-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (role) => {
    let userData = null;
    if (role === 'admin') {
      userData = {
        name: 'Alex Sterling',
        email: 'alex@steelflow.ai',
        role: 'admin',
        title: 'System Administrator',
        avatar: 'AS'
      };
    } else if (role === 'supervisor') {
      userData = {
        name: 'Marcus Vance',
        email: 'marcus@steelflow.ai',
        role: 'supervisor',
        title: 'Steel Shop Supervisor',
        avatar: 'MV'
      };
    } else if (role === 'client') {
      userData = {
        name: 'David Chen',
        email: 'dchen@apexbuilders.com',
        role: 'client',
        title: 'Lead Structural Engineer (Client)',
        avatar: 'DC'
      };
    }

    if (userData) {
      setUser(userData);
      localStorage.setItem('steelflow-user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('steelflow-user');
  };

  const switchRole = (role) => {
    login(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
