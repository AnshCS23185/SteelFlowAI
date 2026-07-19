import { motion } from 'framer-motion';

export default function ReservationTable({ reservations, user, handleReleaseReservation }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
              <th className="p-3">Reservation Code</th>
              <th className="p-3">Material</th>
              <th className="p-3">Warehouse Location</th>
              <th className="p-3 text-right">Qty Reserved</th>
              <th className="p-3">Reserved By</th>
              <th className="p-3">Created Date</th>
              <th className="p-3 text-center">Status</th>
              {user?.role === 'supervisor' && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {reservations.map(res => (
              <tr key={res.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{res.reservation_number}</td>
                <td className="p-3 font-semibold text-[#111827] dark:text-white">{res.material?.name}</td>
                <td className="p-3 text-[#6B7280]">{res.warehouse?.name}</td>
                <td className="p-3 text-right font-bold text-[#FF5A1F]">{res.reserved_quantity}</td>
                <td className="p-3 text-[#6B7280]">{res.reserved_by}</td>
                <td className="p-3 text-[#6B7280]">{new Date(res.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${res.status === 'Reserved' ? 'bg-[#FF5A1F]/10 text-[#FF5A1F]' : 'bg-gray-100 text-[#6B7280]'}`}>
                    {res.status}
                  </span>
                </td>
                {user?.role === 'supervisor' && (
                  <td className="p-3 text-right">
                    {res.status === 'Reserved' ? (
                      <button
                        onClick={() => handleReleaseReservation(res.id)}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold rounded cursor-pointer transition-colors"
                      >
                        Release
                      </button>
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
