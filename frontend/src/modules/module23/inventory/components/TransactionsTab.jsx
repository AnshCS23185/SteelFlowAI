import { motion } from 'framer-motion';

export default function TransactionsTab({ transactions }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Logged Time</th>
              <th className="p-3">Type</th>
              <th className="p-3">Material</th>
              <th className="p-3">Warehouse Location</th>
              <th className="p-3 text-right">Quantity Delta</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => {
              const isPositive = (tx.quantity || 0) >= 0;
              return (
                <tr key={tx.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                  <td className="p-3 text-[#6B7280] font-mono">{new Date(tx.created_at).toLocaleString()}</td>
                  <td className="p-3 font-semibold">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                      tx.transaction_type === 'Goods Receipt' ? 'bg-emerald-500/10 text-emerald-500' :
                      tx.transaction_type === 'Reservation' ? 'bg-blue-500/10 text-blue-500' :
                      tx.transaction_type === 'Issue' ? 'bg-orange-500/10 text-orange-500' : 'bg-gray-100 text-[#6B7280]'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-[#111827] dark:text-white">{tx.material?.name}</p>
                    <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">{tx.material?.sku}</p>
                  </td>
                  <td className="p-3 text-[#6B7280]">{tx.warehouse?.name}</td>
                  <td className={`p-3 text-right font-bold flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{tx.quantity}
                  </td>
                  <td className="p-3 text-[#6B7280]">{tx.created_by}</td>
                  <td className="p-3 text-[#6B7280] max-w-xs truncate">{tx.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
