import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProjectWorkspaceLayout from '../layouts/ProjectWorkspaceLayout';

// Shared Components
import LoginPage from '../modules/shared/components/LoginPage';
import DashboardPage from '../modules/shared/dashboard/DashboardPage';
import DocumentsPage from '../modules/shared/components/DocumentsPage';
import InsightsPage from '../modules/shared/components/InsightsPage';
import SettingsPage from '../modules/shared/components/SettingsPage';

// Admin Module Pages
import ProjectHub from '../modules/admin/pages/ProjectHub';
import UserManagement from '../modules/admin/pages/UserManagement';

// Supervisor Module Pages
import SupervisorProjectHub from '../modules/supervisor/pages/SupervisorProjectHub';

// Client Module Pages
import ClientPortal from '../modules/client/pages/ClientPortal';

// Module 1 Pages
import ProjectDetailsPage from '../modules/module1/projectDetails/pages/ProjectDetailsPage';

// Module 23 Pages
import PlanningDashboard from '../modules/module23/planning/pages/PlanningDashboard';
import ManufacturingDashboard from '../modules/module23/manufacturing/pages/ManufacturingDashboard';
import InventoryDashboard from '../modules/module23/inventory/pages/InventoryDashboard';
import QualityDashboard from '../modules/module23/qualityControl/pages/QualityDashboard';

// Module 45 Pages
import DispatchDashboard from '../modules/module45/dispatch/pages/DispatchDashboard';
import TransportationDashboard from '../modules/module45/transportation/pages/TransportationDashboard';

// Helper component for Route Guarding based on login status & user role
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'super_admin') return <Navigate to="/admin/projects" replace />;
    if (user.role === 'project_manager') return <Navigate to="/supervisor/projects" replace />;
    if (user.role === 'inventory_manager') return <Navigate to="/inventory/dashboard" replace />;
    if (user.role === 'client') return <Navigate to="/client/project" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public / Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              user.role === 'super_admin' ? <Navigate to="/admin/projects" replace /> :
              user.role === 'project_manager' ? <Navigate to="/supervisor/projects" replace /> :
              user.role === 'inventory_manager' ? <Navigate to="/inventory/dashboard" replace /> :
              <Navigate to="/client/project" replace />
            ) : (
              <LoginPage />
            )
          } 
        />
      </Route>

      {/* High-Level RBAC Dashboard Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['super_admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="projects" element={<ProjectHub />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="" element={<Navigate to="projects" replace />} />
      </Route>

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute allowedRoles={['project_manager']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="projects" element={<SupervisorProjectHub />} />
        <Route path="" element={<Navigate to="projects" replace />} />
      </Route>

      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={['inventory_manager']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InventoryDashboard defaultTab="dashboard" />} />
        <Route path="materials" element={<InventoryDashboard defaultTab="materials" />} />
        <Route path="warehouses" element={<InventoryDashboard defaultTab="warehouses" />} />
        <Route path="stock" element={<InventoryDashboard defaultTab="stock" />} />
        <Route path="goods-receipts" element={<InventoryDashboard defaultTab="goods-receipts" />} />
        <Route path="requests" element={<InventoryDashboard defaultTab="requests" />} />
        <Route path="transactions" element={<InventoryDashboard defaultTab="transactions" />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="project" element={<ClientPortal />} />
        <Route path="" element={<Navigate to="project" replace />} />
      </Route>

      {/* Immersive Project Workspace Routes */}
      <Route
        path="/project/:id"
        element={
          <ProtectedRoute allowedRoles={['super_admin', 'project_manager', 'client']}>
            <ProjectWorkspaceLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="project-details" element={<ProjectDetailsPage />} />
        <Route path="planning" element={<PlanningDashboard />} />
        <Route path="manufacturing" element={<ManufacturingDashboard />} />
        <Route path="inventory" element={<InventoryDashboard defaultTab="dashboard" />} />
        <Route path="quality-control" element={<QualityDashboard />} />
        <Route path="dispatch" element={<DispatchDashboard />} />
        <Route path="transportation" element={<TransportationDashboard />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Wildcard Fallbacks */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            user.role === 'super_admin' ? <Navigate to="/admin/projects" replace /> :
            user.role === 'project_manager' ? <Navigate to="/supervisor/projects" replace /> :
            user.role === 'inventory_manager' ? <Navigate to="/inventory/dashboard" replace /> :
            <Navigate to="/client/project" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}
