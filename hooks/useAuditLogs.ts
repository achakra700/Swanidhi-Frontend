
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuditLogEntry, InventoryAction } from '../types';

export const useAuditLogs = () => {
  return useQuery<AuditLogEntry[]>({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('ls_audit_logs');
      return stored ? JSON.parse(stored) : [];
    }
  });
};

export const useAddAuditLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
      const logs: AuditLogEntry[] = JSON.parse(localStorage.getItem('ls_audit_logs') || '[]');
      const newEntry: AuditLogEntry = {
        ...entry,
        id: `LOG-${Math.floor(Math.random() * 100000)}`,
        timestamp: new Date().toISOString(),
      };
      logs.unshift(newEntry);
      // Keep only last 50 logs
      const trimmed = logs.slice(0, 50);
      localStorage.setItem('ls_audit_logs', JSON.stringify(trimmed));
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    }
  });
};
