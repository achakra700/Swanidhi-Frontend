
import React, { useState, useEffect } from 'react';

const NEWS_DATA = [
  {
    source: "The Hindu",
    headline: "National Health Authority Integrates Emergency Protocols",
    summary: "New directives aim to synchronize regional blood reserves with a unified central grid.",
    url: "https://www.thehindu.com/sci-tech/health/",
    date: "MAR 22, 2025"
  },
  {
    source: "Times of India",
    headline: "Smart Logistics Reducing Critical Care Delays",
    summary: "Hospitals reporting 30% faster response times using integrated coordination layers.",
    url: "https://timesofindia.indiatimes.com/india/health",
    date: "MAR 20, 2025"
  },
  {
    source: "PIB India",
    headline: "MoHFW Launches Unified Blood Management Mandate",
    summary: "Federal mandate for all state facilities to adopt digital audit trails for blood dispatch.",
    url: "https://pib.gov.in/",
    date: "MAR 18, 2025"
  }
];

const NewsStrip: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NEWS_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-8">
          <span className="text-[10px] font-black tracking-[0.4em] text-rose-600 uppercase">In the News</span>
          <div className="flex-1 h-px bg-slate-200" aria-hidden="true"></div>
          <div className="flex gap-2">
            {NEWS_DATA.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Show news item ${i + 1}`}
                aria-current={activeIndex === i}
                className={`w-1.5 h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${activeIndex === i ? 'bg-slate-900 w-4' : 'bg-slate-300 hover:bg-slate-400'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative h-40 md:h-24 overflow-hidden" role="region" aria-live="polite">
          {NEWS_DATA.map((news, i) => (
            <a 
              key={i}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute inset-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/10 rounded-2xl p-2 -m-2 ${
                activeIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
              }`}
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{news.source}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" aria-hidden="true"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{news.date}</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-black rounded uppercase tracking-widest border border-green-100">Verified</span>
                </div>
                <h4 className="text-base md:text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{news.headline}</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-tight line-clamp-1">{news.summary}</p>
              </div>
              <div className="flex items-center gap-3 text-rose-600 group">
                <span className="text-[10px] font-black uppercase tracking-widest">Original Broadcast</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsStrip;
