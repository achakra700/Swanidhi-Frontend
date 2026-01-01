
import React, { useState, useRef, useEffect } from 'react';

interface NewsItem {
  source: string;
  title: string;
  summary: string;
  url: string;
  date: string;
  category: 'LOGISTICS' | 'CLINICAL' | 'POLICY';
}

const NEWS_REGISTRY: NewsItem[] = [
  {
    source: "The Indian Express",
    title: "Why blood remains scarce in India's hospitals",
    summary: "An analysis of the lack of real-time coordination between hospitals and blood banks, often leading to avoidable delays during emergency surgeries.",
    url: "https://indianexpress.com/article/explained/why-blood-remains-scarce-in-indias-hospitals-shortage-donations-7988358/",
    date: "JUNE 14, 2024",
    category: 'LOGISTICS'
  },
  {
    source: "The Hindu",
    title: "India short of 1 million units of blood annually",
    summary: "Health reports indicate a significant gap between demand and supply, highlighting the critical need for efficient collection and distribution networks.",
    url: "https://www.thehindu.com/sci-tech/health/india-short-of-1-million-units-of-blood/article21245645.ece",
    date: "MARCH 20, 2024",
    category: 'POLICY'
  },
  {
    source: "Times of India (Health)",
    title: "Early blood access can save 1 in 4 trauma victims",
    summary: "Clinical observations suggest that bridging the 'Golden Hour' gap with immediate blood access significantly improves survival rates in trauma patients.",
    url: "https://timesofindia.indiatimes.com/india/early-blood-transfusion-can-save-1-in-4-trauma-victims/articleshow/84444567.cms",
    date: "JULY 22, 2023",
    category: 'CLINICAL'
  },
  {
    source: "WHO India",
    title: "Towards 100% voluntary blood donation in India",
    summary: "WHO highlights the necessity of shifting from replacement donation to voluntary systems to ensure safe, consistent, and instant blood supply.",
    url: "https://www.who.int/india/news/feature-stories/detail/towards-100-voluntary-blood-donation",
    date: "JUNE 14, 2023",
    category: 'POLICY'
  }
];

const VerifiedNews: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    setActiveIndex(index);
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100 overflow-hidden" aria-labelledby="news-heading">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-rose-600"></span>
              <p className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">Evidence & Context</p>
            </div>
            <h2 id="news-heading" className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Verified News <br />& Research
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">Reference Registry</p>
            <div className="flex gap-2" role="tablist">
              {NEWS_REGISTRY.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Go to report ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${activeIndex === i ? 'bg-slate-900 w-8' : 'bg-slate-200 w-2 hover:bg-slate-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 gap-6"
          onScroll={(e) => {
            const index = Math.round(e.currentTarget.scrollLeft / e.currentTarget.offsetWidth);
            if (index !== activeIndex) setActiveIndex(index);
          }}
        >
          {NEWS_REGISTRY.map((news, i) => (
            <article key={i} className="min-w-full md:min-w-[45%] lg:min-w-[30%] snap-center">
              <div className="h-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col justify-between hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {news.category}
                    </span>
                    <time className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{news.date}</time>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{news.source}</p>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-rose-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200/50">
                  <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded"
                    aria-label={`Read original report from ${news.source} about ${news.title}`}
                  >
                    Read Original Report
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Global Disclaimer */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center md:text-left">
              News references are from third-party verified sources. SWANIDHI does not own or modify this content.
            </p>
          </div>
          <div className="flex gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            {['The Hindu', 'Indian Express', 'WHO'].map(brand => (
              <span key={brand} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </section >
  );
};

export default VerifiedNews;
