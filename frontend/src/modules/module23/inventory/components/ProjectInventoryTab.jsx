import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectInventoryTab({ inventoryStock, searchTerm, setSearchTerm, setNewReservation, setShowReserveMaterial }) {
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
      </div>

      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Material Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Warehouse Location</th>
              <th className="p-3 text-right">Available Stock</th>
              <th className="p-3 text-right">Reserved Qty</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryStock
              .filter(item => {
                const m = item.material;
                if (!m) return false;
                return m.sku.toLowerCase().includes(searchTerm.toLowerCase()) || m.name.toLowerCase().includes(searchTerm.toLowerCase());
              })
              .map(item => {
                const isOut = (item.available_stock || 0) <= 0;
                const isLow = !isOut && (item.current_stock || 0) <= (item.low_stock_threshold || 10);
                const statusColor = isOut ? 'bg-red-500/10 text-red-500' : isLow ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500';
                const statusLabel = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Active';

                return (
                  <tr key={item.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                    <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{item.material?.sku}</td>
                    <td className="p-3 font-semibold text-[#111827] dark:text-white">{item.material?.name}</td>
                    <td className="p-3 text-[#6B7280]">{item.warehouse?.name}</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{item.available_stock}</td>
                    <td className="p-3 text-right text-[#6B7280]">{item.reserved_stock}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setNewReservation({
                            material_id: item.material_id,
                            warehouse_id: item.warehouse_id,
                            reserved_quantity: 1,
                            project_id: ''
                          });
                          setShowReserveMaterial(true);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold rounded border border-[#FF5A1F] text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-white transition-all cursor-pointer bg-white"
                      >
                        Reserve
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
