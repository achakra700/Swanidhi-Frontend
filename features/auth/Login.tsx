
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
  { id: UserRole.HOSPITAL, title: 'Hospital', sub: 'Clinical Node', icon: '🏥' },
  { id: UserRole.BLOOD_BANK, title: 'Blood Bank', sub: 'Regional Reserve', icon: '🩸' },
  { id: UserRole.ADMIN, title: 'Governance', sub: 'Admin Terminal', icon: '🛡️' },
  { id: UserRole.DONOR, title: 'Donor', sub: 'Volunteer Node', icon: '🧑' },
  { id: UserRole.PATIENT, title: 'Patient', sub: 'Recipient Hub', icon: '🧍' },
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
      const response = await api.post('/api/auth/login', { ...data, role: selectedRole });
      // Backend contract: { data: { token, user } } or { token, user }
      // Based on previous audit, it was { token, user }
      const { token, user } = response.data.data || response.data;

      // Strict role check: if selected role doesn't match backend role, fail it
      if (user.role !== selectedRole) {
        throw new Error('Unauthorized for this node type');
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
      setError(err.message || err.response?.data?.message || 'Authorization failed. Check credentials/role.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 via-slate-900 to-rose-600"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50"></div>

      <main className="w-full max-w-[540px] z-10">
        <div className="text-center mb-10 space-y-3">
          <Logo className="h-12 mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">A National Blood Coordination Platform</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-14 space-y-10 transition-all duration-500">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Identity Terminal</h1>
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
                    className="group relative p-6 bg-slate-50 border-2 border-transparent rounded-[2rem] hover:bg-slate-950 hover:border-slate-950 transition-all duration-300 text-left overflow-hidden"
                  >
                    <div className="relative z-10">
                      <span className="text-2xl mb-4 block group-hover:scale-110 transition-transform duration-300">{role.icon}</span>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-white uppercase tracking-tight">{role.title}</h3>
                      <p className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 uppercase tracking-widest mt-1">{role.sub}</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 text-6xl opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-150 transition-all duration-700 pointer-events-none">
                      {role.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-950 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3" /></svg>
                  Back
                </button>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-950 rounded-full">
                  <span className="text-lg">{ROLES.find(r => r.id === selectedRole)?.icon}</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedRole} NODE</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Authorization</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verify credentials for secure access</p>
                {error && <p className="text-[10px] font-black text-rose-600 uppercase bg-rose-50 p-4 rounded-2xl border border-rose-100 mt-4">{error}</p>}
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                <FormField label="Email Address" error={errors.email?.message}>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="INSTITUTIONAL ID"
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-950 outline-none transition-all font-bold placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest"
                  />
                </FormField>

                <FormField label="Security Password" error={errors.password?.message}>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-slate-950 outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </FormField>

                <div className="flex justify-end">
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">
                    Reset Protocol?
                  </button>
                </div>

                <Button
                  type="submit"
                  isLoading={isAuthorizing}
                  className="w-full py-6 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-200 hover:shadow-none transition-all hover:scale-[0.98]"
                >
                  Secure Login
                </Button>
              </form>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-loose">
            Secure Infrastructure for Public Health Excellence<br />
            © SWANIDHI 2026 • Verified Institutional Access
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Login;
