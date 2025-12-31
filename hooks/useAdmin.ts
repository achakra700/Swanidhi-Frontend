import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface AdminStats {
  hospitals: number;
  banks: number;
  donors: number;
  activeSos: number;
}

export interface OrganizationApplication {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'BLOOD_BANK';
  regId: string;
  location: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

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

export const useAdminDonors = () => {
  return useQuery({
    queryKey: ['admin-donors'],
    queryFn: async () => {
      const { data } = await api.get('/api/donors/all');
      return data;
    }
  });
};

export const useUpdateDonorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/api/donors/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donors'] });
    }
  });
};

export const useRegisterDonor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string, bloodType: string }) => {
      const { data } = await api.post('/api/donors/register', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donors'] });
    }
  });
};
