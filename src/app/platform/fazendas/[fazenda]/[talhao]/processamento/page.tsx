'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getEquations,
  getFarm,
  getPlot,
  getSubPlotsWithTrees,
  processPlot,
  summarizeSubPlots,
} from '@/app/api/api';
import Button from '@/components/core/Button';
import { Check } from '@/components/core/Icons';
import { HypsometricStep, HypsometricValues } from '@/components/processing/HypsometricStep';
import { ProcessingSummaryCard } from '@/components/processing/ProcessingSummaryCard';
import {
  CoefficientKey,
  Coefficients,
  VolumetricStep,
} from '@/components/processing/VolumetricStep';
import Topbar from '@/components/ui/Topbar';
import { isCurrentUserAdmin } from '@/lib/auth';
import { DEFAULT_HYPSOMETRIC, EQUATION_MODELS } from '@/lib/equations';
import { VolumetricEquation } from '@/types/equation';
import { PrismaFarmRecord, PrismaPlotRecord, PrismaSubPlotRecord } from '@/types/farm';
import { InventoryProcessingResult, ProcessInventoryDto } from '@/types/processing';

interface ProcessamentoPageProps {
  params: Promise<{ fazenda: string; talhao: string }>;
}

const EMPTY_COEFFICIENTS: Coefficients = { beta0: '', beta1: '', beta2: '' };

// Aceita "1,85" e "1.85"; campo vazio vira NaN para ser barrado na validação
function parseDecimal(value: string): number {
  const normalized = value.trim().replace(',', '.');
  return normalized === '' ? NaN : Number(normalized);
}

function toInputValue(value: number | null | undefined): string {
  return value == null ? '' : String(value).replace('.', ',');
}

function coefficientsFrom(equation: VolumetricEquation): Coefficients {
  return {
    beta0: toInputValue(equation.beta0),
    beta1: toInputValue(equation.beta1),
    beta2: toInputValue(equation.beta2),
  };
}

