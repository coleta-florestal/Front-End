'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  classname?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className="text-sm font-semibold text-verde-mata">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`border-2 border-[#D7D0C2] rounded-md px-3 py-2.5 w-full text-verde-mata placeholder:text-verde-mata/50 focus:outline-none transition-colors
            } ${className || ''}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-tiny text-coral-flor flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" stroke-width="1" />
              <path
                d="M6 3v4M6 9v1"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && <p className="text-tiny text-verde-mata/60">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
