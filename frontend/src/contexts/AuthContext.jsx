import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('steelflow-user');
    if (saved) return JSON.parse(saved);
    
    // Fallback/check individual sessionStorage items
    const role = sessionStorage.getItem('role');
    const email = sessionStorage.getItem('email');
    const name = sessionStorage.getItem('name');
    if (role && email && name) {
      return {
        role,
        email,
        name,
        title: role === 'admin' ? 'System Administrator' :
               role === 'inventory' ? 'Inventory Manager' :
               role === 'supervisor' ? 'Production Supervisor' : 'Client Portal',
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };
    }
    return null;
  });

  const loginUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem('steelflow-user', JSON.stringify(userData));
    sessionStorage.setItem('role', userData.role);
    sessionStorage.setItem('email', userData.email);
    sessionStorage.setItem('name', userData.name);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('steelflow-user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('name');
  };

  const switchRole = (role) => {
    let userData = null;
    if (role === 'admin') {
      userData = {
        name: 'Administrator',
        email: 'admin@gmail.com',
        role: 'admin',
        title: 'System Administrator',
        avatar: 'AD'
      };
    } else if (role === 'inventory') {
      userData = {
        name: 'Inventory Manager',
        email: 'inventory@gmail.com',
        role: 'inventory',
        title: 'Inventory Manager',
        avatar: 'IM'
      };
    } else if (role === 'supervisor') {
      userData = {
        name: 'Production Supervisor',
        email: 'supervisor@gmail.com',
        role: 'supervisor',
        title: 'Production Supervisor',
        avatar: 'PS'
      };
    } else if (role === 'client') {
      userData = {
        name: 'Client Portal',
        email: 'client@gmail.com',
        role: 'client',
        title: 'Client Portal',
        avatar: 'CP'
      };
    }
    if (userData) {
      loginUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, logout, switchRole, isAuthenticated: !!user }}>
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

