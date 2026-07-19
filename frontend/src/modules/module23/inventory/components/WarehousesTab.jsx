import { motion } from 'framer-motion';

export default function WarehousesTab({ warehouses, inventoryStock }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Warehouse Name</th>
              <th className="p-3">Location Details</th>
              <th className="p-3 text-right">Associated Stock Records</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map(w => {
              const stockCount = inventoryStock.filter(item => item.warehouse_id === w.id).length;
              return (
                <tr key={w.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                  <td className="p-3 font-semibold text-[#111827] dark:text-white">{w.name}</td>
                  <td className="p-3 text-[#6B7280]">{w.location || 'Central Facility'}</td>
                  <td className="p-3 text-right text-[#6B7280] font-mono">{stockCount} items</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
