
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Patient } from '../types';

export const usePatients = () => {
    return useQuery<Patient[]>({
        queryKey: ['patients'],
        queryFn: async () => {
            const { data } = await api.get('/api/hospitals/patients');
            return data;
        },
    });
};

export const useCreatePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { fullName: string }) => {
            const { data } = await api.post('/api/hospitals/patients', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });
};

export const useTogglePatient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
            const { data } = await api.patch(`/api/hospitals/patients/${id}/toggle`, { isActive });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
        },
    });
};
