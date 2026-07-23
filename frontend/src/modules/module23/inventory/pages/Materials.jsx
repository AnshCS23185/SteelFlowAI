import { useMaterials } from '../hooks/useMaterials';
import { Package, Search, Plus, Filter, AlertCircle } from 'lucide-react';

export default function Materials() {
  const { data: materials, isLoading, error } = useMaterials();

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
          <p>Failed to load materials. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Material Master</h1>
          <p className="text-sm text-text-secondary mt-1">Manage all your steel fabrication materials.</p>
        </div>
        <button className="bg-brand-orange hover:opacity-90 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-surface-base border border-border-base rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search by SKU or Name..." 
            className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-border-base rounded-lg text-sm text-text-primary focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border-base rounded-lg text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-base border border-border-base rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-elevated border-b border-border-base text-xs uppercase font-bold text-text-muted">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Material Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Unit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {materials?.length > 0 ? (
                materials.map((material) => (
                  <tr key={material.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="px-6 py-4 font-medium text-text-primary">{material.sku}</td>
                    <td className="px-6 py-4 text-text-secondary">{material.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{material.category || '-'}</td>
                    <td className="px-6 py-4 text-text-secondary uppercase">{material.unit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        material.is_active ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-surface-elevated text-text-secondary border border-border-base'
                      }`}>
                        {material.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-brand-orange hover:underline font-medium text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-text-muted">
                    <Package className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p>No materials found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
