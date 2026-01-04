import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DonorProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { socketIOService } from '../services/socketio';
import api from '../services/api';

export const useDonorProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<DonorProfile>({
    queryKey: ['donor-profile', user?.id],
    queryFn: async () => {
      const { data } = await api.get('/api/donors/profile');
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const handleStatusUpdate = (update: any) => {
      if (update.userId === user.id) {
        queryClient.invalidateQueries({ queryKey: ['donor-profile', user.id] });
      }
    };

    socketIOService.on('DonorStatusChanged', handleStatusUpdate);
    return () => socketIOService.off('DonorStatusChanged', handleStatusUpdate);
  }, [user, queryClient]);

  return query;
};

export const useDonorRequests = () => {
  return useQuery<any[]>({
    queryKey: ['donor-requests'],
    queryFn: async () => {
      const { data } = await api.get('/api/donors/requests');
      return data;
    },
  });
};

export const useAcceptDonation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/api/donors/requests/${id}/accept`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-requests'] });
    }
  });
};

export const useDeclineDonation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/api/donors/requests/${id}/decline`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-requests'] });
    }
  });
};

export const useUpdateDonorProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<DonorProfile>) => {
      const { data } = await api.patch('/api/donors/profile', updates);
      return data;
    },
    onSuccess: (data: DonorProfile) => {
      queryClient.setQueryData(['donor-profile', data.userId], data);
    }
  });
};

