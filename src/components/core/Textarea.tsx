'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

export type TextareaVariant = 'default' | 'inverted';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  helperText?: string;
  variant?: TextareaVariant;
  className?: string;
};

const variantStyles: Record<TextareaVariant, { label: string; textarea: string; helper: string }> =
  {
    default: {
      label: 'text-verde-mata',
      textarea: 'border-[#D7D0C2] bg-white text-verde-mata placeholder:text-verde-mata/50',
      helper: 'text-verde-mata/60',
    },
    inverted: {
      label: 'text-white',
      textarea: 'border-transparent bg-[#F5F2EC] text-verde-mata placeholder:text-verde-mata/50',
      helper: 'text-white/80',
    },
  };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, variant = 'default', className = '', id, ...props }, ref) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');
    const styles = variantStyles[variant];

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={textareaId} className={`text-sm font-semibold ${styles.label}`}>
          {label}
        </label>

        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={`w-full rounded-md border-2 px-3 py-2.5 transition-colors focus:outline-none resize-y min-h-10 ${styles.textarea} ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p className="text-tiny flex items-center gap-1 text-coral-flor">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
              <path d="M6 3v4M6 9v1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && <p className={`text-tiny ${styles.helper}`}>{helperText}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
