import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/ui/Logo';
import api from '../../services/api';

const registerSchema = z.object({
  role: z.enum([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const, {
    message: "Institutional category is required"
  }),
  orgName: z.string().min(5, 'Full Registered Name required'),
  regNumber: z.string().min(6, 'Official License ID required'),
  contactPerson: z.string().min(3, 'Authorized Representative name required'),
  email: z.string().email('Official institutional email required'),
  location: z.string().min(10, 'Full Facility Address required'),
  document: z.any()
    .refine((files) => files?.length === 1, "Operational License (PDF/Image) is mandatory")
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, "File size must not exceed 10MB"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isValid } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.HOSPITAL
    },
    mode: 'onChange'
  });

  const selectedRole = watch('role');
  const uploadedFile = watch('document');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'document') {
          formData.append('document', value[0]);
        } else {
          formData.append(key, value as string);
        }
      });

      await api.post('/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Institutional registration packet transmitted for audit.', 'success');
      setIsSuccess(true);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Transmission failure. Check infrastructure connectivity.', 'error');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="space-y-4 max-w-xl mb-12">
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">Application Registered</h1>
          <p className="text-lg font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
            Your registration is now being reviewed by the Federal Administration.
            Once verified, an encrypted authorization key will be dispatched to your registered credentials.
          </p>
          <div className="p-4 bg-slate-100 border-l-4 border-slate-900 inline-block text-[10px] font-black uppercase tracking-widest text-slate-600">
            Subject to security audit and verification.
          </div>
        </div>

        <Link to="/login">
          <Button variant="primary" className="px-12 py-5 rounded-2xl shadow-2xl">Return to Terminal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6 flex flex-col items-center relative overflow-x-hidden">
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%"><pattern id="grid-reg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1" /></pattern><rect width="100%" height="100%" fill="url(#grid-reg)" /></svg>
      </div>

      <nav className="absolute top-0 left-0 w-full p-10 flex justify-between items-center z-20">
        <Link to="/" aria-label="SWANIDHI Home">
          <Logo className="h-7" />
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 hover:border-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-all shadow-sm"
        >
          Access Terminal
        </Link>
      </nav>

      <main className="w-full max-w-4xl mt-12 space-y-12 relative z-10">
        <header className="text-center space-y-3">
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">Institutional Onboarding</h1>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.4em]">Official Registry Portal v4.2</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-16 space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center gap-4">
            {([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue('role', r)}
                className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${selectedRole === r
                  ? 'bg-slate-950 text-white border-slate-950 shadow-lg scale-105'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
              >
                {r.replace('_', ' ')} Registration
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <FormField id="orgName" label="Registered Entity Name" error={errors.orgName?.message as any} required>
              <input {...register('orgName')} placeholder="e.g. Apollo Healthcare Group" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200" />
            </FormField>
            <FormField id="regNumber" label="Government ID / License" error={errors.regNumber?.message as any} required>
              <input {...register('regNumber')} placeholder="GHL-882-991" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-mono font-bold text-slate-900 placeholder:text-slate-200" />
            </FormField>
            <FormField id="contactPerson" label="Authorized Representative" error={errors.contactPerson?.message as any} required>
              <input {...register('contactPerson')} placeholder="Full Legal Name" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200" />
            </FormField>
            <FormField id="email" label="Official Node Email" error={errors.email?.message as any} required>
              <input {...register('email')} type="email" placeholder="admin@organization.gov.in" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200" />
            </FormField>
          </div>

          <FormField id="location" label="Physical Facility Address" error={errors.location?.message as any} required>
            <textarea {...register('location')} rows={2} placeholder="Complete HQ/Facility address" className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold text-slate-900 resize-none placeholder:text-slate-200" />
          </FormField>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Assets (Operational License PDF)</label>
            <div className="relative border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all cursor-pointer group">
              <input {...register('document')} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-rose-500 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Transmit Encrypted Document</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{uploadedFile?.[0] ? uploadedFile[0].name : 'MAX SIZE: 10MB (PDF, JPEG, PNG)'}</p>
              </div>
            </div>
            {errors.document && <p className="text-[10px] font-bold text-rose-600 uppercase tracking-tight text-center">{errors.document.message as string}</p>}
          </div>

          <div className="p-8 bg-slate-950 text-white rounded-[2rem] flex items-start gap-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /></svg>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Administrative Protocol</p>
              <p className="text-[11px] font-medium leading-relaxed uppercase tracking-tight text-slate-300">
                Registration subject to national admin approval. Internal verification typical cycle is 24-48 business hours.
              </p>
            </div>
          </div>

          <Button type="submit" isLoading={isSubmitting} disabled={!isValid} className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-black transition-all duration-500 shadow-2xl">
            Initialize Node Registration
          </Button>
        </form>
      </main>
    </div>
  );
};


export default Register;
