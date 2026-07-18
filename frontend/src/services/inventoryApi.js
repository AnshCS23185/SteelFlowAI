const BASE_URL = 'http://localhost:8000/api';

// Fallback in-memory state in case the backend is offline
const fallbackState = {
  materials: [
    { id: 'm1', sku: 'BEAM-HEB300-S355', name: 'H-Beam HEB 300 S355', category: 'Beams', description: 'Heavy structural H-beams for column support', unit: 'pcs', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'm2', sku: 'PLATE-20MM-S275', name: 'Steel Plate 20mm S275', category: 'Plates', description: 'Thick steel plates for gussets and baseplates', unit: 'pcs', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'm3', sku: 'PIPE-DN150-SCH40', name: 'Pipe DN150 Schedule 40', category: 'Pipes', description: 'Structural circular hollow sections', unit: 'meters', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  warehouses: [
    { id: 'w1', name: 'Main Fabrication Shop', location: 'Bay A', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'w2', name: 'Raw Material Yard', location: 'North Lot', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  stocks: [
    { id: 's1', material_id: 'm1', warehouse_id: 'w1', current_stock: 45, reserved_stock: 15, issued_stock: 5, low_stock_threshold: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 's2', material_id: 'm2', warehouse_id: 'w2', current_stock: 8, reserved_stock: 2, issued_stock: 0, low_stock_threshold: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 's3', material_id: 'm3', warehouse_id: 'w1', current_stock: 120, reserved_stock: 10, issued_stock: 30, low_stock_threshold: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  goodsReceipts: [],
  reservations: [
    { id: 'r1', reservation_number: 'RES-001', project_id: '1', material_id: 'm1', warehouse_id: 'w1', reserved_quantity: 15, status: 'Reserved', reserved_by: 'supervisor@gmail.com', created_at: new Date().toISOString() }
  ],
  materialRequests: [
    { id: 'mr1', request_number: 'REQ-001', project_id: '1', material_id: 'm2', warehouse_id: 'w2', required_quantity: 15, shortage_quantity: 9, approved_quantity: 0, status: 'Pending', created_by: 'supervisor@gmail.com', created_at: new Date().toISOString() }
  ],
  transactions: [
    { id: 't1', transaction_type: 'Reservation', reference_type: 'Material Reservation', reference_id: 'r1', material_id: 'm1', warehouse_id: 'w1', quantity: 15, created_by: 'supervisor@gmail.com', description: 'Reserved 15 units for project 1', created_at: new Date().toISOString() }
  ]
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

// Helper for making API calls and auto-falling back on failure
async function callApi(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options.headers || {})
      }
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[Inventory API] Call to ${url} failed, using local fallback state:`, error.message);
    throw error;
  }
}

export const inventoryApi = {
  // MATERIALS
  async getMaterials() {
    try {
      return await callApi('/materials');
    } catch {
      return fallbackState.materials;
    }
  },
  async createMaterial(data) {
    try {
      const res = await callApi('/materials', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      fallbackState.materials.push(res);
      return res;
    } catch {
      const newMaterial = {
        id: 'm_' + Math.random().toString(36).substr(2, 9),
        sku: data.sku,
        name: data.name,
        category: data.category || '',
        description: data.description || '',
        unit: data.unit || 'pcs',
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      fallbackState.materials.push(newMaterial);
      return newMaterial;
    }
  },
  async updateMaterial(id, data) {
    try {
      const res = await callApi(`/materials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      const idx = fallbackState.materials.findIndex(m => m.id === id);
      if (idx !== -1) fallbackState.materials[idx] = res;
      return res;
    } catch {
      const idx = fallbackState.materials.findIndex(m => m.id === id);
      if (idx !== -1) {
        fallbackState.materials[idx] = {
          ...fallbackState.materials[idx],
          ...data,
          updated_at: new Date().toISOString()
        };
        return fallbackState.materials[idx];
      }
      throw new Error("Material not found");
    }
  },
  async deleteMaterial(id) {
    try {
      await callApi(`/materials/${id}`, { method: 'DELETE' });
      fallbackState.materials = fallbackState.materials.filter(m => m.id !== id);
      return true;
    } catch {
      fallbackState.materials = fallbackState.materials.filter(m => m.id !== id);
      return true;
    }
  },

  // WAREHOUSES
  async getWarehouses() {
    try {
      return await callApi('/warehouses');
    } catch {
      return fallbackState.warehouses;
    }
  },
  async createWarehouse(data) {
    try {
      const res = await callApi('/warehouses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      fallbackState.warehouses.push(res);
      return res;
    } catch {
      const newWh = {
        id: 'w_' + Math.random().toString(36).substr(2, 9),
        name: data.name,
        location: data.location || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      fallbackState.warehouses.push(newWh);
      return newWh;
    }
  },

  // INVENTORY STOCK
  async getInventory() {
    try {
      const rawStocks = await callApi('/inventory');
      // Ensure relations are populated or fallbackState-like
      return rawStocks;
    } catch {
      // Map relations in memory
      return fallbackState.stocks.map(s => ({
        ...s,
        available_stock: s.current_stock - s.reserved_stock - s.issued_stock,
        material: fallbackState.materials.find(m => m.id === s.material_id),
        warehouse: fallbackState.warehouses.find(w => w.id === s.warehouse_id)
      }));
    }
  },
  async updateStock(materialId, warehouseId, currentStock, updatedBy = "System") {
    try {
      return await callApi(`/inventory/update?material_id=${materialId}&warehouse_id=${warehouseId}&current_stock=${currentStock}&updated_by=${encodeURIComponent(updatedBy)}`, {
        method: 'POST'
      });
    } catch {
      let stock = fallbackState.stocks.find(s => s.material_id === materialId && s.warehouse_id === warehouseId);
      const diff = stock ? currentStock - stock.current_stock : currentStock;
      
      if (!stock) {
        stock = {
          id: 's_' + Math.random().toString(36).substr(2, 9),
          material_id: materialId,
          warehouse_id: warehouseId,
          current_stock: currentStock,
          reserved_stock: 0,
          issued_stock: 0,
          low_stock_threshold: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        fallbackState.stocks.push(stock);
      } else {
        stock.current_stock = currentStock;
        stock.updated_at = new Date().toISOString();
      }

      fallbackState.transactions.unshift({
        id: 't_' + Math.random().toString(36).substr(2, 9),
        transaction_type: 'Adjustment',
        reference_type: 'Stock Update',
        reference_id: stock.id,
        material_id: materialId,
        warehouse_id: warehouseId,
        quantity: diff,
        created_by: updatedBy,
        description: `Stock adjustment. Current stock updated to ${currentStock} (Diff: ${diff >= 0 ? '+' : ''}${diff})`,
        created_at: new Date().toISOString()
      });

      return {
        ...stock,
        available_stock: stock.current_stock - stock.reserved_stock - stock.issued_stock,
        material: fallbackState.materials.find(m => m.id === materialId),
        warehouse: fallbackState.warehouses.find(w => w.id === warehouseId)
      };
    }
  },

  // GOODS RECEIPTS
  async getGoodsReceipts() {
    try {
      return await callApi('/goods-receipts');
    } catch {
      return fallbackState.goodsReceipts.map(gr => ({
        ...gr,
        warehouse: fallbackState.warehouses.find(w => w.id === gr.warehouse_id)
      }));
    }
  },
  async createGoodsReceipt(data) {
    try {
      return await callApi('/goods-receipts', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      const grId = 'gr_' + Math.random().toString(36).substr(2, 9);
      const gr = {
        id: grId,
        grn_number: data.grn_number,
        supplier: data.supplier || '',
        invoice_number: data.invoice_number || '',
        warehouse_id: data.warehouse_id,
        received_by: data.received_by || 'System',
        received_date: data.received_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: []
      };

      for (const item of data.items) {
        const itemObj = {
          id: 'gri_' + Math.random().toString(36).substr(2, 9),
          goods_receipt_id: grId,
          material_id: item.material_id,
          quantity: item.quantity,
          rate: item.rate || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          material: fallbackState.materials.find(m => m.id === item.material_id)
        };
        gr.items.push(itemObj);

        // Update Stock
        let stock = fallbackState.stocks.find(s => s.material_id === item.material_id && s.warehouse_id === data.warehouse_id);
        if (!stock) {
          stock = {
            id: 's_' + Math.random().toString(36).substr(2, 9),
            material_id: item.material_id,
            warehouse_id: data.warehouse_id,
            current_stock: item.quantity,
            reserved_stock: 0,
            issued_stock: 0,
            low_stock_threshold: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          fallbackState.stocks.push(stock);
        } else {
          stock.current_stock += item.quantity;
          stock.updated_at = new Date().toISOString();
        }

        // Transaction
        fallbackState.transactions.unshift({
          id: 't_' + Math.random().toString(36).substr(2, 9),
          transaction_type: 'Goods Receipt',
          reference_type: 'Goods Receipt Item',
          reference_id: itemObj.id,
          material_id: item.material_id,
          warehouse_id: data.warehouse_id,
          quantity: item.quantity,
          created_by: data.received_by,
          description: `Received goods via GRN ${gr.grn_number}. Qty: ${item.quantity} @ Rate: ${item.rate}`,
          created_at: new Date().toISOString()
        });
      }

      fallbackState.goodsReceipts.unshift(gr);
      return gr;
    }
  },

  // RESERVATIONS
  async getReservations() {
    try {
      return await callApi('/reservations');
    } catch {
      return fallbackState.reservations.map(r => ({
        ...r,
        material: fallbackState.materials.find(m => m.id === r.material_id),
        warehouse: fallbackState.warehouses.find(w => w.id === r.warehouse_id)
      }));
    }
  },
  async reserveMaterial(data) {
    try {
      return await callApi('/reservations/reserve', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      // Logic inside service replicates here:
      let stock = fallbackState.stocks.find(s => s.material_id === data.material_id && s.warehouse_id === data.warehouse_id);
      const current = stock ? stock.current_stock : 0;
      const reserved = stock ? stock.reserved_stock : 0;
      const issued = stock ? stock.issued_stock : 0;
      const available = current - reserved - issued;

      const needed = data.reserved_quantity;

      if (stock && available >= needed) {
        stock.reserved_stock += needed;
        
        const resId = 'r_' + Math.random().toString(36).substr(2, 9);
        const res = {
          id: resId,
          reservation_number: 'RES-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          project_id: data.project_id || '1',
          material_id: data.material_id,
          warehouse_id: data.warehouse_id,
          reserved_quantity: needed,
          status: 'Reserved',
          reserved_by: data.reserved_by || 'supervisor@gmail.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          material: fallbackState.materials.find(m => m.id === data.material_id),
          warehouse: fallbackState.warehouses.find(w => w.id === data.warehouse_id)
        };

        fallbackState.reservations.unshift(res);

        fallbackState.transactions.unshift({
          id: 't_' + Math.random().toString(36).substr(2, 9),
          transaction_type: 'Reservation',
          reference_type: 'Material Reservation',
          reference_id: resId,
          material_id: data.material_id,
          warehouse_id: data.warehouse_id,
          quantity: needed,
          created_by: data.reserved_by,
          description: `Reserved ${needed} units for project ${data.project_id || 'N/A'}`,
          created_at: new Date().toISOString()
        });

        return {
          success: true,
          reservation: res,
          request: null,
          shortage: 0
        };
      } else {
        const shortage = needed - (available > 0 ? available : 0);
        
        // Create Request
        const reqId = 'mr_' + Math.random().toString(36).substr(2, 9);
        const req = {
          id: reqId,
          request_number: 'REQ-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          project_id: data.project_id || '1',
          material_id: data.material_id,
          warehouse_id: data.warehouse_id,
          required_quantity: needed,
          shortage_quantity: shortage,
          approved_quantity: 0,
          status: 'Pending',
          created_by: data.reserved_by || 'supervisor@gmail.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          material: fallbackState.materials.find(m => m.id === data.material_id),
          warehouse: fallbackState.warehouses.find(w => w.id === data.warehouse_id)
        };

        fallbackState.materialRequests.unshift(req);

        // Reserve available partial if any
        let res = null;
        if (stock && available > 0) {
          stock.reserved_stock += available;
          const resId = 'r_' + Math.random().toString(36).substr(2, 9);
          res = {
            id: resId,
            reservation_number: 'RES-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
            project_id: data.project_id || '1',
            material_id: data.material_id,
            warehouse_id: data.warehouse_id,
            reserved_quantity: available,
            status: 'Reserved',
            reserved_by: data.reserved_by || 'supervisor@gmail.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            material: fallbackState.materials.find(m => m.id === data.material_id),
            warehouse: fallbackState.warehouses.find(w => w.id === data.warehouse_id)
          };
          fallbackState.reservations.unshift(res);

          fallbackState.transactions.unshift({
            id: 't_' + Math.random().toString(36).substr(2, 9),
            transaction_type: 'Reservation',
            reference_type: 'Material Reservation',
            reference_id: resId,
            material_id: data.material_id,
            warehouse_id: data.warehouse_id,
            quantity: available,
            created_by: data.reserved_by,
            description: `Partially reserved ${available} units (Shortage: ${shortage}) for project ${data.project_id || 'N/A'}`,
            created_at: new Date().toISOString()
          });
        }

        return {
          success: false,
          reservation: res,
          request: req,
          shortage: shortage
        };
      }
    }
  },
  async releaseReservation(id) {
    try {
      return await callApi(`/reservations/release/${id}`, { method: 'POST' });
    } catch {
      const res = fallbackState.reservations.find(r => r.id === id);
      if (res && res.status === 'Reserved') {
        res.status = 'Released';
        let stock = fallbackState.stocks.find(s => s.material_id === res.material_id && s.warehouse_id === res.warehouse_id);
        if (stock) {
          stock.reserved_stock = Math.max(0, stock.reserved_stock - res.reserved_quantity);
        }
        
        fallbackState.transactions.unshift({
          id: 't_' + Math.random().toString(36).substr(2, 9),
          transaction_type: 'Adjustment',
          reference_type: 'Material Reservation',
          reference_id: id,
          material_id: res.material_id,
          warehouse_id: res.warehouse_id,
          quantity: -res.reserved_quantity,
          created_by: res.reserved_by,
          description: `Released reservation ${res.reservation_number}. Qty: ${res.reserved_quantity}`,
          created_at: new Date().toISOString()
        });
        return true;
      }
      return false;
    }
  },

  // MATERIAL REQUESTS
  async getMaterialRequests() {
    try {
      return await callApi('/material-requests');
    } catch {
      return fallbackState.materialRequests.map(r => ({
        ...r,
        material: fallbackState.materials.find(m => m.id === r.material_id),
        warehouse: fallbackState.warehouses.find(w => w.id === r.warehouse_id)
      }));
    }
  },
  async raiseRequest(data) {
    try {
      return await callApi('/material-requests', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch {
      let stock = fallbackState.stocks.find(s => s.material_id === data.material_id && s.warehouse_id === data.warehouse_id);
      const available = stock ? stock.current_stock - stock.reserved_stock - stock.issued_stock : 0;
      const shortage = Math.max(0, data.required_quantity - available);

      const req = {
        id: 'mr_' + Math.random().toString(36).substr(2, 9),
        request_number: 'REQ-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        project_id: data.project_id || '1',
        material_id: data.material_id,
        warehouse_id: data.warehouse_id,
        required_quantity: data.required_quantity,
        shortage_quantity: shortage,
        approved_quantity: 0,
        status: 'Pending',
        created_by: data.created_by || 'System',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        material: fallbackState.materials.find(m => m.id === data.material_id),
        warehouse: fallbackState.warehouses.find(w => w.id === data.warehouse_id)
      };

      fallbackState.materialRequests.unshift(req);
      return req;
    }
  },
  async approveRequest(id, approvedQty, reviewedBy = 'admin@gmail.com') {
    try {
      let url = `/material-requests/approve/${id}`;
      const params = [];
      if (approvedQty !== undefined) params.push(`approved_qty=${approvedQty}`);
      if (reviewedBy) params.push(`reviewed_by=${encodeURIComponent(reviewedBy)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      return await callApi(url, { method: 'POST' });
    } catch {
      const req = fallbackState.materialRequests.find(r => r.id === id);
      if (req && req.status === 'Pending') {
        const qty = approvedQty ?? req.required_quantity;
        req.approved_quantity = qty;
        req.reviewed_by = reviewedBy;
        req.status = 'Completed';
        req.updated_at = new Date().toISOString();

        // Add to stock
        let stock = fallbackState.stocks.find(s => s.material_id === req.material_id && s.warehouse_id === req.warehouse_id);
        if (!stock) {
          stock = {
            id: 's_' + Math.random().toString(36).substr(2, 9),
            material_id: req.material_id,
            warehouse_id: req.warehouse_id,
            current_stock: qty,
            reserved_stock: 0,
            issued_stock: 0,
            low_stock_threshold: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          fallbackState.stocks.push(stock);
        } else {
          stock.current_stock += qty;
          stock.updated_at = new Date().toISOString();
        }

        // Transaction
        fallbackState.transactions.unshift({
          id: 't_' + Math.random().toString(36).substr(2, 9),
          transaction_type: 'Goods Receipt',
          reference_type: 'Material Request',
          reference_id: id,
          material_id: req.material_id,
          warehouse_id: req.warehouse_id,
          quantity: qty,
          created_by: reviewedBy,
          description: `Approved Material Request ${req.request_number}. Stock increased by ${qty}.`,
          created_at: new Date().toISOString()
        });
        
        return {
          ...req,
          material: fallbackState.materials.find(m => m.id === req.material_id),
          warehouse: fallbackState.warehouses.find(w => w.id === req.warehouse_id)
        };
      }
      throw new Error("Request not found or not pending");
    }
  },
  async rejectRequest(id, reviewedBy = 'admin@gmail.com') {
    try {
      let url = `/material-requests/reject/${id}`;
      if (reviewedBy) url += `?reviewed_by=${encodeURIComponent(reviewedBy)}`;
      return await callApi(url, { method: 'POST' });
    } catch {
      const req = fallbackState.materialRequests.find(r => r.id === id);
      if (req && req.status === 'Pending') {
        req.status = 'Rejected';
        req.reviewed_by = reviewedBy;
        req.updated_at = new Date().toISOString();
        return {
          ...req,
          material: fallbackState.materials.find(m => m.id === req.material_id),
          warehouse: fallbackState.warehouses.find(w => w.id === req.warehouse_id)
        };
      }
      throw new Error("Request not found or not pending");
    }
  },

  // TRANSACTIONS
  async getTransactions(limit = 100) {
    try {
      return await callApi(`/transactions?limit=${limit}`);
    } catch {
      return fallbackState.transactions.slice(0, limit).map(t => ({
        ...t,
        material: fallbackState.materials.find(m => m.id === t.material_id),
        warehouse: fallbackState.warehouses.find(w => w.id === t.warehouse_id)
      }));
    }
  }
};
