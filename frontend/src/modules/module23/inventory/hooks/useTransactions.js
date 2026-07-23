import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../services/transactions.api';

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: transactionsApi.getTransactions,
  });
};

export const useTransactionsByMaterial = (materialId) => {
  return useQuery({
    queryKey: ['transactions', 'material', materialId],
    queryFn: () => transactionsApi.getTransactionsByMaterial(materialId),
    enabled: !!materialId,
  });
};
