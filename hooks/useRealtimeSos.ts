
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { signalRService } from '../services/signalR';
import { SOSRequest, SOSStatus } from '../types';

const REGIONS = ['North', 'South', 'East', 'West', 'Central'] as const;
const URGENCIES = ['Immediate', 'High', 'Standard'] as const;

export const useRealtimeSos = (sosId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery<SOSRequest>({
    queryKey: ['sos-detail', sosId],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 400));
      const stored = localStorage.getItem('ls_sos_mock');
      const requests = stored ? JSON.parse(stored) : [];
      const found = requests.find((r: any) => r.id === sosId);
      
      return found || {
        id: sosId,
        hospitalId: 'H-772',
        hospitalName: 'City Central Hospital',
        patientId: 'P-10293',
        bloodType: 'O-',
        units: 2,
        status: SOSStatus.ACCEPTED,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        urgency: 'High',
        region: 'Central'
      };
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (!sosId) return;

    const handleUpdate = (data: any) => {
      if (data.id === sosId) {
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
      await new Promise(r => setTimeout(r, 500));
      const stored = localStorage.getItem('ls_sos_mock');
      let data: SOSRequest[] = stored ? JSON.parse(stored) : [
        { id: 'SOS-901', hospitalId: 'H-772', hospitalName: 'City Central', patientId: 'P-101', bloodType: 'O-', units: 2, status: SOSStatus.ACCEPTED, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), urgency: 'High', region: 'North' },
        { id: 'SOS-904', hospitalId: 'H-772', hospitalName: 'City Central', patientId: 'P-102', bloodType: 'AB+', units: 1, status: SOSStatus.DISPATCHED, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), urgency: 'Immediate', region: 'West' }
      ];

      // Ensure all items have urgency/region for the demo
      return data.map(item => ({
        ...item,
        urgency: item.urgency || URGENCIES[Math.floor(Math.random() * 3)],
        region: item.region || REGIONS[Math.floor(Math.random() * 5)]
      }));
    },
    refetchInterval: 15000,
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
