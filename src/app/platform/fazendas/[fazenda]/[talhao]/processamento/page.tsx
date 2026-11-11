'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEquations, getFarm, getPlot, processPlot } from '@/app/api/api';
import Button from '@/components/core/Button';
import {
  CoefficientKey,
  Coefficients,
  CoefficientsSection,
} from '@/components/processing/CoefficientsSection';
import { CUSTOM_EQUATION, EquationSection } from '@/components/processing/EquationSection';
import { ProcessingSummaryCard } from '@/components/processing/ProcessingSummaryCard';
import { SamplingSection, SamplingSettings } from '@/components/processing/SamplingSection';
import Topbar from '@/components/ui/Topbar';
import { EQUATION_MODELS } from '@/lib/equations';
import { EquationType, VolumetricEquation } from '@/types/equation';
import { PrismaFarmRecord, PrismaPlotRecord } from '@/types/farm';
import { InventoryProcessingResult, ProcessInventoryDto } from '@/types/processing';

interface ProcessamentoPageProps {
  params: Promise<{ fazenda: string; talhao: string }>;
}

const EMPTY_COEFFICIENTS: Coefficients = { beta0: '', beta1: '', beta2: '' };

const DEFAULT_SAMPLING: SamplingSettings = {
  method: 'AAS',
  confidenceLevel: '0.95',
  errorThresholdPercent: '10',
  finitePopulation: false,
};

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
  const [equations, setEquations] = useState<VolumetricEquation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [equationsError, setEquationsError] = useState<string | null>(null);

  const [selectedEquationId, setSelectedEquationId] = useState(CUSTOM_EQUATION);
  const [modelType, setModelType] = useState<EquationType>('SCHUMACHER_HALL');
  const [coefficients, setCoefficients] = useState<Coefficients>(EMPTY_COEFFICIENTS);
  const [sampling, setSampling] = useState<SamplingSettings>(DEFAULT_SAMPLING);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CoefficientKey, string>>>({});
  const [errorThresholdError, setErrorThresholdError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<InventoryProcessingResult | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [farmRecord, plotRecord] = await Promise.all([
          getFarm(fazenda),
          getPlot(fazenda, talhao),
        ]);
        setFarm(farmRecord);
        setPlot(plotRecord);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'Não foi possível carregar o talhão');
      }

      // A lista de equações é rota de admin: sem acesso, ainda dá para usar a personalizada
      try {
        const active = (await getEquations()).filter((equation) => equation.isActive);
        setEquations(active);
        if (active.length > 0) {
          setSelectedEquationId(active[0].id);
          setModelType(active[0].modelType);
          setCoefficients(coefficientsFrom(active[0]));
        }
      } catch {
        setEquationsError('Equações cadastradas indisponíveis. Use uma personalizada.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [fazenda, talhao]);

  const selectedEquation = equations.find((equation) => equation.id === selectedEquationId);
  const usesBeta2 = EQUATION_MODELS[modelType].usesBeta2;
  const usedKeys: CoefficientKey[] = usesBeta2 ? ['beta0', 'beta1', 'beta2'] : ['beta0', 'beta1'];

  const handleSelectEquation = (equationId: string) => {
    setSelectedEquationId(equationId);
    setFieldErrors({});
    const equation = equations.find((item) => item.id === equationId);
    if (equation) {
      setModelType(equation.modelType);
      setCoefficients(coefficientsFrom(equation));
    }
  };

  const handleChangeCoefficient = (key: CoefficientKey, value: string) => {
    setCoefficients((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const buildRequest = (): ProcessInventoryDto | null => {
    const parsed = Object.fromEntries(
      usedKeys.map((key) => [key, parseDecimal(coefficients[key])]),
    ) as Partial<Record<CoefficientKey, number>>;

    const errors: Partial<Record<CoefficientKey, string>> = {};
    usedKeys.forEach((key) => {
      if (!Number.isFinite(parsed[key])) errors[key] = 'Informe um número válido';
    });

    const errorThreshold = parseDecimal(sampling.errorThresholdPercent);
    const thresholdInvalid =
      !Number.isFinite(errorThreshold) || errorThreshold < 0.1 || errorThreshold > 100;

    setFieldErrors(errors);
    setErrorThresholdError(thresholdInvalid ? 'Informe um valor entre 0,1 e 100' : undefined);
    if (Object.keys(errors).length > 0 || thresholdInvalid) return null;

    const samplingDto = {
      confidenceLevel: Number(sampling.confidenceLevel),
      errorThresholdPercent: errorThreshold,
      finitePopulation: sampling.finitePopulation,
    };

    const unchanged =
      selectedEquation &&
      usedKeys.every((key) => parsed[key] === (selectedEquation[key] ?? undefined));
    if (selectedEquation && unchanged) {
      return { equationId: selectedEquation.id, ...samplingDto };
    }

    // O back recusa beta2 em modelos que não o usam, então ele só vai no Schumacher-Hall
    return {
      equation: {
        name: selectedEquation ? `${selectedEquation.name} (ajustada)` : undefined,
        modelType,
        beta0: parsed.beta0!,
        beta1: parsed.beta1!,
        ...(usesBeta2 ? { beta2: parsed.beta2! } : {}),
      },
      ...samplingDto,
    };
  };

  const handleProcess = async () => {
    const request = buildRequest();
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

  return (
    <div className="min-h-screen bg-creme-flor">
      <Topbar
        title="Configurar processamento"
        description={
          farm && plot ? `${farm.name} · ${plot.name}` : 'Equação, coeficientes e amostragem'
        }
        onBack={() => router.push(`/platform/fazendas/${fazenda}/${talhao}`)}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {loading && <p className="text-sm text-verde-eucalipto">Carregando dados...</p>}

        {loadError && (
          <p role="alert" className="text-sm text-coral-flor">
            {loadError}
          </p>
        )}

        {!loading && !loadError && (
          <>
            <EquationSection
              equations={equations}
              selectedEquationId={selectedEquationId}
              modelType={modelType}
              loadError={equationsError}
              onSelectEquation={handleSelectEquation}
              onChangeModel={setModelType}
            />

            <CoefficientsSection
              values={coefficients}
              usesBeta2={usesBeta2}
              errors={fieldErrors}
              onChange={handleChangeCoefficient}
            />

            <SamplingSection
              values={sampling}
              errorThresholdError={errorThresholdError}
              onChange={setSampling}
            />

            {submitError && (
              <p role="alert" className="text-sm text-coral-flor">
                {submitError}
              </p>
            )}

            <div id="processamento-acoes" className="flex justify-end">
              <Button
                label={submitting ? 'Processando...' : 'Processar talhão'}
                onClick={handleProcess}
                disabled={submitting}
                className="w-full cursor-pointer rounded-xl bg-coral-flor px-6 py-3 text-creme-flor transition-colors hover:bg-coral-flor/90 sm:w-auto"
              />
            </div>

            {result && <ProcessingSummaryCard result={result} />}
          </>
        )}
      </main>
    </div>
  );
}
