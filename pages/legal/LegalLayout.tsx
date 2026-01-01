
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../components/ui/Logo';
import Footer from '../../components/landing/Footer';

const LegalLayout: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({ children, title, subtitle }) => {
  const location = useLocation();

  const links = [
    { label: 'About Us', path: '/about' },
    { label: 'Vision', path: '/vision' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
    { label: 'Audit Charter', path: '/audit-charter' },
    { label: 'Compliance', path: '/compliance' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col">
      <nav className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded">
          <Logo className="h-6" />
        </Link>
        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          Institutional Access
        </Link>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8 sticky top-32">
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase ml-4">Registry Repository</p>
              <nav className="flex flex-col gap-1.5">
                {links.map(link => (
                  <a
                    key={link.path}
                    href={`#${link.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${location.pathname === link.path
                        ? 'bg-slate-900 text-white shadow-xl translate-x-2'
                        : 'text-slate-400 hover:text-slate-950 hover:bg-slate-100'
                      }`}
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </nav>
            </div>

            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="w-8 h-8 bg-rose-600 rounded-xl flex items-center justify-center text-white mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="3" /></svg>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Legal Clearance</p>
              <p className="text-[11px] font-medium text-slate-300 leading-relaxed uppercase tracking-tight italic">
                Documents are timestamped and cryptographically signed. Unauthorized distribution is prohibited.
              </p>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-6 border-b border-slate-100 pb-12">
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-rose-600"></span>
                <p className="text-xs font-black text-rose-600 uppercase tracking-[0.5em]">{subtitle}</p>
              </div>
              <h1 className="text-6xl md:text-7xl font-[900] text-slate-900 tracking-tighter uppercase leading-[0.9]">{title}</h1>
            </header>

            <div className="max-w-4xl">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalLayout;
