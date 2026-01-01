
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
  { id: UserRole.HOSPITAL, title: 'Hospital', sub: 'Clinical Care Node', icon: '🏥', color: 'bg-blue-50/50 text-blue-600 border-blue-100' },
  { id: UserRole.BLOOD_BANK, title: 'Blood Bank', sub: 'Regional Inventory', icon: '🩸', color: 'bg-rose-50/50 text-rose-600 border-rose-100' },
  { id: UserRole.ADMIN, title: 'Governance', sub: 'System Controller', icon: '🛡️', color: 'bg-slate-50/50 text-slate-900 border-slate-200' },
  { id: UserRole.DONOR, title: 'Donor', sub: 'Volunteer Portal', icon: '🧑', color: 'bg-emerald-50/50 text-emerald-600 border-emerald-100' },
  { id: UserRole.PATIENT, title: 'Patient', sub: 'Recipient Hub', icon: '👤', color: 'bg-purple-50/50 text-purple-600 border-purple-100' },
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
      const response = await api.post('/api/auth/login', {
        ...data,
        expectedRole: selectedRole
      });

      const { token, user } = response.data.data || response.data;

      if (user.role !== selectedRole) {
        throw new Error(`Authorization Mismatch: This account is not registered as a ${selectedRole.replace('_', ' ')} node.`);
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
      setError(err.message || err.response?.data?.message || 'Identity verification failed. Please check your credentials.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Immersive Animated Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-100/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[150px] animate-pulse duration-[7000ms]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-100/20 rounded-full blur-[100px] animate-pulse duration-[5000ms]"></div>
      </div>

      {/* Main Glassmorphic Container */}
      <main className="w-full max-w-[1050px] relative z-10 flex flex-col md:flex-row bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.08)] border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-1000">

        {/* Left Informational Pane */}
        <div className="w-full md:w-[42%] bg-slate-950 p-12 md:p-16 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 space-y-10">
            <Logo variant="monochrome" className="h-9 mb-4" />
            <div className="space-y-6">
              <div className="w-16 h-1 bg-rose-600 rounded-full"></div>
              <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
                National <br />Coordination <br />Layer
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px]">
                Authorized portal for regional healthcare nodes and emergency donors.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 py-8 border-t border-white/10 mt-12">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">AES-256 Encrypted Grid</span>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
              Verified Access Protocol • SWANIDHI 4.2
            </p>
          </div>
        </div>

        {/* Right Interaction Pane */}
        <div className="flex-1 p-10 md:p-16 bg-white/40 flex flex-col justify-center">
          {step === 1 ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Identity Terminal</h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Select your node context</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id as UserRole);
                      setStep(2);
                    }}
                    className={`group relative flex items-center gap-5 p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] hover:bg-slate-950 hover:border-slate-950 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 text-left`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${role.color.split(' ')[0]} ${role.color.split(' ')[1]}`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-white transition-colors">{role.title}</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70 group-hover:opacity-100 transition-opacity">{role.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-12 duration-700">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100/50 hover:bg-slate-900 hover:text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" /></svg>
                  Reset Node
                </button>
                <div className="flex items-center gap-3 px-6 py-2.5 bg-rose-600/10 border border-rose-100 rounded-full">
                  <span className="text-xl">{ROLES.find(r => r.id === selectedRole)?.icon}</span>
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em]">{selectedRole?.replace('_', ' ')} HUB</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Authorization</h2>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Verify institutional credentials</p>
                {error && (
                  <div className="bg-rose-50/80 border border-rose-100 p-5 rounded-3xl animate-in shake-in duration-500">
                    <p className="text-[10px] font-black text-rose-600 uppercase leading-relaxed tracking-wider">{error}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-8">
                <div className="space-y-6">
                  <FormField label="Official Identity (Email)" error={errors.email?.message}>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="USER@GOV.NODE.IN"
                      className="w-full px-8 py-5 bg-white border border-slate-200 rounded-3xl focus:border-rose-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.4em] shadow-sm focus:shadow-xl focus:shadow-rose-100/20"
                    />
                  </FormField>

                  <FormField label="Security Password" error={errors.password?.message}>
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full px-8 py-5 bg-white border border-slate-200 rounded-3xl focus:border-rose-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200 shadow-sm focus:shadow-xl focus:shadow-rose-100/20"
                    />
                  </FormField>
                </div>

                <div className="flex justify-center">
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors border-b-2 border-transparent hover:border-rose-600 pb-1">
                    Forgotten Protocol?
                  </button>
                </div>

                <Button
                  type="submit"
                  isLoading={isAuthorizing}
                  className="w-full py-7 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-[0.5em] text-[11px] hover:bg-rose-600 transition-all duration-500 hover:scale-[0.98] shadow-2xl shadow-slate-200"
                >
                  Confirm Authorization
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="absolute bottom-8 w-full text-center px-6 pointer-events-none z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] leading-relaxed max-w-lg mx-auto opacity-60">
          Institutional terminal for public health excellence. Unauthorized usage is monitored and reported to the National Registry.
        </p>
      </footer>
    </div>
  );
};

export default Login;
