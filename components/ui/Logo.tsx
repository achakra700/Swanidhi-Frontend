
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'monochrome' | 'inverted';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8", variant = 'full', size = 'md' }) => {
  const isDark = variant === 'inverted';
  const isMono = variant === 'monochrome';
  
  const textColor = isDark ? 'text-white' : isMono ? 'text-current' : 'text-slate-900';

  const Icon = () => (
    <svg 
      viewBox="0 0 24 24" 
      className="h-full w-auto flex-shrink-0" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <title>SWANIDHI Logo</title>
      <desc>A blood drop integrated with a map location pin, symbolizing life-saving logistics.</desc>
      <defs>
        <linearGradient id="drop-gradient-main" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor={isMono || isDark ? 'currentColor' : '#f43f5e'} />
          <stop offset="1" stopColor={isMono || isDark ? 'currentColor' : '#be123c'} />
        </linearGradient>
      </defs>
      <path 
        d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z" 
        fill="url(#drop-gradient-main)" 
      />
      <circle cx="12" cy="9" r="3" fill={isDark ? '#020617' : 'white'} fillOpacity={isMono ? "0.2" : "1"} />
      {!isMono && !isDark && (
        <>
          <path d="M9 13.5C9 13.5 10.5 14.5 12 14.5" stroke="#FF9933" strokeWidth="1" strokeLinecap="round" />
          <path d="M12 14.5C13.5 14.5 15 13.5 15 13.5" stroke="#138808" strokeWidth="1" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Icon />
      {variant !== 'icon' && (
        <span className={`${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'} font-[900] tracking-[-0.04em] uppercase leading-none ${textColor}`}>
          SWA<span className={isMono || isDark ? 'opacity-80' : 'text-rose-600'}>NIDHI</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
