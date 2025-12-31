
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import { UserRole } from '../types';
import { useToast } from '../context/ToastContext';
import DonorRegistrationForm from '../components/forms/DonorRegistrationForm';
import Logo from '../components/ui/Logo';

const registerSchema = z.object({
  role: z.enum([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const, {
    message: "Select a valid organization type"
  }),
  orgName: z.string().min(5, 'Registered Organization Name is required'),
  regNumber: z.string().min(6, 'Government Registration Number is required'),
  contactPerson: z.string().min(3, 'Authorized Contact Person name is required'),
  email: z.string().email('Official Institutional Email is required'),
  location: z.string().min(10, 'Full Facility Address is required'),
  document: z.any().refine((files) => files?.length === 1, "Verification Document upload is mandatory"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'ORG' | 'DONOR'>('ORG');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.HOSPITAL
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast('Registration application transmitted.', 'success');
      setIsSuccess(true);
    } catch (err) {
      showToast('Electronic transmission failed.', 'error');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-900 rounded flex items-center justify-center text-white mb-8 shadow-xl">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="space-y-4 max-w-lg mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Application Submitted</h1>
          <p className="text-slate-500 font-medium text-md leading-relaxed uppercase tracking-tight">
            Your registration is now being reviewed by the Federal Administration. 
            Once verified, an encrypted authorization key will be dispatched to your registered credentials.
          </p>
          <div className="p-4 bg-slate-100 border-l-4 border-slate-900 inline-block text-[10px] font-black uppercase tracking-widest text-slate-600">
            Subject to security audit and verification.
          </div>
        </div>
        <Link to="/login">
          <Button variant="secondary" className="px-10 rounded-none uppercase tracking-[0.2em] text-[10px]">Return to Portal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6 flex flex-col items-center relative overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%"><pattern id="grid-reg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid-reg)" /></svg>
      </div>

      <div className="absolute top-10 left-10 z-10 flex items-center gap-4">
        <button 
          onClick={() => navigate('/')} 
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:text-slate-900 text-slate-400 transition-all shadow-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label="Return to Homepage"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <Logo className="h-7" />
      </div>

      <div className="w-full max-w-3xl space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Network Onboarding</h1>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.4em]">Official Registry Portal v4.2</p>
        </div>

        <div className="flex justify-center">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 shadow-inner backdrop-blur-sm">
            <button 
              onClick={() => setActiveTab('ORG')}
              className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === 'ORG' ? 'bg-white text-slate-950 shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Institutional
            </button>
            <button 
              onClick={() => setActiveTab('DONOR')}
              className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === 'DONOR' ? 'bg-white text-slate-950 shadow-md scale-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Emergency Donor
            </button>
          </div>
        </div>

        {activeTab === 'DONOR' ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <DonorRegistrationForm onSuccess={onSubmit} />
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex justify-center gap-4">
              {([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('role', role)}
                  className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                    selectedRole === role 
                      ? 'bg-slate-950 text-white border-slate-950 shadow-lg' 
                      : 'bg-white text-slate-400 border-transparent hover:border-slate-200'
                  }`}
                >
                  {role.replace('_', ' ')} Signup
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-10 md:p-14 space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                <FormField label="Registered Entity Name" error={errors.orgName?.message} required>
                  <input 
                    {...register('orgName')} 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-900/5 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                    placeholder="e.g. Apollo Healthcare Group" 
                  />
                </FormField>
                <FormField label="Government License Number" error={errors.regNumber?.message} required>
                  <input 
                    {...register('regNumber')} 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-900/5 focus:outline-none transition-all font-mono font-bold text-slate-900 placeholder:text-slate-300" 
                    placeholder="GHL-882-991" 
                  />
                </FormField>
                <FormField label="Authorized Representative" error={errors.contactPerson?.message} required>
                  <input 
                    {...register('contactPerson')} 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-900/5 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                    placeholder="Full Legal Name" 
                  />
                </FormField>
                <FormField label="Official Institutional Email" error={errors.email?.message} required>
                  <input 
                    {...register('email')} 
                    type="email" 
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-900/5 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                    placeholder="admin@organization.gov.in" 
                  />
                </FormField>
              </div>

              <FormField label="Physical Facility Address" error={errors.location?.message} required>
                <textarea 
                  {...register('location')} 
                  rows={2} 
                  className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-950 focus:ring-4 focus:ring-slate-900/5 focus:outline-none transition-all font-bold text-slate-900 resize-none placeholder:text-slate-300" 
                  placeholder="Complete HQ/Facility address" 
                />
              </FormField>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verification Assets (Operational License PDF)</label>
                <div className="relative border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all cursor-pointer group">
                  <input {...register('document')} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-rose-500 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Transmit Encrypted Document</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">MAX SIZE: 10MB (PDF, JPEG, PNG)</p>
                  </div>
                </div>
                {errors.document && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight text-center">{errors.document.message as string}</p>}
              </div>

              <div className="p-8 bg-slate-950 text-white rounded-[2rem] flex items-start gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-110 transition-transform">
                   <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Administrative Protocol</p>
                  <p className="text-[11px] font-medium leading-relaxed uppercase tracking-tight text-slate-300">
                    Registration subject to national admin approval. Internal verification typical cycle is 24-48 business hours. 
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full py-6 rounded-[1.5rem] text-[11px] font-black tracking-[0.4em] uppercase bg-slate-950 text-white shadow-2xl hover:bg-black transition-all active:scale-[0.98]"
              >
                Initialize Node Registration
              </Button>
            </form>
          </div>
        )}

        <footer className="text-center pb-12">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Already authorized? <Link to="/login" className="text-slate-950 font-black hover:underline decoration-2 underline-offset-4 decoration-rose-500">Access Terminal</Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
