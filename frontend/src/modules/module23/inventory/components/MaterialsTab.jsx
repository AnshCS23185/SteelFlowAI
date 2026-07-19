import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MaterialsTab({ 
  materials, 
  searchTerm, 
  setSearchTerm, 
  categoryFilter, 
  setCategoryFilter, 
  statusFilter, 
  setStatusFilter, 
  handleDisableMaterial 
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 p-2.5 rounded-md text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search material SKU or name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F8F9FB] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded outline-none focus:border-[#FF5A1F]"
          />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-text-primary">
          <option value="">All Categories</option>
          {Array.from(new Set(materials.map(m => m.category).filter(Boolean))).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-text-primary">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>

      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">SKU / Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Description</th>
              <th className="p-3">Unit</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials
              .filter(m => {
                const matchesSearch = m.sku.toLowerCase().includes(searchTerm.toLowerCase()) || m.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCat = !categoryFilter || m.category === categoryFilter;
                const matchesStatus = !statusFilter || (statusFilter === 'active' ? m.is_active : !m.is_active);
                return matchesSearch && matchesCat && matchesStatus;
              })
              .map(m => (
                <tr key={m.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                  <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{m.sku}</td>
                  <td className="p-3 font-semibold text-[#111827] dark:text-white">{m.name}</td>
                  <td className="p-3 text-[#6B7280]">{m.category || 'N/A'}</td>
                  <td className="p-3 text-[#6B7280] truncate max-w-xs">{m.description || 'No description'}</td>
                  <td className="p-3 text-[#6B7280]">{m.unit}</td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${m.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                      {m.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDisableMaterial(m.id, m.is_active)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer border transition-colors ${
                        m.is_active 
                          ? 'border-red-200 text-red-500 hover:bg-red-50' 
                          : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50'
                      }`}
                    >
                      {m.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
