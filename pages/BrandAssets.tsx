
import React from 'react';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

const BrandAssets: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-24">
      {/* Header */}
      <header className="space-y-6 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-slate-900">
          Brand <span className="text-rose-600">Identity</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed uppercase tracking-tight">
          The SWANIDHI visual identity is built for credibility, urgency, and national scale. 
          Use these assets to maintain consistency across the network.
        </p>
      </header>

      {/* The Logo Suite */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">Logo Suite</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Full Color - Light */}
          <div className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-sm flex flex-col items-center justify-center space-y-8 group transition-all hover:shadow-xl">
            <Logo size="lg" />
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Color (Light)</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">Primary Usage</p>
            </div>
          </div>

          {/* Monochrome - Slate */}
          <div className="bg-slate-50 border border-slate-100 p-12 rounded-[3rem] shadow-sm flex flex-col items-center justify-center space-y-8 group transition-all hover:shadow-xl">
            <Logo size="lg" variant="monochrome" className="text-slate-900" />
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monochrome Slate</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">Forms & Documentation</p>
            </div>
          </div>

          {/* Inverted - Dark */}
          <div className="bg-slate-950 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center space-y-8 group transition-all hover:scale-[1.02]">
            <Logo size="lg" variant="inverted" />
            <div className="text-center space-y-2 text-white/50">
              <p className="text-[10px] font-black uppercase tracking-widest">Inverted (Dark)</p>
              <p className="text-[9px] font-bold uppercase italic">Hero & UI Modals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rationale & Design */}
      <section className="grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">The Iconography</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 space-y-8">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
               <Logo variant="icon" className="h-10" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Design Rationale</h3>
            <p className="text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
              The SWANIDHI icon merges the universal symbol of life (the blood drop) with the geometry of logistics (the map pin). 
              The central white circle represents the "Core" or "Nidhi" (Treasure) of the network. 
              Subtle horizontal accents at the base hint at the Indian Tricolor, anchoring the platform in its national mission without 
              distracting from its medical urgency.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">Usage Guide</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
          <div className="space-y-6">
            <div className="p-8 border border-slate-100 rounded-3xl space-y-4">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Clear Space</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
                Maintain a clear space equal to the height of the "S" in SWANIDHI around all sides of the logo.
              </p>
            </div>
            <div className="p-8 border border-slate-100 rounded-3xl space-y-4">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Minimum Size</h4>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-tight leading-relaxed">
                The full logo should never appear smaller than 24px in height for digital displays to ensure legibility of the wordmark.
              </p>
            </div>
            <div className="p-8 border border-slate-100 rounded-3xl space-y-4">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Color Palette</h4>
              <div className="flex gap-4">
                {[
                  { name: 'Swanidhi Red', hex: '#E11D48' },
                  { name: 'Saffron Hint', hex: '#FF9933' },
                  { name: 'Green Hint', hex: '#138808' },
                  { name: 'Deep Slate', hex: '#0F172A' },
                ].map(c => (
                  <div key={c.hex} className="space-y-2">
                    <div className="w-12 h-12 rounded-xl shadow-inner" style={{ backgroundColor: c.hex }}></div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Action */}
      <footer className="bg-rose-600 p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-rose-900/40">
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-black tracking-tighter uppercase">Download Asset Pack</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 max-w-sm">
            Access SVGs, High-res PNGs, and Favicons for all official communications.
          </p>
        </div>
        <Button 
          variant="secondary" 
          className="bg-white text-rose-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-xl"
          onClick={() => alert("Asset packaging complete. Preparing download...")}
        >
          Export Assets (ZIP)
        </Button>
      </footer>
    </div>
  );
};

export default BrandAssets;
