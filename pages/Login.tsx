
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import FormField from '../components/ui/FormField';
import api from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthorizing(true);
    setError(null);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

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
      setError(err.response?.data?.message || 'Access Denied: Invalid Credentials');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {/* Back to Home Action */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-all duration-300 shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Return to Grid
      </Link>

      <div className="mb-12 text-center">
        <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black mx-auto mb-4 shadow-xl">S</div>
        <h2 className="text-xl font-black tracking-[0.15em] text-slate-900 uppercase">Secure Terminal Access</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Node v4.2 Authorization Required</p>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-slate-50 px-10 py-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TLS v1.3 Encrypted</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-8">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-5">
            <FormField id="identifier" label="Institutional Identifier" required>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all text-sm font-bold text-slate-900"
                placeholder="ID @ ORGANIZATION"
              />
            </FormField>

            <FormField id="token" label="Security Token" required>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all text-sm font-bold text-slate-900"
                placeholder="••••••••••••"
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={isAuthorizing}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isAuthorizing ? (
              <>
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Initializing...
              </>
            ) : 'Authorize Access'}
          </button>
        </form>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] leading-relaxed max-w-xs">
          Unauthorized access attempts are logged and reported to the National Security Layer.
        </p>
      </div>
    </div>
  );
};

export default Login;
