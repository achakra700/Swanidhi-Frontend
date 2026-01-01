
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  email: z.string().email('Please enter a valid institutional or personal email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROLES = [
  { id: UserRole.ADMIN, title: 'Admin', sub: 'Governance', icon: '🛡️' },
  { id: UserRole.HOSPITAL, title: 'Hospital', sub: 'Clinical Ops', icon: '🏥' },
  { id: UserRole.BLOOD_BANK, title: 'Blood Bank', sub: 'Inventory', icon: '🩸' },
  { id: UserRole.DONOR, title: 'Donor', sub: 'Volunteer', icon: '🧑‍⚕️' },
  { id: UserRole.PATIENT, title: 'Patient', sub: 'Recipient', icon: '🧑' },
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
    if (!selectedRole) {
      setError("Please select an authorization role.");
      return;
    }

    setIsAuthorizing(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
        expectedRole: selectedRole
      });

      const responseData = response.data.data || response.data;
      const { token, refreshToken, user, organizationId: topOrgId } = responseData;

      if (!user) {
        throw new Error("Authorization protocol failed: Record not found.");
      }

      // Admin has NO organization ID - strict enforcement
      const finalUser = {
        ...user,
        organizationId: selectedRole === UserRole.ADMIN ? null : (topOrgId || user.organizationId || null)
      };

      if (finalUser.role !== selectedRole) {
        throw new Error(`Integrity Mismatch: You are not authorized for the ${selectedRole} tier.`);
      }

      login(token, finalUser, refreshToken);

      const routes: Record<UserRole, string> = {
        [UserRole.ADMIN]: '/admin/dashboard',
        [UserRole.HOSPITAL]: '/hospital/dashboard',
        [UserRole.BLOOD_BANK]: '/bloodbank/dashboard',
        [UserRole.DONOR]: '/donor/dashboard',
        [UserRole.PATIENT]: '/patient/dashboard',
      };

      navigate(routes[finalUser.role as UserRole] || '/');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Authentication failed. Verify credentials.';
      setError(msg);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          title: 'Administrator Authentication',
          subtitle: 'Authorized access only',
          warning: 'Admin access is restricted to authorized personnel. All actions are audited.'
        };
      case UserRole.HOSPITAL:
        return {
          title: 'Hospital Portal Login',
          subtitle: 'Secure clinical access point',
          warning: null
        };
      case UserRole.BLOOD_BANK:
        return {
          title: 'Blood Bank Access',
          subtitle: 'Inventory & Logistics management',
          warning: null
        };
      case UserRole.DONOR:
        return {
          title: 'Donor Login',
          subtitle: 'Volunteer portal access',
          warning: null
        };
      case UserRole.PATIENT:
        return {
          title: 'Patient Login',
          subtitle: 'Medical request tracking',
          warning: null
        };
      default:
        return { title: 'Login', subtitle: 'Secure Access', warning: null };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Brand Bar */}
      <nav className="px-6 py-6 md:px-12 md:py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Logo className="h-6 md:h-8" />
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">System Operational</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pb-24">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-500 ease-out">

          {/* Progress Bar */}
          <div className="h-1 w-full bg-slate-50">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <div className="p-8 sm:p-12">
            {step === 1 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <header className="text-center space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Welcome to SWANIDHI</h1>
                  <p className="text-slate-500 font-medium">Select your role to access the platform</p>
                </header>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id);
                        setError(null);
                      }}
                      className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${selectedRole === role.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20'
                        : 'border-slate-100 hover:border-blue-200 bg-white'
                        }`}
                    >
                      <div className="text-2xl mb-2">{role.icon}</div>
                      <div className="font-bold text-sm text-slate-900">{role.title}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{role.sub}</div>

                      {selectedRole === role.id && (
                        <div className="absolute top-3 right-3 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!selectedRole}
                    className="w-full py-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:shadow-none"
                  >
                    Continue
                  </Button>

                  <div className="mt-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New to the platform?</p>
                    <Link to="/register" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block">
                      Register Organization Node
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <header className="space-y-6">
                  <button
                    onClick={() => {
                      setStep(1);
                      setError(null);
                    }}
                    className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 19l-7-7 7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Change Role</span>
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        {ROLES.find(r => r.id === selectedRole)?.icon}
                      </span>
                    </div>
                    {selectedRole && (
                      <>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                          {getRoleConfig(selectedRole).title}
                        </h1>
                        <p className="text-slate-500 font-medium">
                          {getRoleConfig(selectedRole).subtitle}
                        </p>
                      </>
                    )}
                  </div>

                  {selectedRole === UserRole.ADMIN && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
                      <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-xs font-bold leading-relaxed">{getRoleConfig(UserRole.ADMIN).warning}</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-900 animate-in shake-in duration-300">
                      <svg className="w-5 h-5 flex-shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-bold leading-relaxed">{error}</p>
                    </div>
                  )}
                </header>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                  <div className="space-y-5">
                    <FormField label="Email Address" error={errors.email?.message}>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="name@institution.org"
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-sm"
                      />
                    </FormField>

                    <div className="space-y-1">
                      <FormField label="Password" error={errors.password?.message}>
                        <input
                          {...register('password')}
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm"
                        />
                      </FormField>
                      <div className="text-right">
                        <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isAuthorizing}
                    disabled={!isValid || isAuthorizing}
                    className="w-full py-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98]"
                  >
                    {isAuthorizing ? 'Verifying Credentials...' : 'Access Portal'}
                  </Button>
                </form>
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 text-center">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure Institutional Gateway
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs font-medium text-slate-400">
            Powered by <span className="font-bold text-slate-600">SWANIDHI Emergency Platform</span>
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            <Link to="/privacy" className="hover:text-slate-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-500 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-500 transition-colors">Help & Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
