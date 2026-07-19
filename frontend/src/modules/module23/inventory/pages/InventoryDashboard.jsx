import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { inventoryApi } from '../../../../services/inventoryApi';
import { RefreshCw, Plus } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import InventorySummary from '../components/InventorySummary';
import MaterialsTab from '../components/MaterialsTab';
import WarehousesTab from '../components/WarehousesTab';
import StockTable from '../components/StockTable';
import GoodsReceiptsTab from '../components/GoodsReceiptsTab';
import ReservationTable from '../components/ReservationTable';
import MaterialRequestsTab from '../components/MaterialRequestsTab';
import TransactionsTab from '../components/TransactionsTab';
import ProjectInventoryTab from '../components/ProjectInventoryTab';
import InventoryModals from '../components/InventoryModals';

export default function InventoryDashboard({ defaultTab = 'dashboard' }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const [materials, setMaterials] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventoryStock, setInventoryStock] = useState([]);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [showReceiveGoods, setShowReceiveGoods] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showReserveMaterial, setShowReserveMaterial] = useState(false);
  const [showRaiseRequest, setShowRaiseRequest] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  
  const [newMaterial, setNewMaterial] = useState({ sku: '', name: '', category: '', unit: 'pcs', description: '' });
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });
  const [newGr, setNewGr] = useState({ grn_number: '', supplier: '', invoice_number: '', warehouse_id: '', items: [{ material_id: '', quantity: 1, rate: 0 }] });
  const [newStockAdjustment, setNewStockAdjustment] = useState({ current_stock: 0 });
  const [newReservation, setNewReservation] = useState({ material_id: '', warehouse_id: '', reserved_quantity: 1, project_id: '' });
  const [newRequest, setNewRequest] = useState({ material_id: '', warehouse_id: '', required_quantity: 1, project_id: '' });

  useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, wRes, iRes, grRes, resRes, reqRes, txRes] = await Promise.all([
        inventoryApi.getMaterials(), inventoryApi.getWarehouses(), inventoryApi.getInventory(),
        inventoryApi.getGoodsReceipts(), inventoryApi.getReservations(), inventoryApi.getMaterialRequests(),
        inventoryApi.getTransactions(50)
      ]);
      setMaterials(mRes); setWarehouses(wRes); setInventoryStock(iRes);
      setGoodsReceipts(grRes); setReservations(resRes); setRequests(reqRes); setTransactions(txRes);
    } catch (err) {
      console.error("Failed to load inventory data", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateMaterial = async (e) => { e.preventDefault(); try { await inventoryApi.createMaterial(newMaterial); setShowAddMaterial(false); setNewMaterial({ sku: '', name: '', category: '', unit: 'pcs', description: '' }); loadData(); } catch (err) { alert("Failed"); } };
  const handleCreateWarehouse = async (e) => { e.preventDefault(); try { await inventoryApi.createWarehouse(newWarehouse); setShowAddWarehouse(false); setNewWarehouse({ name: '', location: '' }); loadData(); } catch (err) { alert("Failed"); } };
  const handleReceiveGoods = async (e) => { e.preventDefault(); try { await inventoryApi.createGoodsReceipt(newGr); setShowReceiveGoods(false); setNewGr({ grn_number: '', supplier: '', invoice_number: '', warehouse_id: '', items: [{ material_id: '', quantity: 1, rate: 0 }] }); loadData(); } catch (err) { alert("Failed"); } };
  const handleAdjustStockSubmit = async (e) => { e.preventDefault(); if (!selectedStockItem) return; try { await inventoryApi.adjustStock(selectedStockItem.id, newStockAdjustment.current_stock); setShowAdjustStock(false); setSelectedStockItem(null); loadData(); } catch (err) { alert("Failed"); } };
  const handleReserveMaterial = async (e) => { e.preventDefault(); try { await inventoryApi.createReservation(newReservation); setShowReserveMaterial(false); setNewReservation({ material_id: '', warehouse_id: '', reserved_quantity: 1, project_id: '' }); loadData(); } catch (err) { alert("Failed"); } };
  const handleRaiseRequest = async (e) => { e.preventDefault(); try { await inventoryApi.createRequest(newRequest); setShowRaiseRequest(false); setNewRequest({ material_id: '', warehouse_id: '', required_quantity: 1, project_id: '' }); loadData(); } catch (err) { alert("Failed"); } };
  
  const handleReleaseReservation = async (id) => { if (confirm("Release?")) { try { await inventoryApi.releaseReservation(id); loadData(); } catch (err) { alert("Failed"); } } };
  const handleApproveRequest = async (id, reqQty) => { const approvedQty = prompt(`Qty (Max: ${reqQty})`, reqQty); if (approvedQty !== null) { const parsedQty = parseFloat(approvedQty); if (isNaN(parsedQty) || parsedQty <= 0) { alert("Invalid"); return; } try { await inventoryApi.approveRequest(id, parsedQty, user?.email); loadData(); } catch (err) { alert("Failed"); } } };
  const handleRejectRequest = async (id) => { if (confirm("Reject?")) { try { await inventoryApi.rejectRequest(id, user?.email); loadData(); } catch (err) { alert("Failed"); } } };
  const handleDisableMaterial = async (id, currentStatus) => { try { await inventoryApi.updateMaterial(id, { is_active: !currentStatus }); loadData(); } catch (err) { alert("Failed"); } };

  return (
    <div className="space-y-4 font-sans text-sm text-[#111827] dark:text-white pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">Inventory Operations</h1>
          <p className="text-[12px] text-[#6B7280] dark:text-gray-400 mt-0.5">Manage fabrication inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} disabled={loading} className="h-9 px-3 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded text-xs text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer font-medium flex items-center gap-1.5"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          {activeTab === 'materials' && <button onClick={() => setShowAddMaterial(true)} className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded"><Plus className="w-3.5 h-3.5 inline" /> Add Material</button>}
          {activeTab === 'warehouses' && <button onClick={() => setShowAddWarehouse(true)} className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded"><Plus className="w-3.5 h-3.5 inline" /> Add Warehouse</button>}
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <RefreshCw className="w-8 h-8 text-[#FF5A1F] animate-spin" />
          <p className="text-xs text-[#6B7280] mt-2 animate-pulse">Loading ERP records...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <InventorySummary totalMaterials={materials.length} totalAvailableStock={inventoryStock.reduce((acc, curr) => acc + (curr.available_stock || 0), 0)} lowStockItems={inventoryStock.filter(item => (item.current_stock || 0) <= (item.low_stock_threshold || 10))} pendingRequests={requests.filter(r => r.status === 'Pending').length} inventoryStock={inventoryStock} requests={requests} />}
          {activeTab === 'materials' && <MaterialsTab materials={materials} searchTerm={searchTerm} setSearchTerm={setSearchTerm} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} handleDisableMaterial={handleDisableMaterial} />}
          {activeTab === 'warehouses' && <WarehousesTab warehouses={warehouses} inventoryStock={inventoryStock} />}
          {activeTab === 'stock' && <StockTable inventoryStock={inventoryStock} warehouseFilter={warehouseFilter} setWarehouseFilter={setWarehouseFilter} warehouses={warehouses} setSelectedStockItem={setSelectedStockItem} setNewStockAdjustment={setNewStockAdjustment} setShowAdjustStock={setShowAdjustStock} />}
          {activeTab === 'goods-receipts' && <GoodsReceiptsTab goodsReceipts={goodsReceipts} />}
          {activeTab === 'reservations' && <ReservationTable reservations={reservations} user={user} handleReleaseReservation={handleReleaseReservation} />}
          {activeTab === 'requests' && <MaterialRequestsTab requests={requests} user={user} handleApproveRequest={handleApproveRequest} handleRejectRequest={handleRejectRequest} />}
          {activeTab === 'transactions' && <TransactionsTab transactions={transactions} />}
          {activeTab === 'inventory' && <ProjectInventoryTab inventoryStock={inventoryStock} searchTerm={searchTerm} setSearchTerm={setSearchTerm} setNewReservation={setNewReservation} setShowReserveMaterial={setShowReserveMaterial} />}
        </AnimatePresence>
      )}

      <InventoryModals 
        showAddMaterial={showAddMaterial} setShowAddMaterial={setShowAddMaterial} handleCreateMaterial={handleCreateMaterial} newMaterial={newMaterial} setNewMaterial={setNewMaterial}
        showAddWarehouse={showAddWarehouse} setShowAddWarehouse={setShowAddWarehouse} handleCreateWarehouse={handleCreateWarehouse} newWarehouse={newWarehouse} setNewWarehouse={setNewWarehouse}
        showReceiveGoods={showReceiveGoods} setShowReceiveGoods={setShowReceiveGoods} handleReceiveGoods={handleReceiveGoods} newGr={newGr} setNewGr={setNewGr} materials={materials} warehouses={warehouses}
        showAdjustStock={showAdjustStock} setShowAdjustStock={setShowAdjustStock} selectedStockItem={selectedStockItem} setSelectedStockItem={setSelectedStockItem} handleAdjustStockSubmit={handleAdjustStockSubmit} newStockAdjustment={newStockAdjustment} setNewStockAdjustment={setNewStockAdjustment}
        showReserveMaterial={showReserveMaterial} setShowReserveMaterial={setShowReserveMaterial} handleReserveMaterial={handleReserveMaterial} newReservation={newReservation} setNewReservation={setNewReservation}
        showRaiseRequest={showRaiseRequest} setShowRaiseRequest={setShowRaiseRequest} handleRaiseRequest={handleRaiseRequest} newRequest={newRequest} setNewRequest={setNewRequest}
      />
    </div>
  );
}
