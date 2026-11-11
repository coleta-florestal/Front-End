import { EquationData } from '@/components/modal/admin/EquationModal';
import Button from '@/components/core/Button';

interface AdminEquationCardProps {
  equation: EquationData;
  onEdit: (eq: EquationData) => void;
  onToggleStatus: (eq: EquationData) => void;
  onRemove: (eq: EquationData) => void;
  isUpdatingStatus?: boolean;
}

export default function AdminEquationCard({
  equation,
  onEdit,
  onToggleStatus,
  onRemove,
  isUpdatingStatus = false,
}: AdminEquationCardProps) {
  // Formata o número para o padrão PT-BR para exibição
  const formatCoef = (val: number) => val.toString().replace('.', ',');

  return (
    <article className="flex w-full flex-col justify-between rounded-2xl border border-[#DFDBD0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="mb-4 flex flex-col gap-1 sm:mb-0">
        <h3 className="text-lg font-bold text-[#2C5F2D]">{equation.name}</h3>
        <p className="text-sm font-medium text-[#6D786E]">
          β₀ {formatCoef(equation.b0)} · β₁ {formatCoef(equation.b1)} · β₂ {formatCoef(equation.b2)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {equation.isActive ? (
          <span className="rounded-full bg-[#E4EDE2] px-3 py-1 text-xs font-bold text-[#2C5F2D]">
            ATIVA
          </span>
        ) : (
          <span className="rounded-full bg-[#EFECE4] px-3 py-1 text-xs font-bold text-[#6D786E]">
            INATIVA
          </span>
        )}

        <Button
          type="button"
          label="Editar"
          onClick={() => onEdit(equation)}
          className="rounded-xl border border-[#D7D0C2] bg-white px-4 py-2 text-sm font-bold text-[#3B4439] transition-colors hover:border-[#2C5F2D] hover:text-[#2C5F2D]"
        />

        <Button
          type="button"
          label={equation.isActive ? 'Desativar' : 'Ativar'}
          onClick={() => onToggleStatus(equation)}
          disabled={isUpdatingStatus}
          className="rounded-xl border border-[#D7D0C2] bg-white px-4 py-2 text-sm font-bold text-[#3B4439] transition-colors hover:border-[#2C5F2D] hover:text-[#2C5F2D] disabled:opacity-50"
        />

        {/* Botão extra discreto para a ação de remover que você solicitou */}
        <button
          type="button"
          onClick={() => onRemove(equation)}
          className="ml-2 rounded-xl p-2 text-[#A84A3F] transition-colors hover:bg-[#FDF6E1]"
          title="Remover equação"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
