
import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  id?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, children, required, id }) => {
  return (
    <div className="space-y-1.5 w-full">
      <label 
        htmlFor={id} 
        className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-slate-950"
      >
        {label} {required && <span className="text-rose-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative group">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && id) {
            return React.cloneElement(child as React.ReactElement<any>, { id });
          }
          return child;
        })}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-rose-500 mt-1 animate-in slide-in-from-top-1 duration-300 uppercase tracking-tight" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
