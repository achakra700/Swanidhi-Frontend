
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { BloodInventory, BloodType } from '../types';

export const useBloodInventory = () => {
  return useQuery<BloodInventory[]>({
    queryKey: ['blood-inventory'],
    queryFn: async () => {
      const { data } = await api.get('/api/inventory/status');
      return data;
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: { type: BloodType; units: number }) => {
      const { data } = await api.put('/api/inventory/sync', update);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-inventory'] });
    },
  });
};
