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
  role: z.enum([UserRole.HOSPITAL, UserRole.BLOOD_BANK] as const),
  orgName: z.string().min(5, 'Full Registered Name required'),
  regNumber: z.string().min(5, 'Official License ID required'),
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.HOSPITAL
    },
    mode: 'onChange'
  });

  const selectedRole = watch('role');
  const uploadedFile = watch('document');

  const goToNext = async () => {
    let fieldsToValidate: (keyof RegisterFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ['role'];
    if (currentStep === 2) fieldsToValidate = ['orgName', 'regNumber', 'contactPerson', 'email', 'location'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(prev => (prev + 1) as any);
    }
  };

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
        <div className="w-24 h-24 bg-slate-900 border-4 border-emerald-500/20 text-emerald-500 rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div className="space-y-4 max-w-lg">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Application Filed</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Your node registration is now undergoing national audit. Verification typically completes within 24-48 hours.
          </p>
          <div className="pt-8">
            <Link to="/login">
              <Button className="px-12 py-5 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-widest text-xs">Return to Terminal</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo className="h-8" />
        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Abort & Return</Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24 max-w-2xl mx-auto w-full">
        <div className="w-full space-y-12">

          {/* Custom Stepper UI */}
          <div className="flex items-center justify-between w-full px-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-500 ${currentStep === step ? 'bg-slate-950 text-white shadow-xl scale-110' :
                      currentStep > step ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                    {currentStep > step ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : step}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${currentStep === step ? 'text-slate-900' : 'text-slate-300'}`}>
                    {step === 1 ? 'Node Type' : step === 2 ? 'Credentials' : 'Validation'}
                  </span>
                </div>
                {step < 3 && <div className={`flex-1 h-0.5 mx-4 transition-colors duration-1000 ${currentStep > step ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <header className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Onboarding Context</h2>
                  <p className="text-slate-500 font-medium">Select the institutional category for your node application.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: UserRole.HOSPITAL, title: 'Medical Facility', icon: '🏥', sub: 'Clinical Care & SOS' },
                    { id: UserRole.BLOOD_BANK, title: 'Regional Reserve', icon: '🩸', sub: 'Inventory & Supplies' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setValue('role', role.id as any)}
                      className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left ${selectedRole === role.id ? 'border-slate-950 bg-slate-950 text-white shadow-2xl' : 'border-slate-100 hover:border-slate-300 bg-white'
                        }`}
                    >
                      <span className="text-3xl mb-4 block">{role.icon}</span>
                      <h3 className="text-sm font-black uppercase tracking-tight">{role.title}</h3>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${selectedRole === role.id ? 'text-slate-400' : 'text-slate-400'}`}>{role.sub}</p>
                    </button>
                  ))}
                </div>
                <Button onClick={goToNext} type="button" className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl">Apply as {selectedRole?.replace('_', ' ')}</Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <header className="space-y-3 text-center">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Institutional Record</h2>
                  <p className="text-slate-500 font-medium">Official registration and facility identification.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Registered Entity Name" error={errors.orgName?.message}>
                    <input {...register('orgName')} placeholder="e.g. St. Peters Medical" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900" />
                  </FormField>
                  <FormField label="Official License ID" error={errors.regNumber?.message}>
                    <input {...register('regNumber')} placeholder="ID-8821-99" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-mono font-bold text-slate-900" />
                  </FormField>
                  <FormField label="Lead Representative" error={errors.contactPerson?.message}>
                    <input {...register('contactPerson')} placeholder="Full Legal Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900" />
                  </FormField>
                  <FormField label="Node Identity (Email)" error={errors.email?.message}>
                    <input {...register('email')} type="email" placeholder="admin@facility.org" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900" />
                  </FormField>
                </div>
                <FormField label="Physical HQ Address" error={errors.location?.message}>
                  <textarea {...register('location')} rows={3} placeholder="Complete physical location..." className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900 resize-none" />
                </FormField>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrentStep(1)} type="button" variant="outline" className="flex-1 py-5 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-950">Previous</Button>
                  <Button onClick={goToNext} type="button" className="flex-2 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Verify Details</Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <header className="space-y-3 text-center">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Identity Proofing</h2>
                  <p className="text-slate-500 font-medium text-center">Transmission of clinical and legal licensing assets.</p>
                </header>

                <div className="relative border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center gap-6 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all cursor-pointer group">
                  <input {...register('document')} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-950 transition-colors">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Authorize Attachment</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {uploadedFile?.[0] ? uploadedFile[0].name : 'MAX 10MB (PDF/IMAGE)'}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex gap-5">
                  <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5" /></svg>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Node activation is conditional upon federal verification of licensing assets. Inaccurate filings result in registry blacklist.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setCurrentStep(2)} type="button" variant="outline" className="flex-1 py-5 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-950">Go Back</Button>
                  <Button type="submit" isLoading={isSubmitting} className="flex-2 py-5 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Initialize Registration</Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-300">
        National Blood Management Infrastructure • Security Level IV
      </footer>
    </div>
  );
};

export default Register;
