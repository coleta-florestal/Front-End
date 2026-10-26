import { ArrowLeft } from '../core/Icons';

interface TopbarProps {
  title: string;
  description: string;
  onBack: () => void;
}

export default function Topbar({ title, description, onBack }: TopbarProps) {
    return (
        <div className="flex h-24 w-full items-center gap-4 bg-[#FBF9F2] py-6 px-4 border-b border-[#D8D1C4]">
            <button
              onClick={onBack}
              className="flex items-center justify-center text-verde-mata border-2 border-[#D8D1C4] rounded-lg p-2 hover:bg-verde-mata/5 transition-colors"
              aria-label="Voltar"
            >
                <ArrowLeft />
            </button>
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-verde-mata">{title}</h1>
                <p className="text-sm font-medium text-[#6D786E]">{description}</p>
            </div>
        </div>
    )
}
