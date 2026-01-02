import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLogEntry } from '../types';
import api from '../services/api';

export const useAuditLogs = () => {
  return useQuery<AuditLogEntry[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data: response } = await api.get('/api/admin/audit-logs');
      // Backend returns { success: true, data: AuditLogEntry[] }
      // Map backend actorId to frontend userId if needed, though they match mostly
      return (response.data || []).map((log: any) => ({
        ...log,
        userId: log.actorId,
        userName: log.actorName || 'System', // Backend might need to provide actorName
        details: typeof log.details === 'string' ? log.details : JSON.stringify(log.details)
      }));
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
