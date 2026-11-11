import { cn } from '@/lib/utils';
import type { StatusTone } from './parcelStatusStyles';

const TONE_STYLES: Record<StatusTone, string> = {
  success: 'border-[#B8CDB9] bg-[#E4EDE2] text-[#245225]',
  warning: 'border-[#E8D1B1] bg-[#FDF4E6] text-[#A06E22]',
  neutral: 'border-[#D7D0C2] bg-[#EFECE4] text-[#6D786E]',
};

interface StatusBadgeProps {
  label: string;
  tone: StatusTone;
  className?: string;
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
        TONE_STYLES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
