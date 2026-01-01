
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import api from '../../services/api';
import Logo from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';

const loginSchema = z.object({
  email: z.string().email('Official institutional email required'),
  password: z.string().min(6, 'Security token required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROLES = [
  { id: UserRole.HOSPITAL, title: 'Hospital', sub: 'Clinical Care Node', icon: '🏥', color: 'bg-blue-50 text-blue-600' },
  { id: UserRole.BLOOD_BANK, title: 'Blood Bank', sub: 'Regional Inventory', icon: '🩸', color: 'bg-rose-50 text-rose-600' },
  { id: UserRole.ADMIN, title: 'Governance', sub: 'System Controller', icon: '🛡️', color: 'bg-slate-50 text-slate-900' },
  { id: UserRole.DONOR, title: 'Donor', sub: 'Volunteer Portal', icon: '🧑', color: 'bg-emerald-50 text-emerald-600' },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (data: LoginFormValues) => {
    if (!selectedRole) return;
    setIsAuthorizing(true);
    setError(null);
    try {
      // Prompt requirement: Include expectedRole in payload
      const response = await api.post('/api/auth/login', {
        ...data,
        expectedRole: selectedRole
      });

      const { token, user } = response.data.data || response.data;

      // Role mismatch protection (as requested)
      if (user.role !== selectedRole) {
        throw new Error(`This account is not registered as a ${selectedRole}`);
      }

      login(token, user);

      const routes: Record<string, string> = {
        [UserRole.ADMIN]: '/admin',
        [UserRole.HOSPITAL]: '/hospital',
        [UserRole.BLOOD_BANK]: '/bloodbank',
        [UserRole.DONOR]: '/donor',
        [UserRole.PATIENT]: '/patient',
      };

      navigate(routes[user.role] || '/');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Identity verification failed');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf2f0] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Banking-style side graphic */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-slate-900 hidden lg:flex flex-col items-center justify-center p-12 space-y-8">
        <div className="w-24 h-24 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Verified Logistics</h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            A secure national coordination layer for institutional blood reserve management.
          </p>
        </div>
        <div className="pt-12 flex gap-4">
          {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>)}
        </div>
      </div>

      <main className="w-full max-w-[900px] lg:ml-[33%] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(30,30,60,0.12)] border border-slate-100 flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-700">

        {/* Left Side: Branding/Visual */}
        <div className="hidden md:flex md:w-[40%] bg-slate-50 border-r border-slate-100 p-12 flex-col justify-between">
          <Logo className="h-8" />
          <div className="space-y-6">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 inline-block">
              <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">Institutional<br />Auth Terminal</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Session v2.4</p>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            © SWANIDHI 2026<br />NATIONAL HEALTH INFRASTRUCTURE
          </p>
        </div>

        {/* Right Side: Logic */}
        <div className="flex-1 p-10 md:p-14 space-y-10">
          {step === 1 ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Identity Check</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Select your authorization context</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id as UserRole);
                      setStep(2);
                    }}
                    className="group flex items-start gap-4 p-5 bg-slate-50 border-2 border-transparent rounded-3xl hover:bg-white hover:border-slate-900 hover:shadow-xl transition-all duration-300 text-left"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${role.color}`}>
                      {role.icon}
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1.5 group-hover:text-rose-600 transition-colors">{role.title}</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{role.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                  aria-label="Back to role selection"
                >
                  <svg className="w-5 h-5 focus:outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" /></svg>
                </button>
                <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-950 rounded-2xl animate-in zoom-in-90">
                  <span className="text-lg">{ROLES.find(r => r.id === selectedRole)?.icon}</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{selectedRole} HUB</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Authorization</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verify credentials for secure access</p>
                {error && <p className="text-[10px] font-black text-rose-600 uppercase bg-rose-50 p-4 rounded-xl border border-rose-100 mt-4 leading-relaxed">{error}</p>}
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <FormField label="Institutional ID (Email)" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="ADMIN@INSTITUTION.GOV"
                    className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold placeholder:text-slate-200 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.3em]"
                  />
                </FormField>

                <FormField label="Security Password" error={errors.password?.message}>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-7 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold placeholder:text-slate-200"
                  />
                </FormField>

                <div className="flex justify-end p-2">
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">
                    Trouble Accessing?
                  </button>
                </div>

                <Button
                  type="submit"
                  isLoading={isAuthorizing}
                  className="w-full py-6 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl shadow-rose-200 hover:shadow-none transition-all hover:scale-[0.98]"
                >
                  Authorize Secure Login
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      <div className="absolute bottom-10 w-full text-center px-6 lg:ml-[33%] pointer-events-none">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
          This terminal is strictly for institutional coordination.<br /> unauthorized interception is prohibited under national cyber statutes.
        </p>
      </div>
    </div>
  );
};

export default Login;
