
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../ui/FormField';
import Button from '../ui/Button';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const donorSchema = z.object({
  fullName: z.string().min(3, 'Full legal name required (min 3 chars)'),
  age: z.number({ 
    message: 'Age is required'
  }).min(18, 'Minimum age is 18').max(65, 'Maximum age is 65'),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const, {
    message: 'Selection required',
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Format: +[Country][Number]'),
  verificationDoc: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files.length === 1, "Max 1 file")
    .refine((files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE, "Max size 5MB")
    .refine((files) => !files || files.length === 0 || ACCEPTED_TYPES.includes(files[0].type), "PDF or Images only"),
});

type DonorFormValues = z.infer<typeof donorSchema>;

interface Props {
  onSuccess: (data: DonorFormValues) => void;
  onCancel?: () => void;
}

const DonorRegistrationForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [preview, setPreview] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting, isValid } 
  } = useForm<DonorFormValues>({
    resolver: zodResolver(donorSchema),
    mode: 'onChange'
  });

  const fileWatch = watch('verificationDoc');

  useEffect(() => {
    if (fileWatch && fileWatch[0] && fileWatch[0].type.startsWith('image/')) {
      const url = URL.createObjectURL(fileWatch[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const onSubmit: SubmitHandler<DonorFormValues> = (data) => {
    onSuccess(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-8 bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900"></div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 leading-none">Donor Registration</h3>
        </div>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-slate-300 hover:text-slate-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">
        Citizen Enrollment Protocol v4.2
      </p>

      <div className="space-y-6">
        <FormField label="Full Legal Name" error={errors.fullName?.message} required>
          <input 
            {...register('fullName')} 
            placeholder="e.g. Rahul Sharma"
            className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 ${errors.fullName ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Age (18-65)" error={errors.age?.message} required>
            <input 
              {...register('age', { valueAsNumber: true })} 
              type="number"
              placeholder="YY"
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all font-black text-slate-900 placeholder:text-slate-300 ${errors.age ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
            />
          </FormField>
          <FormField label="Blood Group" error={errors.bloodType?.message} required>
            <select 
              {...register('bloodType')}
              className={`w-full p-4 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition font-black text-slate-900 ${errors.bloodType ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <option value="">--</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="Primary Contact Number" error={errors.phone?.message} required>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-mono text-xs font-bold">
              +
            </div>
            <input 
              {...register('phone')} 
              placeholder="91 9988776655"
              className={`w-full p-4 pl-10 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all font-mono font-bold text-slate-900 placeholder:text-slate-300 ${errors.phone ? 'border-red-500' : 'border-slate-100 hover:border-slate-200'}`}
            />
          </div>
        </FormField>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eligibility Doc (Optional)</label>
            <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">Medical Report / ID</span>
          </div>
          <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-4 ${
            fileWatch?.[0] ? 'border-green-400 bg-green-50' : errors.verificationDoc ? 'border-red-400 bg-red-50' : 'border-slate-100 hover:border-slate-300 bg-slate-50'
          }`}>
            <input 
              {...register('verificationDoc')}
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {preview ? (
              <img src={preview} alt="Document Preview" className="w-20 h-20 object-cover rounded-xl shadow-lg border-2 border-white" />
            ) : (
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">
                {fileWatch?.[0] ? fileWatch[0].name : 'Click to upload verification'}
              </p>
              <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">PDF, JPG, PNG • Max 5MB</p>
            </div>
          </div>
          {errors.verificationDoc && (
            <p className="text-[10px] font-bold text-red-500 uppercase mt-1">{(errors.verificationDoc as any).message}</p>
          )}
        </div>
      </div>

      <div className="pt-6">
        <Button 
          type="submit" 
          variant="secondary" 
          isLoading={isSubmitting} 
          disabled={!isValid} 
          className="w-full py-5 rounded-2xl shadow-xl shadow-slate-100 uppercase tracking-[0.3em] text-xs"
        >
          Initialize Donor ID
        </Button>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center mt-6 leading-relaxed">
          By proceeding, you consent to receive critical emergency blood broadcasts via the national grid.
        </p>
      </div>
    </form>
  );
};

export default DonorRegistrationForm;
