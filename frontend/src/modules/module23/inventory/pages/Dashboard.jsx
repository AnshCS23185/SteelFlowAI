import { useDashboardSummary } from '../hooks/useInventory';
import { Package, AlertCircle, TrendingUp, Archive, FileText, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { data: summary, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF5A1F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>Failed to load dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="bg-surface-elevated rounded-2xl p-8 text-text-primary shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
            Inventory Overview
          </h1>
          <p className="text-text-secondary text-sm max-w-xl">
            Real-time insights into your material stock, pending requests, and warehouse operations.
          </p>
        </div>
        <button className="relative z-10 bg-brand-orange hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
          View All Stock
          <ArrowRight className="w-4 h-4" />
        </button>
        {/* Subtle background element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-brand-orange/20 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-surface-base border border-border-base rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Total Materials</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">{summary?.totalMaterials || 0}</span>
            <span className="text-xs text-text-muted font-medium">Items</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-base rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Available Stock</h3>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">{summary?.availableStock?.toLocaleString() || 0}</span>
            <span className="text-xs text-text-muted font-medium">Units</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-base rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Low Stock Alerts</h3>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">{summary?.lowStock || 0}</span>
            <span className="text-xs text-text-muted font-medium">Items Critical</span>
          </div>
        </div>

        <div className="bg-surface-base border border-border-base rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Pending Requests</h3>
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-text-primary">{summary?.pendingRequests || 0}</span>
            <span className="text-xs text-text-muted font-medium">Awaiting Approval</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Trends & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-base border border-border-base rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Inventory Trend</h2>
              <button className="text-sm text-brand-orange font-medium hover:underline">View Report</button>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border-base rounded-lg bg-surface-elevated">
              <div className="text-center text-text-muted">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chart data will be populated here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-base border border-border-base rounded-xl shadow-sm p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
            </div>
            {summary?.recentActivity?.length > 0 ? (
              <div className="space-y-6">
                {summary.recentActivity.map((activity, idx) => (
                  <div key={activity.id || idx} className="flex gap-4 relative">
                    {idx !== summary.recentActivity.length - 1 && (
                      <div className="absolute left-2.5 top-8 bottom-0 w-px bg-border-base -z-10"></div>
                    )}
                    <div className="w-5 h-5 rounded-full bg-background border-2 border-border-base shadow-sm flex-shrink-0 mt-1"></div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{activity.type}</p>
                      <p className="text-xs text-text-secondary mt-1">{activity.description}</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                        {new Date(activity.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-text-muted py-8">
                No recent activity found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
