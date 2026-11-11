import Button from '@/components/core/Button';
import { Trash } from '@/components/core/Icons';
import { EQUATION_MODELS } from '@/lib/equations';
import type { VolumetricEquation } from '@/types/equation';

interface AdminEquationCardProps {
  equation: VolumetricEquation;
  onEdit: (eq: VolumetricEquation) => void;
  onToggleStatus: (eq: VolumetricEquation) => void;
  onRemove: (eq: VolumetricEquation) => void;
  isUpdatingStatus?: boolean;
}

const formatCoef = (value: number) => String(value).replace('.', ',');

export default function AdminEquationCard({
  equation,
  onEdit,
  onToggleStatus,
  onRemove,
  isUpdatingStatus = false,
}: AdminEquationCardProps) {
  const model = EQUATION_MODELS[equation.modelType];

  return (
    <article className="flex w-full flex-col justify-between rounded-2xl border border-[#DFDBD0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="mb-4 flex flex-col gap-1 sm:mb-0">
        <h3 className="text-lg font-bold text-verde-mata">{equation.name}</h3>
        <p className="text-sm font-medium text-[#6D786E]">
          {model?.label ?? equation.modelType} · β₀ {formatCoef(equation.beta0)} · β₁{' '}
          {formatCoef(equation.beta1)}
          {model?.usesBeta2 && equation.beta2 != null && ` · β₂ ${formatCoef(equation.beta2)}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {equation.isActive ? (
          <span className="rounded-full bg-[#E4EDE2] px-3 py-1 text-xs font-bold text-verde-mata">
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
          className="rounded-xl border border-[#D7D0C2] bg-white px-4 py-2 text-sm font-bold text-[#3B4439] transition-colors hover:border-verde-mata hover:text-verde-mata"
        />

        <Button
          type="button"
          label={equation.isActive ? 'Desativar' : 'Ativar'}
          onClick={() => onToggleStatus(equation)}
          disabled={isUpdatingStatus}
          className="rounded-xl border border-[#D7D0C2] bg-white px-4 py-2 text-sm font-bold text-[#3B4439] transition-colors hover:border-verde-mata hover:text-verde-mata disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => onRemove(equation)}
          className="ml-2 rounded-xl p-2 text-[#A84A3F] transition-colors hover:bg-[#FDF6E1]"
          title="Remover equação"
          aria-label="Remover equação"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
