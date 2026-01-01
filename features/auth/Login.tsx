
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
  email: z.string().email('Institutional email required'),
  password: z.string().min(6, 'Minimum 6 characters required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROLES = [
  { id: UserRole.ADMIN, title: 'Governance', sub: 'National Oversight Node', icon: '🛡️' },
  { id: UserRole.HOSPITAL, title: 'Clinical Care', sub: 'Hospital Management', icon: '🏥' },
  { id: UserRole.BLOOD_BANK, title: 'Blood Bank', sub: 'Inventory & Logistics', icon: '🩸' },
  { id: UserRole.DONOR, title: 'Donor', sub: 'Personal Contribution', icon: '👤' },
  { id: UserRole.PATIENT, title: 'Patient', sub: 'Medical Care Support', icon: '🩺' },
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
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

      const { token, refreshToken, user, organizationId, organizationType } = response.data.data || response.data;

      // Map backend flat fields to User object
      const mappedUser = {
        ...user,
        organizationId: organizationId || user.organizationId,
        organizationType: organizationType || user.organizationType
      };

      if (mappedUser.role !== selectedRole) {
        throw new Error(`Access Denied: Your account is not authorized as a ${selectedRole.replace('_', ' ')}.`);
      }

      login(token, mappedUser, refreshToken);

      const routes: Record<string, string> = {
        [UserRole.ADMIN]: '/admin',
        [UserRole.HOSPITAL]: '/hospital',
        [UserRole.BLOOD_BANK]: '/bloodbank',
        [UserRole.DONOR]: '/donor',
        [UserRole.PATIENT]: '/patient',
      };

      navigate(routes[user.role] || '/');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo className="h-8" />
        <div className="flex items-center gap-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Production Environment v4.2</span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 pb-24">
        <div className="w-full max-w-lg space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {step === 1 ? (
            <div className="space-y-8">
              <header className="space-y-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Secure Access</h1>
                <p className="text-slate-500 font-medium">Select your node category to proceed to authorization.</p>
              </header>

              <div className="grid grid-cols-1 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setStep(2);
                      setError(null);
                    }}
                    className="group flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-slate-950 group-hover:text-white transition-colors">
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{role.title}</h3>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{role.sub}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                <span>New Organization?</span>
                <button
                  onClick={() => navigate('/register')}
                  className="text-slate-900 hover:underline decoration-2 underline-offset-4"
                >
                  Register Node
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-500">
              <header className="space-y-6">
                <button
                  onClick={() => setStep(1)}
                  className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">Back to Categories</span>
                </button>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{ROLES.find(r => r.id === selectedRole)?.icon}</span>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Verification</h1>
                  </div>
                  <p className="text-slate-500 font-medium">Please enter your institutional credentials for {selectedRole?.replace('_', ' ')} authority.</p>
                </div>
              </header>

              {error && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 animate-in shake-in duration-500">
                  <div className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5" /></svg>
                  </div>
                  <p className="text-xs font-black text-rose-600 uppercase tracking-tight leading-relaxed">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-8">
                <div className="space-y-6">
                  <FormField label="Institutional Email" error={errors.email?.message}>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="e.g. administrator@swanidhi.node"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900 shadow-sm"
                    />
                  </FormField>

                  <FormField label="Security Password" error={errors.password?.message}>
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold text-slate-900 shadow-sm"
                    />
                  </FormField>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                    Request Password Reset
                  </button>
                </div>

                <Button
                  type="submit"
                  isLoading={isAuthorizing}
                  disabled={!isValid}
                  className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-black transition-all duration-300 shadow-2xl shadow-slate-200"
                >
                  Verify Authorization
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="p-8 text-center bg-slate-50/50 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
          SWANIDHI • Emergency Blood Management Infrastructure <br />
          Institutional Access Point • National Registry Verified
        </p>
      </footer>
    </div>
  );
};

export default Login;
