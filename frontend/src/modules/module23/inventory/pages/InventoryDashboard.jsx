import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { inventoryApi } from '../../../../services/inventoryApi';
import { 
  Package, Layers, ClipboardList, Activity, Plus, Home, FileText, 
  Search, Check, X, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, UserCheck, Eye, Calendar, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InventoryDashboard({ defaultTab = 'dashboard' }) {
  const { user } = useAuth();
  
  // Tab Selection
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Data State
  const [materials, setMaterials] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventoryStock, setInventoryStock] = useState([]);
  const [goodsReceipts, setGoodsReceipts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Loading and UI States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // Modals & Action States
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [showReceiveGoods, setShowReceiveGoods] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showReserveMaterial, setShowReserveMaterial] = useState(false);
  const [showRaiseRequest, setShowRaiseRequest] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  
  // Form States
  const [newMaterial, setNewMaterial] = useState({ sku: '', name: '', category: '', unit: 'pcs', description: '' });
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '' });
  const [newGr, setNewGr] = useState({ grn_number: '', supplier: '', invoice_number: '', warehouse_id: '', items: [{ material_id: '', quantity: 1, rate: 0 }] });
  const [newStockAdjustment, setNewStockAdjustment] = useState({ current_stock: 0 });
  const [newReservation, setNewReservation] = useState({ material_id: '', warehouse_id: '', reserved_quantity: 1, project_id: '' });
  const [newRequest, setNewRequest] = useState({ material_id: '', warehouse_id: '', required_quantity: 1, project_id: '' });

  // Sync activeTab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, wRes, iRes, grRes, resRes, reqRes, txRes] = await Promise.all([
        inventoryApi.getMaterials(),
        inventoryApi.getWarehouses(),
        inventoryApi.getInventory(),
        inventoryApi.getGoodsReceipts(),
        inventoryApi.getReservations(),
        inventoryApi.getMaterialRequests(),
        inventoryApi.getTransactions(50)
      ]);
      setMaterials(mRes);
      setWarehouses(wRes);
      setInventoryStock(iRes);
      setGoodsReceipts(grRes);
      setReservations(resRes);
      setRequests(reqRes);
      setTransactions(txRes);
    } catch (err) {
      console.error("Failed to load inventory data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Form Handlers
  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createMaterial(newMaterial);
      setShowAddMaterial(false);
      setNewMaterial({ sku: '', name: '', category: '', unit: 'pcs', description: '' });
      loadData();
    } catch (err) {
      alert("Failed to create material catalog item");
    }
  };

  const handleCreateWarehouse = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createWarehouse(newWarehouse);
      setShowAddWarehouse(false);
      setNewWarehouse({ name: '', location: '' });
      loadData();
    } catch (err) {
      alert("Failed to register warehouse location");
    }
  };

  const handleReceiveGoods = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createGoodsReceipt(newGr);
      setShowReceiveGoods(false);
      setNewGr({ grn_number: '', supplier: '', invoice_number: '', warehouse_id: '', items: [{ material_id: '', quantity: 1, rate: 0 }] });
      loadData();
    } catch (err) {
      alert("Failed to log Goods Receipt Note (GRN): " + err.message);
    }
  };

  const handleAdjustStockSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStockItem) return;
    try {
      await inventoryApi.adjustStock(selectedStockItem.id, newStockAdjustment.current_stock);
      setShowAdjustStock(false);
      setSelectedStockItem(null);
      loadData();
    } catch (err) {
      alert("Failed to update stock quantity manually");
    }
  };

  const handleReserveMaterial = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createReservation(newReservation);
      setShowReserveMaterial(false);
      setNewReservation({ material_id: '', warehouse_id: '', reserved_quantity: 1, project_id: '' });
      loadData();
    } catch (err) {
      alert("Failed to reserve material: " + err.message);
    }
  };

  const handleRaiseRequest = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.createRequest(newRequest);
      setShowRaiseRequest(false);
      setNewRequest({ material_id: '', warehouse_id: '', required_quantity: 1, project_id: '' });
      loadData();
    } catch (err) {
      alert("Failed to raise procurement request");
    }
  };

  const handleReleaseReservation = async (id) => {
    if (confirm("Are you sure you want to release this material reservation?")) {
      try {
        await inventoryApi.releaseReservation(id);
        loadData();
      } catch (err) {
        alert("Failed to release reservation");
      }
    }
  };

  const handleApproveRequest = async (id, reqQty) => {
    const approvedQty = prompt(`Enter quantity to approve (Max: ${reqQty})`, reqQty);
    if (approvedQty !== null) {
      const parsedQty = parseFloat(approvedQty);
      if (isNaN(parsedQty) || parsedQty <= 0) {
        alert("Invalid quantity");
        return;
      }
      try {
        await inventoryApi.approveRequest(id, parsedQty, user?.email);
        loadData();
      } catch (err) {
        alert("Failed to approve request: " + err.message);
      }
    }
  };

  const handleRejectRequest = async (id) => {
    if (confirm("Are you sure you want to reject this request?")) {
      try {
        await inventoryApi.rejectRequest(id, user?.email);
        loadData();
      } catch (err) {
        alert("Failed to reject request");
      }
    }
  };

  const handleDisableMaterial = async (id, currentStatus) => {
    try {
      await inventoryApi.updateMaterial(id, { is_active: !currentStatus });
      loadData();
    } catch (err) {
      alert("Failed to update material status");
    }
  };

  // KPI calculations
  const totalMaterials = materials.length;
  const totalAvailableStock = inventoryStock.reduce((acc, curr) => acc + (curr.available_stock || 0), 0);
  const lowStockItems = inventoryStock.filter(item => (item.current_stock || 0) <= (item.low_stock_threshold || 10));
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const todayGoodsReceipts = goodsReceipts.filter(gr => new Date(gr.created_at).toDateString() === new Date().toDateString()).length;
  const recentTxsCount = transactions.length;

  // Header Title Maps
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Inventory Operations';
      case 'materials': return 'Materials';
      case 'warehouses': return 'Warehouses';
      case 'stock': return 'Inventory Levels';
      case 'goods-receipts': return 'Goods Receipts';
      case 'requests': return 'Material Requests';
      case 'transactions': return 'Transactions Log';
      case 'reservations': return 'Material Reservations';
      case 'inventory': return 'Project Inventory';
      default: return 'Inventory Management';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'dashboard': return 'Monitor real-time warehouse stocks and operational metrics.';
      case 'materials': return 'Manage fabrication materials, stock units and inventory information.';
      case 'warehouses': return 'Manage storage facilities and production warehouses.';
      case 'stock': return 'Monitor raw materials quantity, reserve pools, and shortages.';
      case 'goods-receipts': return 'Review logged Goods Receipt Notes (GRNs) and items.';
      case 'requests': return 'Manage supervisor requests and material shortages.';
      case 'transactions': return 'Audit trail of all inventory movement events.';
      case 'reservations': return 'Manage active supervisor material reserves and checkouts.';
      case 'inventory': return 'Real-time raw stock lookup and reservation checkout.';
      default: return 'Manage fabrication inventory.';
    }
  };

  return (
    <div className="space-y-4 font-sans text-sm text-[#111827] dark:text-white pb-12">
      
      {/* ERP Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">
            {getTabTitle()}
          </h1>
          <p className="text-[12px] text-[#6B7280] dark:text-gray-400 mt-0.5">
            {getTabDescription()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="h-9 px-3 border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-gray-800 rounded text-xs text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer font-medium flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {activeTab === 'materials' && (
            <button
              onClick={() => setShowAddMaterial(true)}
              className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Material
            </button>
          )}
          {activeTab === 'warehouses' && (
            <button
              onClick={() => setShowAddWarehouse(true)}
              className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Warehouse
            </button>
          )}
          {activeTab === 'goods-receipts' && (
            <button
              onClick={() => setShowReceiveGoods(true)}
              className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Goods Receipt
            </button>
          )}
          {activeTab === 'reservations' && user?.role === 'supervisor' && (
            <button
              onClick={() => setShowReserveMaterial(true)}
              className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Reservation
            </button>
          )}
          {activeTab === 'requests' && user?.role === 'supervisor' && (
            <button
              onClick={() => setShowRaiseRequest(true)}
              className="h-9 px-3 bg-[#FF5A1F] hover:bg-[#e04a10] text-white text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Request
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <RefreshCw className="w-8 h-8 text-[#FF5A1F] animate-spin" />
          <p className="text-xs text-[#6B7280] dark:text-gray-400 mt-2 animate-pulse">Loading ERP records...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
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
          )}

          {/* MATERIALS TAB */}
          {activeTab === 'materials' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Toolbar */}
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
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-text-primary"
                >
                  <option value="">All Categories</option>
                  {Array.from(new Set(materials.map(m => m.category).filter(Boolean))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-text-primary"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Table */}
              <div className="border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#191919] rounded-md overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-800 text-[#6B7280] font-bold sticky top-0">
                      <th className="p-3">SKU / Code</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials
                      .filter(m => {
                        const matchesSearch = m.sku.toLowerCase().includes(searchTerm.toLowerCase()) || m.name.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesCat = !categoryFilter || m.category === categoryFilter;
                        const matchesStatus = !statusFilter || (statusFilter === 'active' ? m.is_active : !m.is_active);
                        return matchesSearch && matchesCat && matchesStatus;
                      })
                      .map(m => (
                        <tr key={m.id} className="border-b border-[#E5E7EB]/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 h-12">
                          <td className="p-3 font-mono font-bold text-[#111827] dark:text-white">{m.sku}</td>
                          <td className="p-3 font-semibold text-[#111827] dark:text-white">{m.name}</td>
                          <td className="p-3 text-[#6B7280]">{m.category || 'N/A'}</td>
                          <td className="p-3 text-[#6B7280] truncate max-w-xs">{m.description || 'No description'}</td>
                          <td className="p-3 text-[#6B7280]">{m.unit}</td>
                          <td className="p-3 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${m.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                              {m.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDisableMaterial(m.id, m.is_active)}
                              className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer border transition-colors ${
                                m.is_active 
                                  ? 'border-red-200 text-red-500 hover:bg-red-50' 
                                  : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50'
                              }`}
                            >
                              {m.is_active ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* WAREHOUSES TAB */}
          {activeTab === 'warehouses' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
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
          )}

          {/* INVENTORY LEVELS TAB */}
          {activeTab === 'stock' && (
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
          )}

          {/* GOODS RECEIPTS TAB */}
          {activeTab === 'goods-receipts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
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
          )}

          {/* MATERIAL RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
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
          )}

          {/* MATERIAL REQUESTS TAB */}
          {activeTab === 'requests' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
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
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
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
          )}

          {/* PROJECT INVENTORY TAB (SUPERVISOR HUB ONLY) */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
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
          )}

        </AnimatePresence>
      )}

      {/* ========================================================= */}
      {/* MODALS / FORMS */}
      {/* ========================================================= */}

      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Create New Material</h3>
              <button onClick={() => setShowAddMaterial(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material SKU Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BEAM-HEB300"
                  value={newMaterial.sku}
                  onChange={e => setNewMaterial({...newMaterial, sku: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. H-Beam HEB 300 S355"
                  value={newMaterial.name}
                  onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Beams, Plates, Fittings"
                  value={newMaterial.category}
                  onChange={e => setNewMaterial({...newMaterial, category: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Unit of Measure</label>
                <input
                  type="text"
                  placeholder="e.g. pcs, meters, kg"
                  value={newMaterial.unit}
                  onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Description</label>
                <textarea
                  placeholder="Technical description of the steel item..."
                  value={newMaterial.description}
                  onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Create Catalog Item
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {showAddWarehouse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Create Warehouse</h3>
              <button onClick={() => setShowAddWarehouse(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCreateWarehouse} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Raw Material Yard North"
                  value={newWarehouse.name}
                  onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Location Details</label>
                <input
                  type="text"
                  placeholder="e.g. Lot B, Bay 4"
                  value={newWarehouse.location}
                  onChange={e => setNewWarehouse({...newWarehouse, location: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Register Warehouse
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Receive Goods Modal */}
      {showReceiveGoods && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-lg w-full space-y-4 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Receive Goods (GRN Logging)</h3>
              <button onClick={() => setShowReceiveGoods(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleReceiveGoods} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">GRN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="GRN-2026-0001"
                    value={newGr.grn_number}
                    onChange={e => setNewGr({...newGr, grn_number: e.target.value})}
                    className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Warehouse *</label>
                  <select
                    required
                    value={newGr.warehouse_id}
                    onChange={e => setNewGr({...newGr, warehouse_id: e.target.value})}
                    className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Steel Ltd"
                    value={newGr.supplier}
                    onChange={e => setNewGr({...newGr, supplier: e.target.value})}
                    className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B7280] font-semibold mb-1">Invoice Number</label>
                  <input
                    type="text"
                    placeholder="INV-99888"
                    value={newGr.invoice_number}
                    onChange={e => setNewGr({...newGr, invoice_number: e.target.value})}
                    className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="border-t border-[#E5E7EB] dark:border-gray-800 pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#111827] dark:text-white">Receipt Items</h4>
                  <button
                    type="button"
                    onClick={() => setNewGr({
                      ...newGr,
                      items: [...newGr.items, { material_id: '', quantity: 1, rate: 0 }]
                    })}
                    className="px-2 py-1 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 text-[#111827] dark:text-white hover:text-[#FF5A1F] rounded text-[10px] font-bold cursor-pointer"
                  >
                    + Add Item
                  </button>
                </div>

                {newGr.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select
                      required
                      value={item.material_id}
                      onChange={e => {
                        const updatedItems = [...newGr.items];
                        updatedItems[idx].material_id = e.target.value;
                        setNewGr({...newGr, items: updatedItems});
                      }}
                      className="flex-1 p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                    >
                      <option value="">Select Material</option>
                      {materials.filter(m => m.is_active).map(m => (
                        <option key={m.id} value={m.id}>{m.sku} - {m.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={e => {
                        const updatedItems = [...newGr.items];
                        updatedItems[idx].quantity = parseFloat(e.target.value) || 0;
                        setNewGr({...newGr, items: updatedItems});
                      }}
                      className="w-20 p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={e => {
                        const updatedItems = [...newGr.items];
                        updatedItems[idx].rate = parseFloat(e.target.value) || 0;
                        setNewGr({...newGr, items: updatedItems});
                      }}
                      className="w-20 p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                    />
                    {newGr.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setNewGr({
                          ...newGr,
                          items: newGr.items.filter((_, i) => i !== idx)
                        })}
                        className="text-red-500 p-1 hover:bg-red-500/10 rounded cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Log Goods Receipt (Increase Stock)
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustStock && selectedStockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-sm w-full space-y-4 shadow-xl"
          >
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
                <input
                  type="number"
                  required
                  min="0"
                  value={newStockAdjustment.current_stock}
                  onChange={e => setNewStockAdjustment({ current_stock: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Save Adjustment
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reserve Material Modal */}
      {showReserveMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Reserve Fabrication Materials</h3>
              <button onClick={() => setShowReserveMaterial(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleReserveMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material *</label>
                <select
                  required
                  value={newReservation.material_id}
                  onChange={e => setNewReservation({...newReservation, material_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Select Material</option>
                  {materials.filter(m => m.is_active).map(m => (
                    <option key={m.id} value={m.id}>{m.sku} - {m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Warehouse *</label>
                <select
                  required
                  value={newReservation.warehouse_id}
                  onChange={e => setNewReservation({...newReservation, warehouse_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Quantity to Reserve *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newReservation.reserved_quantity}
                  onChange={e => setNewReservation({...newReservation, reserved_quantity: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Project ID / Job Code</label>
                <input
                  type="text"
                  placeholder="e.g. 1"
                  value={newReservation.project_id}
                  onChange={e => setNewReservation({...newReservation, project_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Check Availability & Reserve
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Raise Request Modal */}
      {showRaiseRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-white dark:bg-[#191919] border border-[#E5E7EB] dark:border-gray-800 rounded max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex justify-between items-center border-b border-[#E5E7EB] dark:border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Raise Procurement Material Request</h3>
              <button onClick={() => setShowRaiseRequest(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleRaiseRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Material *</label>
                <select
                  required
                  value={newRequest.material_id}
                  onChange={e => setNewRequest({...newRequest, material_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Select Material</option>
                  {materials.filter(m => m.is_active).map(m => (
                    <option key={m.id} value={m.id}>{m.sku} - {m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Warehouse Location *</label>
                <select
                  required
                  value={newRequest.warehouse_id}
                  onChange={e => setNewRequest({...newRequest, warehouse_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Required Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newRequest.required_quantity}
                  onChange={e => setNewRequest({...newRequest, required_quantity: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <div>
                <label className="block text-[#6B7280] font-semibold mb-1">Project ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1"
                  value={newRequest.project_id}
                  onChange={e => setNewRequest({...newRequest, project_id: e.target.value})}
                  className="w-full p-2 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700 rounded text-[#111827] dark:text-white focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF5A1F] hover:bg-[#e04a10] text-white font-semibold rounded cursor-pointer transition-all text-xs"
              >
                Submit Request
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
