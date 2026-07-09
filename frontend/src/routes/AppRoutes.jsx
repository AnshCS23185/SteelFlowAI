import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProjectWorkspaceLayout from '../layouts/ProjectWorkspaceLayout';

// Shared Components
import LoginPage from '../modules/shared/components/LoginPage';
import OverviewPage from '../modules/shared/components/OverviewPage';
import DocumentsPage from '../modules/shared/components/DocumentsPage';
import InsightsPage from '../modules/shared/components/InsightsPage';
import SettingsPage from '../modules/shared/components/SettingsPage';

// Admin Module Pages
import ProjectHub from '../modules/admin/pages/ProjectHub';

// Supervisor Module Pages
import SupervisorProjectHub from '../modules/supervisor/pages/SupervisorProjectHub';

// Client Module Pages
import ClientPortal from '../modules/client/pages/ClientPortal';

// Module 1 Pages
import ProjectDetails from '../modules/module1/pages/ProjectDetails';

// Module 23 Pages
import PlanningDashboard from '../modules/module23/planning/pages/PlanningDashboard';
import ManufacturingDashboard from '../modules/module23/manufacturing/pages/ManufacturingDashboard';

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
    if (user.role === 'admin') return <Navigate to="/admin/projects" replace />;
    if (user.role === 'supervisor') return <Navigate to="/supervisor/projects" replace />;
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
              user.role === 'admin' ? <Navigate to="/admin/projects" replace /> :
              user.role === 'supervisor' ? <Navigate to="/supervisor/projects" replace /> :
              <Navigate to="/client/project" replace />
            ) : (
              <LoginPage />
            )
          } 
        />
      </Route>

      {/* High-Level RBAC Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="projects" element={<ProjectHub />} />
        <Route path="" element={<Navigate to="projects" replace />} />
      </Route>

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="projects" element={<SupervisorProjectHub />} />
        <Route path="" element={<Navigate to="projects" replace />} />
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
          <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
            <ProjectWorkspaceLayout />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<OverviewPage />} />
        <Route path="module1" element={<ProjectDetails />} />
        <Route path="planning" element={<PlanningDashboard />} />
        <Route path="manufacturing" element={<ManufacturingDashboard />} />
        <Route path="dispatch" element={<DispatchDashboard />} />
        <Route path="transportation" element={<TransportationDashboard />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="" element={<Navigate to="overview" replace />} />
      </Route>

      {/* Wildcard Fallbacks */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? (
            user.role === 'admin' ? <Navigate to="/admin/projects" replace /> :
            user.role === 'supervisor' ? <Navigate to="/supervisor/projects" replace /> :
            <Navigate to="/client/project" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}
