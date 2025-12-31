
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DonorProfile, EligibilityStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { signalRService } from '../services/signalR';

export const useDonorProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<DonorProfile>({
    queryKey: ['donor-profile', user?.id],
    queryFn: async () => {
      // Simulation of secure database fetch
      await new Promise(r => setTimeout(r, 600));
      
      const stored = localStorage.getItem(`donor_profile_${user?.id}`);
      if (stored) return JSON.parse(stored);

      // Default mock profile for demo
      const mock: DonorProfile = {
        userId: user?.id || 'D-000',
        fullName: user?.name || 'Authorized Personnel',
        email: user?.email || 'personnel@swanidhi.gov.in',
        phone: '919988776655',
        age: 28,
        bloodType: 'B+',
        eligibility: EligibilityStatus.PENDING_VERIFICATION,
        verificationProgress: 65,
        checkpoints: {
          identity: true,
          medicalHistory: true,
          documents: false
        }
      };
      
      localStorage.setItem(`donor_profile_${user?.id}`, JSON.stringify(mock));
      return mock;
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

    signalRService.on('DonorStatusChanged', handleStatusUpdate);
    return () => signalRService.off('DonorStatusChanged', handleStatusUpdate);
  }, [user, queryClient]);

  return query;
};

export const useUpdateDonorProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<DonorProfile>) => {
      await new Promise(r => setTimeout(r, 1200));
      const current = JSON.parse(localStorage.getItem(`donor_profile_${user?.id}`) || '{}');
      const updated = { ...current, ...updates };
      localStorage.setItem(`donor_profile_${user?.id}`, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-profile', user?.id] });
    }
  });
};
