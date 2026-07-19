import { Package, Layers, ClipboardList, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventorySummary({ 
  totalMaterials, 
  totalAvailableStock, 
  lowStockItems, 
  pendingRequests, 
  inventoryStock, 
  requests 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Flat KPI Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 p-4 rounded-md">
        <div className="flex items-center justify-between px-4 py-2 border-r border-[#E5E7EB] dark:border-gray-800 last:border-0">
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Materials</p>
            <p className="text-xl font-bold text-[#111827] dark:text-white mt-1">{totalMaterials}</p>
          </div>
          <Package className="w-5 h-5 text-[#FF5A1F] opacity-80" />
        </div>
        
        <div className="flex items-center justify-between px-4 py-2 border-r border-[#E5E7EB] dark:border-gray-800 last:border-0">
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Available Stock</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalAvailableStock.toLocaleString()} kg</p>
          </div>
          <Layers className="w-5 h-5 text-emerald-500 opacity-80" />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-r border-[#E5E7EB] dark:border-gray-800 last:border-0">
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Low Stock</p>
            <p className="text-xl font-bold text-amber-500 mt-1">{lowStockItems.length}</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-500 opacity-80" />
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-r border-[#E5E7EB] dark:border-gray-800 last:border-0">
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Pending Requests</p>
            <p className={`text-xl font-bold mt-1 ${pendingRequests > 0 ? 'text-red-500' : 'text-[#111827] dark:text-white'}`}>{pendingRequests}</p>
          </div>
          <ClipboardList className="w-5 h-5 text-[#FF5A1F] opacity-80" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stock table widget */}
        <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] p-4 rounded-md space-y-3">
          <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E7EB] dark:border-gray-800 pb-2">
            <Activity className="w-3.5 h-3.5 text-[#FF5A1F]" /> Inventory Levels (Recent)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-gray-800 text-[#6B7280]">
                  <th className="py-2.5 font-bold">Material</th>
                  <th className="py-2.5 font-bold">Warehouse</th>
                  <th className="py-2.5 text-right font-bold">Available</th>
                  <th className="py-2.5 text-right font-bold">Reserved</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStock.slice(0, 5).map(item => {
                  const isLow = (item.current_stock || 0) <= (item.low_stock_threshold || 10);
                  return (
                    <tr key={item.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="py-2">
                        <p className="font-bold text-[#111827] dark:text-white">{item.material?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">{item.material?.sku}</p>
                      </td>
                      <td className="py-2 text-[#6B7280]">{item.warehouse?.name || 'N/A'}</td>
                      <td className={`py-2 text-right font-bold ${isLow ? 'text-amber-500' : 'text-emerald-500'}`}>{item.available_stock}</td>
                      <td className="py-2 text-right text-[#6B7280]">{item.reserved_stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Request list widget */}
        <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] p-4 rounded-md space-y-3">
          <h3 className="text-xs font-bold text-[#111827] dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E5E7EB] dark:border-gray-800 pb-2">
            <ClipboardList className="w-3.5 h-3.5 text-[#FF5A1F]" /> Pending Requests
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-gray-800 text-[#6B7280]">
                  <th className="py-2.5 font-bold">Request Number</th>
                  <th className="py-2.5 font-bold">Material</th>
                  <th className="py-2.5 text-right font-bold">Req. Qty</th>
                  <th className="py-2.5 text-right font-bold text-red-500">Shortage</th>
                </tr>
              </thead>
              <tbody>
                {requests.filter(r => r.status === 'Pending').slice(0, 5).map(req => (
                  <tr key={req.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="py-2 font-mono font-bold text-[#111827] dark:text-white">{req.request_number}</td>
                    <td className="py-2">
                      <p className="font-bold text-[#111827] dark:text-white">{req.material?.name}</p>
                      <p className="text-[10px] text-[#6B7280]">{req.warehouse?.name}</p>
                    </td>
                    <td className="py-2 text-right font-semibold">{req.required_quantity}</td>
                    <td className="py-2 text-right text-red-500 font-bold">{req.shortage_quantity}</td>
                  </tr>
                ))}
                {requests.filter(r => r.status === 'Pending').length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-[#6B7280]">No pending material requests.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
