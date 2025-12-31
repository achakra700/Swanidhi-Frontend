
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { SOSRequest, SOSStatus } from '../types';

export const useSosRequests = () => {
  return useQuery<SOSRequest[]>({
    queryKey: ['sos-requests'],
    queryFn: async () => {
      const { data } = await api.get('/signals/active');
      return data;
    }
  });
};

export const useSosDetail = (id: string) => {
  return useQuery<SOSRequest>({
    queryKey: ['sos-detail', id],
    queryFn: async () => {
      const { data } = await api.get(`/signals/${id}`);
      return data;
    },
    enabled: !!id
  });
};

export const useCreateSosRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (key === 'document') {
          formData.append('clinicalNote', payload[key][0]);
        } else {
          formData.append(key, payload[key]);
        }
      });
      const { data } = await api.post('/signals/initiate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
      const { data } = await api.patch(`/signals/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sos-requests'] });
      queryClient.invalidateQueries({ queryKey: ['sos-detail'] });
    }
  });
};
