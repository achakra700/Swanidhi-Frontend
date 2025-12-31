
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

type ConnectionState = 'CONNECTING' | 'RECONNECTING' | 'ACTIVE';

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिन्दी' },
  { code: 'BN', label: 'বাংলা' },
  { code: 'TA', label: 'தமிழ்' }
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [connectionState, setConnectionState] = useState<ConnectionState>('CONNECTING');
  const [currentLang, setCurrentLang] = useState('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionState('ACTIVE');
    }, 2500);
    
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setConnectionState('RECONNECTING');
        setTimeout(() => setConnectionState('ACTIVE'), 1500);
      }
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'CONNECTING':
        return { label: 'Connecting...', color: 'bg-amber-400', animate: 'animate-pulse' };
      case 'RECONNECTING':
        return { label: 'Reconnecting...', color: 'bg-rose-400', animate: 'animate-ping' };
      case 'ACTIVE':
        return { label: 'Grid Connected', color: 'bg-emerald-500', animate: 'animate-pulse-soft' };
      default:
        return { label: 'Offline', color: 'bg-slate-300', animate: '' };
    }
  };

  const status = getStatusConfig();

  return (
    <nav className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm" role="navigation">
      <div className="flex items-center gap-8">
        <Link to="/" className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg transition-all">
          <Logo className="h-7" />
        </Link>
        
        <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm transition-all hover:bg-white hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              {connectionState === 'ACTIVE' ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
              ) : (
                <span className={`${status.animate} absolute inline-flex h-full w-full rounded-full ${status.color} opacity-75`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.color}`}></span>
            </span>
            <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${connectionState === 'ACTIVE' ? 'text-slate-900' : 'text-slate-400'}`}>
              {status.label}
            </span>
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-tight">Node: {user?.id || 'GATEWAY'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Multilingual Switcher */}
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black hover:bg-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Change language"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {currentLang}
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-5 py-2 text-[10px] font-bold hover:bg-slate-50 transition-colors ${currentLang === lang.code ? 'text-rose-600' : 'text-slate-600'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{user?.role?.replace('_', ' ')}</p>
          <p className="text-sm font-bold text-slate-950 uppercase tracking-tight">{user?.name}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="p-3 hover:bg-rose-50 rounded-2xl transition-all text-slate-400 hover:text-rose-600 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          title="Terminate Session"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
