import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventoryModals({
  showAddMaterial, setShowAddMaterial, handleCreateMaterial, newMaterial, setNewMaterial,
  showAddWarehouse, setShowAddWarehouse, handleCreateWarehouse, newWarehouse, setNewWarehouse,
  showReceiveGoods, setShowReceiveGoods, handleReceiveGoods, newGr, setNewGr, materials, warehouses,
  showAdjustStock, setShowAdjustStock, selectedStockItem, setSelectedStockItem, handleAdjustStockSubmit, newStockAdjustment, setNewStockAdjustment,
  showReserveMaterial, setShowReserveMaterial, handleReserveMaterial, newReservation, setNewReservation,
  showRaiseRequest, setShowRaiseRequest, handleRaiseRequest, newRequest, setNewRequest
}) {
  return (
    <>
      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Create New Material</h3>
              <button onClick={() => setShowAddMaterial(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material SKU Code *</label>
                <input type="text" required placeholder="e.g. BEAM-HEB300" value={newMaterial.sku} onChange={e => setNewMaterial({...newMaterial, sku: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material Name *</label>
                <input type="text" required placeholder="e.g. H-Beam HEB 300 S355" value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Category</label>
                <input type="text" placeholder="e.g. Beams, Plates, Fittings" value={newMaterial.category} onChange={e => setNewMaterial({...newMaterial, category: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Unit of Measure</label>
                <input type="text" placeholder="e.g. pcs, meters, kg" value={newMaterial.unit} onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Description</label>
                <textarea placeholder="Technical description..." value={newMaterial.description} onChange={e => setNewMaterial({...newMaterial, description: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs">Create Catalog Item</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showAddWarehouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Create Warehouse</h3>
              <button onClick={() => setShowAddWarehouse(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateWarehouse} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Warehouse Name *</label>
                <input type="text" required placeholder="e.g. Raw Material Yard North" value={newWarehouse.name} onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Location Details</label>
                <input type="text" placeholder="e.g. Lot B, Bay 4" value={newWarehouse.location} onChange={e => setNewWarehouse({...newWarehouse, location: e.target.value})} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs">Register Warehouse</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustStock && selectedStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Manual Stock Adjustment</h3>
              <button onClick={() => { setShowAdjustStock(false); setSelectedStockItem(null); }} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-[#111827] dark:text-white">{selectedStockItem.material?.name}</p>
              <p className="text-[#6B7280]">Warehouse: {selectedStockItem.warehouse?.name}</p>
              <p className="text-[#6B7280]">Current Stock: {selectedStockItem.current_stock}</p>
            </div>
            <form onSubmit={handleAdjustStockSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">New Stock Level *</label>
                <input type="number" required min="0" value={newStockAdjustment.current_stock} onChange={e => setNewStockAdjustment({ current_stock: parseFloat(e.target.value) || 0 })} className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]" />
              </div>
              <button type="submit" className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs">Save Adjustment</button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
