import { ReactNode } from 'react';

export interface ProcessingStepCardProps {
  id: string;
  step: number;
  title: string;
  description: string;
  badge?: string;
  children: ReactNode;
}

export function ProcessingStepCard({
  id,
  step,
  title,
  description,
  badge,
  children,
}: ProcessingStepCardProps) {
  return (
    <section
      id={id}
      className="flex flex-col gap-4 rounded-2xl border border-[#D7D0C2] bg-white p-4 lg:p-6"
    >
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-coral-flor">
            Etapa {step}
          </span>
          <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">{title}</h2>
          <p className="max-w-2xl text-sm text-[#6D786E]">{description}</p>
        </div>
        {badge && (
          <span className="w-fit shrink-0 rounded-full border border-[#B8D8BE] bg-[#EEF3EE] px-3 py-1 text-xs font-bold text-verde-mata">
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

// Coeficiente travado (cinza) para quem não é admin, como no protótipo
export const coefficientInputClass =
  'read-only:cursor-not-allowed read-only:border-transparent read-only:bg-[#F0EDE4] read-only:text-[#8A8F86]';
