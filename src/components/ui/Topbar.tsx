import { ArrowLeft } from '../core/Icons';

interface TopbarProps {
  title: string;
  description: string;
  onBack: () => void;
  breadcrumb?: string[];
  statusText?: string;
}

export default function Topbar({
  title,
  description,
  onBack,
  breadcrumb,
  statusText,
}: TopbarProps) {
  return (
    <div className="flex min-h-24 w-full items-center gap-4 bg-[#FBF9F2] py-4 px-4 border-b border-[#D8D1C4]">
      <button
        onClick={onBack}
        className="flex items-center justify-center text-verde-mata border-2 border-[#D8D1C4] rounded-lg p-2 hover:bg-verde-mata/5 transition-colors"
        aria-label="Voltar"
      >
        <ArrowLeft />
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {breadcrumb && (
          <nav aria-label="Caminho da página">
            <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-[#6D786E]">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <li key={item} className="flex items-center gap-1">
                    <span className={isLast ? 'text-verde-mata' : undefined}>{item}</span>
                    {!isLast && <span aria-hidden="true">›</span>}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        <h1 className="text-2xl font-semibold text-verde-mata font-newsreader">{title}</h1>
        <p className="text-sm font-medium text-[#6D786E]">{description}</p>
      </div>
      {statusText && (
        <p className="hidden shrink-0 text-sm text-[#6D786E] md:block">{statusText}</p>
      )}
    </div>
  );
}
