
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { AdminStats, OrganizationApplication } from './useAdminInterfaces';

export const useAdminStats = () => {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/registry/stats');
      return data;
    }
  });
};

export const usePendingOrganizations = () => {
  return useQuery<OrganizationApplication[]>({
    queryKey: ['admin-orgs'],
    queryFn: async () => {
      const { data } = await api.get('/registry/pending');
      return data;
    }
  });
};

// Updated: The mutation function now accepts adminId and adminName to satisfy TypeScript checks in AdminDashboard
export const useApproveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, adminId, adminName }: { id: string; adminId: string; adminName: string }) => {
      const { data } = await api.post(`/registry/approve/${id}`, { adminId, adminName });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orgs'] })
  });
};

// Added: New mutation hook to handle organization rejection with reason and administrative audit metadata
export const useRejectOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason, note, adminId, adminName }: { id: string; reason: string; note: string; adminId: string; adminName: string }) => {
      const { data } = await api.post(`/registry/reject/${id}`, { reason, note, adminId, adminName });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orgs'] })
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const { data } = await api.get('/health/probes');
      return data;
    },
    refetchInterval: 60000
  });
};
