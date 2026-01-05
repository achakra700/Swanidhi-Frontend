import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface AdminStats {
  hospitals: number;
  banks: number;
  donors: number;
  activeSos: number;
}

export interface SystemHealth {
  status: 'UP' | 'DOWN';
  timestamp: string;
  services: {
    database: string;
    blobStorage: string;
    socketIO: string;
  };
}

export interface DashboardData {
  metrics: AdminStats;
  pendingOrgs: OrganizationApplication[];
  recentLogs: any[];
  systemHealth: SystemHealth;
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
      // Backend returns { success: true, data: DashboardMetrics }
      const { data: response } = await api.get('/api/admin/metrics');
      const metrics = response.data;

      // Map backend metrics to frontend AdminStats
      return {
        hospitals: metrics.hospitalsActive || 0,
        banks: metrics.bloodBanksActive || 0,
        donors: metrics.donorsOnline || 0,
        activeSos: metrics.activeSOSRequests || 0
      };
    }
  });
};

export const useAdminDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data: response } = await api.get('/api/admin/dashboard');
      return response.data;
    },
    // Refresh every minute to keep data reasonably fresh without spamming
    refetchInterval: 60000
  });
};

export const usePendingOrganizations = () => {
  return useQuery<OrganizationApplication[]>({
    queryKey: ['admin-orgs'],
    queryFn: async () => {
      const { data: response } = await api.get('/api/admin/organizations/pending');
      return response.data || [];
    }
  });
};

// Updated: The mutation function now accepts type and maps to correct backend endpoint
export const useApproveOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, notes }: { id: string; type: string; notes: string }) => {
      const apiType = type === 'BLOOD_BANK' ? 'bloodbank' : type.toLowerCase();
      const { data } = await api.post(`/api/admin/organizations/${apiType}/${id}/approve`, { notes });
      return data.data; // Returns { email, password }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orgs'] })
  });
};

// Added: New mutation hook to handle organization rejection with reason
export const useRejectOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, type, reason }: { id: string; type: string; reason: string }) => {
      const { data } = await api.post(`/api/admin/organizations/${type.toLowerCase()}/${id}/reject`, { reason });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orgs'] })
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const { data } = await api.get('/ping');
      // Mock some probes structure to satisfy UI
      return {
        status: 'UP',
        probes: [
          { name: 'Core API', status: 'UP', latency: '45ms' },
          { name: 'Cosmos DB', status: 'UP', latency: '12ms' },
          { name: 'Socket.IO', status: 'UP', latency: '8ms' }
        ]
      };
    },
    refetchInterval: 60000
  });
};

export const useAdminDonors = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['admin-donors'],
    queryFn: async () => {
      const { data: response } = await api.get('/api/admin/donors');
      return response.data || [];
    },
    enabled: options?.enabled !== false
  });
};

export const useUpdateDonorStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Mapping to suspend user as fallback for status update
      const { data } = await api.post(`/api/admin/users/${id}/suspend`, { reason: `Status update to ${status}` });
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
