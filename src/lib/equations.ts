import { EquationType } from '@/types/equation';

interface EquationModel {
  label: string;
  formula: string;
  usesBeta2: boolean;
}

// Mesmas fórmulas usadas em calculateTreeVolumeM3 (lib/farmResults.ts)
export const EQUATION_MODELS: Record<EquationType, EquationModel> = {
  SCHUMACHER_HALL: {
    label: 'Schumacher & Hall',
    formula: 'ln(V) = β₀ + β₁ · ln(DAP) + β₂ · ln(H)',
    usesBeta2: true,
  },
  SPURR: {
    label: 'Spurr',
    formula: 'V = β₀ + β₁ · DAP² · H',
    usesBeta2: false,
  },
  HUSCH: {
    label: 'Husch',
    formula: 'ln(V) = β₀ + β₁ · ln(DAP)',
    usesBeta2: false,
  },
};

// O back ajusta os coeficientes sozinho, por talhão, com as árvores que têm altura medida
// (hypsometric.service.ts no Back-End). Os valores aqui só descrevem essa regra na tela.
export const HYPSOMETRIC_MODEL = {
  label: 'Näslund',
  formula: 'h = 1,3 + (d / (β₀ + β₁ · d))²',
  minMeasuredTrees: 10,
  minHeightM: 1.3,
};

export function isHeightMeasuredForFit(diameterDapCm: number, height?: number | null): boolean {
  return height != null && height > HYPSOMETRIC_MODEL.minHeightM && diameterDapCm > 0;
}

export const HEIGHT_SOURCE_LABELS = {
  MEASURED: 'Medida',
  ESTIMATED: 'Estimada',
  MISSING: 'Sem altura',
} as const;
