import { motion } from 'framer-motion';

export default function MaterialRequestsTab({ requests, user, handleApproveRequest, handleRejectRequest }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Request Code</th>
              <th className="p-3">Material</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3 text-right">Requested Qty</th>
              <th className="p-3 text-right text-red-500">Shortage Qty</th>
              <th className="p-3">Status</th>
              {user?.role === 'inventory' && <th className="p-3 text-right">Review Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{req.request_number}</td>
                <td className="p-3 font-semibold text-[#111827] dark:text-white">{req.material?.name}</td>
                <td className="p-3 text-[#6B7280]">{req.warehouse?.name}</td>
                <td className="p-3 text-right font-bold">{req.required_quantity}</td>
                <td className="p-3 text-right font-bold text-red-500">{req.shortage_quantity}</td>
                <td className="p-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    req.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                    req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 text-[#6B7280]'
                  }`}>
                    {req.status}
                  </span>
                </td>
                {user?.role === 'inventory' && (
                  <td className="p-3 text-right">
                    {req.status === 'Pending' ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleApproveRequest(req.id, req.required_quantity)}
                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 text-[10px] font-bold rounded cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold rounded cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : '-'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
