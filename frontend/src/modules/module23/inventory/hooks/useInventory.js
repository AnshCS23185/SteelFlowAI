import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../services/inventory.api';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['inventory', 'dashboard'],
    queryFn: inventoryApi.getDashboardSummary,
  });
};

export const useInventoryStock = () => {
  return useQuery({
    queryKey: ['inventory', 'stock'],
    queryFn: inventoryApi.getInventoryStock,
  });
};
