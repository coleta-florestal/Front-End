import { HYPSOMETRIC_MODEL } from '@/lib/equations';
import { EquationType } from '@/types/equation';
import { ProcessingStepCard } from './ProcessingStepCard';

export interface HypsometricStepProps {
  equationModelType?: EquationType;
  measuredTrees: number;
  treesWithoutHeight: number;
  totalTrees: number;
}

export function HypsometricStep({
  equationModelType,
  measuredTrees,
  treesWithoutHeight,
  totalTrees,
}: HypsometricStepProps) {
  // Husch só usa o DAP, então o back pula o ajuste
  const notUsed = equationModelType === 'HUSCH';
  const notEnoughMeasured =
    !notUsed && treesWithoutHeight > 0 && measuredTrees < HYPSOMETRIC_MODEL.minMeasuredTrees;

  return (
    <ProcessingStepCard
      id="processamento-hipsometrica"
      step={1}
      title="Relação hipsométrica"
      description="Estima a altura (h) das árvores sem medição a partir do DAP (d), antes da equação de volume. Os coeficientes são ajustados automaticamente por talhão com as árvores que têm altura medida."
      badge={notUsed ? 'Não usada pelo modelo' : 'Ajuste automático'}
    >
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl bg-[#F5F2EC] px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#6D786E]">
          {HYPSOMETRIC_MODEL.label}
        </span>
        <span className="font-newsreader text-xl font-semibold text-verde-mata">
          {HYPSOMETRIC_MODEL.formula}
        </span>
      </div>

      {notUsed ? (
        <p className="text-xs text-[#6D786E]">
          A equação selecionada (Husch) não usa altura: esta etapa não é aplicada.
        </p>
      ) : (
        <p className="text-xs text-[#6D786E]">
          A altura medida em campo é mantida. Neste talhão, {measuredTrees} de {totalTrees} árvores
          têm altura válida para o ajuste e {treesWithoutHeight} estão sem altura (h em m · d em
          cm).
        </p>
      )}

      {notEnoughMeasured && (
        <div
          id="processamento-hipsometrica-aviso"
          role="alert"
          className="rounded-xl border border-coral-flor/40 bg-coral-flor/10 px-4 py-3 text-sm text-verde-mata"
        >
          São necessárias pelo menos {HYPSOMETRIC_MODEL.minMeasuredTrees} árvores com altura medida
          (acima de {HYPSOMETRIC_MODEL.minHeightM.toLocaleString('pt-BR')} m) para ajustar o modelo
          deste talhão. O processamento vai tentar o modelo global da amostra; se ele também falhar,
          as árvores sem altura serão excluídas do cálculo de volume.
        </div>
      )}
    </ProcessingStepCard>
  );
}
