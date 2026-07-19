import { motion } from 'framer-motion';

export default function GoodsReceiptsTab({ goodsReceipts }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">GRN Code</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Invoice Ref</th>
              <th className="p-3">Destination Warehouse</th>
              <th className="p-3">Received Date</th>
              <th className="p-3 text-right">Total Items Logged</th>
            </tr>
          </thead>
          <tbody>
            {goodsReceipts.map(gr => (
              <tr key={gr.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{gr.grn_number}</td>
                <td className="p-3 font-semibold text-[#111827] dark:text-white">{gr.supplier || 'Vendor'}</td>
                <td className="p-3 text-[#6B7280]">{gr.invoice_number || 'N/A'}</td>
                <td className="p-3 text-[#6B7280]">{gr.warehouse?.name}</td>
                <td className="p-3 text-[#6B7280]">{new Date(gr.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right font-bold text-[#6B7280]">{gr.items?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