export default function ProcessamentoPage({ params }: ProcessamentoPageProps) {
  const router = useRouter();
  const { fazenda, talhao } = use(params);

  const [farm, setFarm] = useState<PrismaFarmRecord | null>(null);
  const [plot, setPlot] = useState<PrismaPlotRecord | null>(null);
  const [subPlots, setSubPlots] = useState<PrismaSubPlotRecord[]>([]);
  const [equations, setEquations] = useState<VolumetricEquation[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [equationsError, setEquationsError] = useState<string | null>(null);

  const [hypsometric, setHypsometric] = useState<HypsometricValues>({
    modelType: DEFAULT_HYPSOMETRIC.modelType,
    beta0: toInputValue(DEFAULT_HYPSOMETRIC.beta0),
    beta1: toInputValue(DEFAULT_HYPSOMETRIC.beta1),
  });
  const [selectedEquationId, setSelectedEquationId] = useState('');
  const [coefficients, setCoefficients] = useState<Coefficients>(EMPTY_COEFFICIENTS);
  const [coefficientErrors, setCoefficientErrors] = useState<
    Partial<Record<CoefficientKey, string>>
  >({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<InventoryProcessingResult | null>(null);

  useEffect(() => {
    async function load() {
      setIsAdmin(isCurrentUserAdmin());

      try {
        const [farmRecord, plotRecord, subPlotRecords] = await Promise.all([
          getFarm(fazenda),
          getPlot(fazenda, talhao),
          getSubPlotsWithTrees(fazenda, talhao),
        ]);
        setFarm(farmRecord);
        setPlot(plotRecord);
        setSubPlots(subPlotRecords);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Não foi possível carregar o talhão');
      }

      try {
        const active = (await getEquations()).filter((equation) => equation.isActive);
        setEquations(active);
        if (active.length > 0) {
          setSelectedEquationId(active[0].id);
          setCoefficients(coefficientsFrom(active[0]));
        }
      } catch {
        // GET /admin/equations é restrito a admins no back-end
        setEquationsError('Não foi possível carregar as equações ativas.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [fazenda, talhao]);

  const resumo = summarizeSubPlots(subPlots);
  const allTrees = subPlots.flatMap((subPlot) => subPlot.trees ?? []);
  const treesWithoutHeight = allTrees.filter((tree) => !tree.height).length;
  const selectedEquation = equations.find((equation) => equation.id === selectedEquationId);

  const handleSelectEquation = (equationId: string) => {
    const equation = equations.find((item) => item.id === equationId);
    if (!equation) return;
    setSelectedEquationId(equationId);
    setCoefficients(coefficientsFrom(equation));
    setCoefficientErrors({});
  };

  const handleChangeCoefficient = (key: CoefficientKey, value: string) => {
    setCoefficients((current) => ({ ...current, [key]: value }));
    setCoefficientErrors((current) => ({ ...current, [key]: undefined }));
  };

  // A etapa hipsométrica não é enviada: o back recusa campos que não conhece
  const buildRequest = (equation: VolumetricEquation): ProcessInventoryDto | null => {
    if (!isAdmin) return { equationId: equation.id };

    const usesBeta2 = EQUATION_MODELS[equation.modelType].usesBeta2;
    const keys: CoefficientKey[] = usesBeta2 ? ['beta0', 'beta1', 'beta2'] : ['beta0', 'beta1'];
    const parsed = Object.fromEntries(
      keys.map((key) => [key, parseDecimal(coefficients[key])]),
    ) as Record<CoefficientKey, number>;

    const errors: Partial<Record<CoefficientKey, string>> = {};
    keys.forEach((key) => {
      if (!Number.isFinite(parsed[key])) errors[key] = 'Informe um número válido';
    });
    setCoefficientErrors(errors);
    if (Object.keys(errors).length > 0) return null;

    const unchanged = keys.every((key) => parsed[key] === equation[key]);
    if (unchanged) return { equationId: equation.id };

    // O back recusa beta2 em modelos que não o usam
    return {
      equation: {
        name: `${equation.name} (ajustada)`,
        modelType: equation.modelType,
        beta0: parsed.beta0,
        beta1: parsed.beta1,
        ...(usesBeta2 ? { beta2: parsed.beta2 } : {}),
      },
    };
  };

  const handleProcess = async () => {
    if (!selectedEquation) return;
    const request = buildRequest(selectedEquation);
    if (!request) return;

    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    try {
      setResult(await processPlot(fazenda, talhao, request));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Não foi possível processar o talhão');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => router.push(`/platform/fazendas/${fazenda}/${talhao}`);

  return (
    <div className="min-h-screen bg-[#ECE8DE]">
      <Topbar
        title="Processamento"
        description="Equação, coeficientes e metodologia"
        onBack={handleBack}
      />

      <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 lg:px-6">
        {loading && <p className="text-sm text-verde-eucalipto">Carregando dados...</p>}

        {loadError && (
          <p role="alert" className="text-sm text-coral-flor">
            {loadError}
          </p>
        )}

        {!loading && !loadError && farm && plot && (
          <>
            <div
              id="processamento-aviso"
              className="flex items-start gap-3 rounded-xl border border-[#B8D8BE] bg-[#E8F0EA] px-4 py-3 text-sm text-verde-mata"
            >
              <Check size={18} color="#2C5F2D" className="mt-0.5 shrink-0" />
              <p>
                <strong>
                  {farm.name} · {plot.name}
                </strong>{' '}
                concluído com {resumo.completedParcels} de {resumo.totalParcels} parcelas e{' '}
                {resumo.measuredTrees} árvores. Defina as equações para processar.
              </p>
            </div>

            <HypsometricStep
              values={hypsometric}
              canEdit={isAdmin}
              treesWithoutHeight={treesWithoutHeight}
              totalTrees={allTrees.length}
              onChange={setHypsometric}
            />

            <VolumetricStep
              equations={equations}
              selectedEquation={selectedEquation}
              coefficients={coefficients}
              coefficientErrors={coefficientErrors}
              canEdit={isAdmin}
              loadError={equationsError}
              onSelectEquation={handleSelectEquation}
              onChangeCoefficient={handleChangeCoefficient}
            />

            {submitError && (
              <p role="alert" className="text-sm text-coral-flor">
                {submitError}
              </p>
            )}

            <div
              id="processamento-acoes"
              className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"
            >
              <Button
                label="Voltar"
                onClick={handleBack}
                className="cursor-pointer rounded-xl border-2 border-[#D7D0C2] bg-white px-6 py-3 text-verde-mata shadow-none hover:bg-[#F5F2EC]"
              />
              <Button
                label={submitting ? 'Processando...' : 'Processar: altura → volume'}
                onClick={handleProcess}
                disabled={submitting || !selectedEquation}
                className="cursor-pointer rounded-xl bg-verde-mata px-6 py-3 text-white hover:bg-verde-mata/90"
              />
            </div>

            {result && <ProcessingSummaryCard result={result} />}
          </>
        )}
      </main>
    </div>
  );
}
