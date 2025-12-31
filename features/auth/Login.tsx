
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
  email: z.string().email('Official institutional email required'),
  password: z.string().min(6, 'Security token required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.HOSPITAL);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsAuthorizing(true);
    setError(null);
    try {
      const response = await api.post('/auth/authorize', { ...data, role });
      login(response.data.token, response.data.user);
      
      const routes = {
        [UserRole.ADMIN]: '/admin',
        [UserRole.HOSPITAL]: '/hospital',
        [UserRole.BLOOD_BANK]: '/bloodbank',
        [UserRole.DONOR]: '/donor',
        [UserRole.PATIENT]: '/patient',
      };
      navigate(routes[role]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authorization protocol failed. Check credentials.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <main className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 md:p-12 space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <header className="text-center space-y-4">
          <Logo className="h-10 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Secure Access</h1>
          {error && <p className="text-xs font-bold text-rose-600 uppercase bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
        </header>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            {[UserRole.HOSPITAL, UserRole.BLOOD_BANK, UserRole.ADMIN, UserRole.DONOR, UserRole.PATIENT].map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`px-2 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border-2 ${role === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}>
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>

          <FormField label="Identifier" error={errors.email?.message}>
            <input {...register('email')} type="email" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold" />
          </FormField>

          <FormField label="Security Token" error={errors.password?.message}>
            <input {...register('password')} type="password" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-950 outline-none transition-all font-bold" />
          </FormField>

          <Button type="submit" isLoading={isAuthorizing} className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-[0.3em]">
            Authorize Node
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Login;
