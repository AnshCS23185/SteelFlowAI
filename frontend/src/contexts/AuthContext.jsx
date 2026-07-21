import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const ACCESS_LEVEL = {
  FULL: 'full',
  READ: 'read',
  ASSIGNED: 'assigned',
  NONE: 'none'
};

export const APP_MODULE = {
  MODULE1_PROJECTS: 'module1_projects',
  MODULE2_INVENTORY: 'module2_inventory',
  MODULE3_MANUFACTURING: 'module3_manufacturing',
  MODULE4_DISPATCH: 'module4_dispatch',
  MODULE5_TRANSPORTATION: 'module5_transportation'
};

export const ROLE_PERMISSIONS = {
  "super_admin": {
    [APP_MODULE.MODULE1_PROJECTS]: ACCESS_LEVEL.FULL,
    [APP_MODULE.MODULE2_INVENTORY]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE3_MANUFACTURING]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE4_DISPATCH]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE5_TRANSPORTATION]: ACCESS_LEVEL.READ,
  },
  "project_manager": {
    [APP_MODULE.MODULE1_PROJECTS]: ACCESS_LEVEL.ASSIGNED,
    [APP_MODULE.MODULE2_INVENTORY]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE3_MANUFACTURING]: ACCESS_LEVEL.FULL,
    [APP_MODULE.MODULE4_DISPATCH]: ACCESS_LEVEL.FULL,
    [APP_MODULE.MODULE5_TRANSPORTATION]: ACCESS_LEVEL.FULL,
  },
  "inventory_manager": {
    [APP_MODULE.MODULE1_PROJECTS]: ACCESS_LEVEL.NONE,
    [APP_MODULE.MODULE2_INVENTORY]: ACCESS_LEVEL.FULL,
    [APP_MODULE.MODULE3_MANUFACTURING]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE4_DISPATCH]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE5_TRANSPORTATION]: ACCESS_LEVEL.READ,
  },
  "client": {
    [APP_MODULE.MODULE1_PROJECTS]: ACCESS_LEVEL.ASSIGNED,
    [APP_MODULE.MODULE2_INVENTORY]: ACCESS_LEVEL.NONE,
    [APP_MODULE.MODULE3_MANUFACTURING]: ACCESS_LEVEL.READ, 
    [APP_MODULE.MODULE4_DISPATCH]: ACCESS_LEVEL.READ,
    [APP_MODULE.MODULE5_TRANSPORTATION]: ACCESS_LEVEL.READ,
  }
};

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
        title: role === 'super_admin' ? 'System Administrator' :
               role === 'project_manager' ? 'Project Manager' :
               role === 'inventory_manager' ? 'Inventory Manager' : 'Client Portal',
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

  const hasPermission = (module, requiredLevel) => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role];
    if (!userPermissions) return false;
    
    const actualLevel = userPermissions[module] || ACCESS_LEVEL.NONE;
    
    if (requiredLevel === ACCESS_LEVEL.NONE) return true;
    if (actualLevel === ACCESS_LEVEL.FULL) return true;
    if (requiredLevel === ACCESS_LEVEL.READ && (actualLevel === ACCESS_LEVEL.READ || actualLevel === ACCESS_LEVEL.ASSIGNED)) return true;
    if (requiredLevel === ACCESS_LEVEL.ASSIGNED && actualLevel === ACCESS_LEVEL.ASSIGNED) return true;
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login: loginUser, logout, hasPermission, isAuthenticated: !!user }}>
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
