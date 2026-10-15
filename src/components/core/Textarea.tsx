"use client";

import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  helperText?: string;
  className?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold text-verde-mata"
        >
          {label}
        </label>
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={` border-2 border-[#D7D0C2] rounded-md px-3 py-2.5 w-full text-verde-mata placeholder:text-verde-mata/50 focus:outline-none transition-colors resize-y min-h-10
            } ${className || ""}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-tiny text-coral-flor flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5.5" stroke="currentColor" stroke-width="1" />
              <path d="M6 3v4M6 9v1" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-tiny text-verde-mata/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";