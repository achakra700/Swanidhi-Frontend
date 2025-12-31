
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/ui/Logo';
import DonorRegistrationForm from '../../components/forms/DonorRegistrationForm';

const registerSchema = z.object({
  role: z.enum([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const, {
    message: "Institutional category is required"
  }),
  orgName: z.string().min(5, 'Full Registered Name required'),
  regNumber: z.string().min(6, 'Official License ID required'),
  email: z.string().email('Official institutional email required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'International format: +[Code][Number]'),
  state: z.string().min(2, 'State required'),
  district: z.string().min(2, 'District required'),
  document: z.any().refine((files) => files?.length === 1, "Operational License (PDF/Image) is mandatory"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'ORG' | 'DONOR'>('ORG');

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isValid } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.HOSPITAL
    },
    mode: 'onChange'
  });

  const selectedRole = watch('role');
  const uploadedFile = watch('document');

  const onSubmit = async (data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      showToast('Registration application submitted to Global Registry.', 'success');
      setIsSuccess(true);
    } catch (err) {
      showToast('Electronic transmission failure. Check connectivity.', 'error');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="space-y-4 max-w-xl mb-12">
          <h1 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-none">Registry Initialized</h1>
          <p className="text-lg font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
            Application received. Access will be granted once the <span className="text-slate-950 font-black">National Audit</span> of your credentials is complete.
          </p>
        </div>

        <Link to="/login">
          <Button variant="primary" className="px-12 py-5 rounded-2xl shadow-2xl">Return to Terminal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6 flex flex-col items-center relative overflow-x-hidden">
      <nav className="absolute top-0 left-0 w-full p-10 flex justify-between items-center z-20">
        <Link to="/" aria-label="SWANIDHI Home">
          <Logo className="h-7" />
        </Link>
        <Link 
          to="/login" 
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 hover:border-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 transition-all shadow-sm"
        >
          Login Instead
        </Link>
      </nav>

      <main className="w-full max-w-4xl mt-12 space-y-12 relative z-10">
        <header className="text-center space-y-3">
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter uppercase leading-none">Network Onboarding</h1>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-[0.2em]">Join the Unified National Emergency Grid</p>
        </header>

        <div className="flex justify-center">
          <div role="radiogroup" aria-label="Onboarding Type" className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner">
            <button 
              onClick={() => setActiveTab('ORG')}
              className={`px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'ORG' ? 'bg-white text-slate-950 shadow-md scale-100' : 'text-slate-500 hover:text-slate-600'
              }`}
            >
              Institutional
            </button>
            <button 
              onClick={() => setActiveTab('DONOR')}
              className={`px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'DONOR' ? 'bg-white text-slate-950 shadow-md scale-100' : 'text-slate-500 hover:text-slate-600'
              }`}
            >
              Emergency Donor
            </button>
          </div>
        </div>

        {activeTab === 'DONOR' ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto w-full">
            <DonorRegistrationForm onSuccess={onSubmit} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-16 space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center gap-4 mb-4">
              {([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setValue('role', r)}
                  className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    selectedRole === r 
                      ? 'bg-slate-950 text-white border-slate-950' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {r.replace('_', ' ')} Signup
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Fix: Cast FieldError message to any to ensure compatibility with FormField's string error prop */}
              <FormField id="orgName" label="Full Legal Entity Name" error={errors.orgName?.message as any} required>
                <input {...register('orgName')} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold" />
              </FormField>
              {/* Fix: Cast FieldError message to any to ensure compatibility with FormField's string error prop */}
              <FormField id="regNumber" label="Government ID" error={errors.regNumber?.message as any} required>
                <input {...register('regNumber')} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-mono font-bold" />
              </FormField>
              {/* Fix: Cast FieldError message to any to ensure compatibility with FormField's string error prop */}
              <FormField id="email" label="Official Node Email" error={errors.email?.message as any} required>
                <input {...register('email')} type="email" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-bold" />
              </FormField>
              {/* Fix: Cast FieldError message to any to ensure compatibility with FormField's string error prop */}
              <FormField id="phone" label="Direct Hotline" error={errors.phone?.message as any} required>
                <input {...register('phone')} className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 focus:outline-none transition-all font-mono font-bold" />
              </FormField>
            </div>

            {/* Fix: Cast FieldError message to any to ensure compatibility with FormField's string error prop */}
            <FormField id="document" label="Operational License Assets (PDF)" error={errors.document?.message as any} required>
              <div className="relative border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50 hover:bg-white transition-all cursor-pointer group">
                <input {...register('document')} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <svg className="w-10 h-10 text-slate-300 group-hover:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" /></svg>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{uploadedFile?.[0] ? uploadedFile[0].name : 'Click to Transmit Doc'}</p>
              </div>
            </FormField>

            <Button type="submit" disabled={isSubmitting || !isValid} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black uppercase tracking-[0.4em]">
              Submit Official Application
            </Button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Register;
