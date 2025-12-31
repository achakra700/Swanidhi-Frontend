import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLogEntry } from '../types';
import api from '../services/api';

export const useAuditLogs = () => {
  return useQuery<AuditLogEntry[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data } = await api.get('/api/audit/logs');
      return data;
    }
  });
};

export const useAddAuditLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
      const { data } = await api.post('/api/audit/logs', entry);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    }
  });
};
