import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../services/requests.api';

export const useRequests = () => {
  return useQuery({
    queryKey: ['requests'],
    queryFn: requestsApi.getRequests,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'dashboard'] });
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'dashboard'] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requestsApi.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'dashboard'] });
    },
  });
};
