
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'emergency' | 'clinical';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.97]";
  
  const sizes = {
    sm: "px-5 py-2.5 text-[10px] rounded-xl",
    md: "px-8 py-4 text-[11px] rounded-2xl",
    lg: "px-10 py-5 text-sm rounded-[1.5rem]"
  };

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:border-slate-400 shadow-sm",
    danger: "bg-red-700 text-white hover:bg-red-800 shadow-lg shadow-red-100",
    emergency: "bg-red-600 text-white hover:bg-red-700 shadow-[0_10px_40px_rgba(185,28,28,0.25)] animate-pulse-soft hover:animate-none",
    clinical: "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-100",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-900 hover:text-slate-900",
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

export default Button;
