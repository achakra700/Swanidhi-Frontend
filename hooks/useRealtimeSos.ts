
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { signalRService } from '../services/signalR';
import { SOSRequest } from '../types';
import api from '../services/api';

export const useRealtimeSos = (sosId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<SOSRequest>({
    queryKey: ['sos-detail', sosId],
    queryFn: async () => {
      const { data } = await api.get(`/signals/${sosId}`);
      return data;
    },
    enabled: !!sosId,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (!sosId) return;

    const handleUpdate = (data: any) => {
      if (data.id === sosId || data.sosId === sosId) {
        queryClient.invalidateQueries({ queryKey: ['sos-detail', sosId] });
      }
    };

    signalRService.joinSosGroup(sosId);
    signalRService.on('SOSUpdated', handleUpdate);

    return () => {
      signalRService.off('SOSUpdated', handleUpdate);
      signalRService.leaveSosGroup(sosId);
    };
  }, [sosId, queryClient]);

  return query;
};

export const useRealtimeSosList = () => {
  const queryClient = useQueryClient();

  const query = useQuery<SOSRequest[]>({
    queryKey: ['sos-requests'],
    queryFn: async () => {
      const { data } = await api.get('/signals/active');
      return data;
    },
    refetchInterval: 60000,
  });

  useEffect(() => {
    const handleGlobalUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['sos-requests'] });
    };

    signalRService.on('GlobalSOSUpdate', handleGlobalUpdate);
    return () => signalRService.off('GlobalSOSUpdate', handleGlobalUpdate);
  }, [queryClient]);

  return query;
};
