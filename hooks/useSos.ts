
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { SOSRequest, SOSStatus } from '../types';

export const useSosRequests = () => {
  return useQuery<SOSRequest[]>({
    queryKey: ['sos-requests'],
    queryFn: async () => {
      // Backend returns { success: true, data: { sosRequests: [], total: 0 } }
      const { data: response } = await api.get('/api/sos/list/all');
      return response.data?.sosRequests || [];
    }
  });
};

export const useSosDetail = (id: string) => {
  return useQuery<SOSRequest>({
    queryKey: ['sos-detail', id],
    queryFn: async () => {
      const { data: response } = await api.get(`/api/sos/${id}`);
      return response.data;
    },
    enabled: !!id
  });
};

export const useCreateSosRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      // Frontend payload might need mapping to backend SOSRequestCreate
      const { data } = await api.post('/api/sos', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos-requests'] });
    }
  });
};

export const useUpdateSosStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: SOSStatus; reason?: string }) => {
      // Backend has specific endpoints for accept/reject
      const endpoint = status === 'ACCEPTED' ? 'accept' : 'reject';
      const { data } = await api.post(`/api/sos/${id}/${endpoint}`, { reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos-requests'] });
      queryClient.invalidateQueries({ queryKey: ['sos-detail'] });
    }
  });
};
