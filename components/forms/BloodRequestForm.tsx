
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { BloodType } from '../../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const bloodRequestSchema = z.object({
  patientId: z.string().min(5, 'Patient ID must be at least 5 characters'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const, {
    message: 'Valid blood group required'
  }),
  units: z.number({ 
    message: 'Units must be a number' 
  }).min(1, 'Minimum 1 unit').max(10, 'Maximum 10 units per emergency request'),
  clinicalNote: z.string().min(10, 'Please provide brief clinical context (min 10 chars)'),
  document: z.any()
    .refine((files) => !files || files.length === 0 || files.length === 1, "Max 1 file permitted")
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "Max size 5MB")
    .refine((files) => !files || files.length === 0 || ACCEPTED_TYPES.includes(files[0].type), "Only PDF, JPG, PNG supported")
    .optional()
});

type BloodRequestFormValues = z.infer<typeof bloodRequestSchema>;

interface Props {
  onSuccess: (data: BloodRequestFormValues) => void;
  onCancel: () => void;
}

const BloodRequestForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting, isValid } 
  } = useForm<BloodRequestFormValues>({
    resolver: zodResolver(bloodRequestSchema),
    mode: 'onChange'
  });

  const fileWatch = watch('document');

  useEffect(() => {
    if (fileWatch && fileWatch[0] && fileWatch[0].type.startsWith('image/')) {
      const url = URL.createObjectURL(fileWatch[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const onSubmit: SubmitHandler<BloodRequestFormValues> = (data) => {
    onSuccess(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="max-h-[90vh] overflow-y-auto space-y-8 bg-white p-10 md:p-12 rounded-[3.5rem] border-4 border-red-50 shadow-2xl relative overflow-hidden custom-scrollbar"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
      
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950 leading-none">Emergency Signal</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">Priority Alpha Allocation</p>
        </div>
        <button type="button" onClick={onCancel} className="text-slate-300 hover:text-red-600 transition-colors focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="space-y-6">
        <FormField label="Patient Identifier (Grid ID)" error={errors.patientId?.message} required>
          <input 
            {...register('patientId')}
            placeholder="P-10293"
            className={`w-full p-5 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all font-black text-slate-900 uppercase placeholder:normal-case ${errors.patientId ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="Biological Group" error={errors.bloodType?.message} required>
            <select 
              {...register('bloodType')}
              className={`w-full p-5 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all font-black text-slate-900 cursor-pointer appearance-none ${errors.bloodType ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <option value="">-- GROUP --</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          
          <FormField label="Units Required" error={errors.units?.message} required>
            <input 
              {...register('units', { valueAsNumber: true })}
              type="number"
              placeholder="0"
              className={`w-full p-5 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all font-black text-slate-900 text-xl tracking-tighter ${errors.units ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
            />
          </FormField>
        </div>

        <FormField label="Clinical Narrative" error={errors.clinicalNote?.message} required>
          <textarea 
            {...register('clinicalNote')}
            rows={2}
            placeholder="Specify reason for request (e.g., Surgery, Trauma)..."
            className={`w-full p-5 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:outline-none transition-all font-bold text-slate-900 resize-none ${errors.clinicalNote ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
          />
        </FormField>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Doctor's Note / Clinical Authentication (Optional)</label>
          <div className={`relative border-4 border-dashed rounded-[2rem] p-8 transition-all flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-white ${fileWatch?.[0] ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-slate-300'}`}>
            <input 
              {...register('document')}
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            {preview ? (
              <div className="relative group/preview">
                <img src={preview} alt="Note Preview" className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white" />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity">
                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" /></svg>
                </div>
              </div>
            ) : (
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${fileWatch?.[0] ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div className="text-center">
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                {fileWatch?.[0] ? fileWatch[0].name : 'Drop Clinical Documentation'}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">PDF, JPEG, or PNG (MAX 5MB)</p>
            </div>
          </div>
          {errors.document && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tight text-center">{errors.document.message as string}</p>}
        </div>
      </div>

      <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
        <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-relaxed text-center">
          Warning: False emergency requests are subject to federal audits. Signal transmission is logged in real-time.
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
          variant="emergency" 
          isLoading={isSubmitting} 
          disabled={!isValid}
          className="flex-[2] rounded-2xl py-5 shadow-2xl shadow-red-200 text-xs tracking-[0.3em]"
        >
          Transmit SOS Signal
        </Button>
      </div>
    </form>
  );
};

export default BloodRequestForm;
