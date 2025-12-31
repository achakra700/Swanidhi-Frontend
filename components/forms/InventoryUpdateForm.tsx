
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../ui/FormField';
import Button from '../ui/Button';

const inventorySchema = z.object({
  type: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const, {
    message: "Select a valid blood group"
  }),
  units: z.number({ 
    message: "Unit count required"
  }).min(0, 'Count cannot be negative').max(500, 'Verify large count'),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface Props {
  initialData?: Partial<InventoryFormValues>;
  onSuccess: (data: InventoryFormValues) => void;
  onCancel: () => void;
}

const InventoryUpdateForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const isEditMode = !!initialData?.type;

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting, isValid } 
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialData,
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<InventoryFormValues> = (data) => {
    onSuccess(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8 bg-white p-10 rounded-[3rem] border-4 border-slate-50 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900"></div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">
            {isEditMode ? 'Batch Audit' : 'Initial Registry'}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            Protocol: {isEditMode ? 'INV-MOD-4.2' : 'INV-ADD-4.2'}
          </p>
        </div>
        <button type="button" onClick={onCancel} className="text-slate-300 hover:text-slate-900 transition-colors focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      
      <div className="space-y-6">
        <FormField label="Blood Group Selection" error={errors.type?.message} required>
          <div className="relative">
            <select 
              {...register('type')}
              disabled={isEditMode}
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all font-black text-slate-900 appearance-none ${isEditMode ? 'opacity-60 grayscale cursor-not-allowed border-slate-100' : errors.type ? 'border-red-500' : 'border-slate-100 hover:border-slate-200 cursor-pointer'}`}
            >
              <option value="">-- Select Target Group --</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {!isEditMode && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          {isEditMode && (
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 italic">Registry type is locked for batch audits.</p>
          )}
        </FormField>
        
        <FormField label="Total Units in Reserve" error={errors.units?.message} required>
          <div className="relative">
            <input 
              {...register('units', { valueAsNumber: true })}
              type="number"
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all font-black text-slate-900 text-xl tracking-tighter ${errors.units ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
              placeholder="0"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 uppercase tracking-widest text-[10px]">
              Units (U)
            </div>
          </div>
        </FormField>
      </div>

      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
          Operational Warning: Confirming this registry will synchronize stock levels across the national grid. Discrepancies will be logged in the permanent audit trail.
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 rounded-2xl py-5"
        >
          Abort
        </Button>
        <Button 
          type="submit" 
          variant="secondary" 
          isLoading={isSubmitting} 
          disabled={!isValid}
          className="flex-[2] rounded-2xl py-5 shadow-xl shadow-slate-100"
        >
          {isEditMode ? 'Authorize Update' : 'Initialize Registry'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryUpdateForm;
