import { motion } from 'framer-motion';

export default function StockTable({ 
  inventoryStock, 
  warehouseFilter, 
  setWarehouseFilter, 
  warehouses, 
  setSelectedStockItem, 
  setNewStockAdjustment, 
  setShowAdjustStock 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 p-2.5 rounded-md text-xs">
        <select
          value={warehouseFilter}
          onChange={e => setWarehouseFilter(e.target.value)}
          className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-text-primary"
        >
          <option value="">All Warehouses</option>
          {warehouses.map(w => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Material SKU</th>
              <th className="p-3">Name</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3 text-right">Current Stock</th>
              <th className="p-3 text-right">Reserved</th>
              <th className="p-3 text-right">Available Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryStock
              .filter(item => !warehouseFilter || item.warehouse_id === warehouseFilter)
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
                    <td className="p-3 text-right font-semibold">{item.current_stock}</td>
                    <td className="p-3 text-right text-[#6B7280]">{item.reserved_stock}</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{item.available_stock}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => { setSelectedStockItem(item); setNewStockAdjustment({ current_stock: item.current_stock }); setShowAdjustStock(true); }}
                        className="px-2.5 py-1 text-[10px] font-bold rounded border border-gray-200 hover:border-[#FF5A1F] transition-colors cursor-pointer bg-white text-[#111827]"
                      >
                        Adjust
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
