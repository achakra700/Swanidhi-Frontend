
import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/landing/Hero3D';
import VerifiedNews from '../components/landing/VerifiedNews';
import Logo from '../components/ui/Logo';
import Footer from '../components/landing/Footer';

const Reveal: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>{children}</div>;
};

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Cinematic Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-white text-center px-6 overflow-hidden bg-slate-950">
        <Suspense fallback={<div className="absolute inset-0 bg-slate-950" aria-hidden="true" />}>
          <Hero3D />
        </Suspense>

        {/* Navigation Bar overlay */}
        <nav className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
          <Logo variant="monochrome" className="h-6 text-white" />
          <div className="flex gap-6 items-center">
            <Link to="/login" className="hidden md:block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Node Access
            </Link>
            <Link to="/login" className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 transition-all">
              Launch Terminal
            </Link>
          </div>
        </nav>

        <div className="relative z-10 max-w-5xl space-y-8">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600/10 border border-rose-500/30 rounded-full text-rose-500 text-[10px] font-black tracking-[0.2em] uppercase mb-4">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" aria-hidden="true"></span>
              National Coordination Node
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase mb-6 drop-shadow-2xl">
              SWA<span className="text-rose-600">NIDHI</span>
            </h1>
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 border-y border-white/10 py-4 opacity-80">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-rose-500 mb-1">Self-Reliance</p>
                <p className="text-[8px] font-bold uppercase text-slate-400">Swa-Nidhi</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-[10px] font-black uppercase text-rose-500 mb-1">Collective Responsibility</p>
                <p className="text-[8px] font-bold uppercase text-slate-400">Social Ownership</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-rose-500 mb-1">Life Preservation</p>
                <p className="text-[8px] font-bold uppercase text-slate-400">Jivan Suraksha</p>
              </div>
            </div>
            <p className="text-base md:text-2xl font-medium text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 mb-10 drop-shadow-lg uppercase tracking-tight">
              India’s Integrated Infrastructure for <span className="text-white font-bold">Real-Time Emergency Blood Synchronization</span> across Districts and States.
            </p>
          </Reveal>

          <Reveal className="flex flex-col sm:flex-row gap-4 justify-center px-10 sm:px-0">
            <Link to="/login" className="px-10 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/50 transition-all shadow-2xl shadow-rose-900/40">
              Authorized Login
            </Link>
            <Link to="/register" className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50 transition-all">
              Register Organization
            </Link>
          </Reveal>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hidden md:block" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 14l-7 7-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Quotes Section: Voices of the Grid */}
      <section className="bg-slate-50 py-32 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20 space-y-4">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">Field Observations</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter">Voices of the Grid</h3>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "In trauma surgery, information delay is as lethal as blood scarcity. SWANIDHI solves the first to prevent the second.",
                author: "Dr. Aradhya Sharma",
                role: "Trauma Lead, Metro General"
              },
              {
                text: "Moving from manual logs to a synchronized national registry has reduced our sector's response time by 40%.",
                author: "Maj. Vikram Singh",
                role: "Logistics Hub Coordinator"
              },
              {
                text: "The audit trail feature provides the transparency health authorities have needed for decades. It's a leap forward for accountability.",
                author: "Prof. S. Mukherji",
                role: "National Health Audit Wing"
              }
            ].map((quote, idx) => (
              <Reveal key={idx} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
                <div className="space-y-6">
                  <svg className="w-10 h-10 text-rose-500 opacity-20 group-hover:opacity-40 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C13.3601 14 12.017 12.6569 12.017 11V7C12.017 5.34315 13.3601 4 15.017 4H19.017C20.6739 4 22.017 5.34315 22.017 7V16.667C22.017 19.0598 20.0768 21 17.684 21H14.017ZM2.01697 21L2.01697 18C2.01697 16.8954 2.91241 16 4.01697 16H7.01697V14H3.01697C1.36012 14 0.0169678 12.6569 0.0169678 11V7C0.0169678 5.34315 1.36012 4 3.01697 4H7.01697C8.67382 4 10.017 5.34315 10.017 7V16.667C10.017 19.0598 8.07675 21 5.684 21H2.01697Z" />
                  </svg>
                  <p className="text-lg font-bold italic text-slate-800 leading-relaxed tracking-tight uppercase">"{quote.text}"</p>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-50">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{quote.author}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{quote.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About & Vision Section */}
      <section className="bg-white py-32 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <Reveal className="space-y-10">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase mb-4">About the Network</h2>
              <h3 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter leading-none uppercase">
                Unified Grid. <br />Instant Life.
              </h3>
            </div>
            <p className="text-xl text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
              SWANIDHI means a <span className="text-rose-600 font-black">sacred collective reserve</span> — a system built to protect life through shared responsibility.
              We synchronize hospitals, registered blood banks, and verified donors in a unified sovereign grid.
            </p>
            <div className="flex gap-12">
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-950">142+</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Nodes</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-black text-slate-950">14m</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. Sync Speed</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="bg-slate-50 p-16 rounded-[4rem] border border-slate-100 space-y-8 shadow-inner">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-slate-100">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">National Vision</h4>
            <p className="text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
              To architect a nation where no life is lost due to unavailability of blood. We aim for a secure, auditable, and universal blood coordination layer across all 700+ districts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white py-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase mb-4">Operational Blueprint</h2>
            <h3 className="text-4xl md:text-6xl font-black text-slate-950 uppercase tracking-tighter">How Grid Sync Works</h3>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="absolute top-20 left-0 w-full h-px bg-slate-100 hidden md:block"></div>
            {[
              {
                step: "01",
                title: "Broadcast",
                desc: "Hospitals broadcast real-time SOS signals when critical blood levels are detected in trauma or surgery.",
                icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9m-12.728 0a9 9 0 000 12.728"
              },
              {
                step: "02",
                title: "Synchronize",
                desc: "Algorithmic matching identifies the closest verified blood hubs with specific inventory matches.",
                icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                step: "03",
                title: "Deploy",
                desc: "Logistics are coordinated instantly, ensuring blood reaches the hospital within the critical 'Golden Hour'.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              }
            ].map((s, i) => (
              <Reveal key={i} className="relative z-10 space-y-8 text-center md:text-left">
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-rose-600 shadow-xl mx-auto md:mx-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d={s.icon} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none">Phase {s.step}</p>
                  <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tight">{s.title}</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase leading-relaxed tracking-tight">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Statistics Section */}
      <section className="bg-slate-950 py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%"><pattern id="grid-stats" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" /></pattern><rect width="100%" height="100%" fill="url(#grid-stats)" /></svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <Reveal className="space-y-8">
              <h2 className="text-[10px] font-black tracking-[0.5em] text-rose-500 uppercase">Emergency Context</h2>
              <h3 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                The Cost of <br /><span className="text-rose-600">Sync Failure</span>
              </h3>
              <p className="text-lg font-bold text-slate-400 uppercase tracking-tight leading-relaxed max-w-md">
                In India, the primary barrier to life preservation is not blood scarcity, but the synchronization delay between demand and available hubs.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { val: "12,000", sub: "DEATHS DAILY", desc: "Due to lack of timely blood access across India." },
                { val: "1.1M", sub: "UNIT DEFICIT", desc: "Annual gap in the national emergency blood grid." },
                { val: "60%", sub: "RURAL DELAY", desc: "Cases where blood fails to reach within the Golden Hour." },
                { val: "100%", sub: "RESPONSIBILITY", desc: "Commitment to zero-latency life preservation logic." }
              ].map((stat, i) => (
                <Reveal key={i} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm space-y-4 group hover:bg-white/10 transition-all">
                  <p className="text-4xl font-black text-white tracking-tighter group-hover:text-rose-500 transition-colors uppercase">{stat.val}</p>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{stat.sub}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed tracking-widest">{stat.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-white py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center space-y-12 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
              <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Synchronize Your <br />Medical Node Today
              </h2>
              <p className="text-base md:text-xl font-bold text-slate-400 uppercase tracking-tight max-w-2xl mx-auto leading-relaxed">
                Join the national grid to eliminate logistical latency and protect the sanctity of life through collective technical excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link to="/login" className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20">
                Authorized Login
              </Link>
              <Link to="/register" className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">
                Register Organization
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <VerifiedNews />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
};

export default Landing;
