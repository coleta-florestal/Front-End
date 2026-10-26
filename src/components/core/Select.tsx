'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  className?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={selectId} className="text-sm font-semibold text-verde-mata">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={` border-2 border-[#D7D0C2] rounded-md px-3 py-2.5 w-full text-verde-mata focus:outline-none appearance-none transition-colors
            } ${className || ''}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-verde-mata/60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-tiny text-coral-flor flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
              <path d="M6 3v4M6 9v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && <p className="text-tiny text-verde-mata/60">{helperText}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
