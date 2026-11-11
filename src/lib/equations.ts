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

export type HypsometricModelType = 'STOFFELS';

export const HYPSOMETRIC_MODELS: Record<HypsometricModelType, { label: string; formula: string }> =
  {
    STOFFELS: { label: 'Stoffels', formula: 'ln(h) = β₀ + β₁ · ln(d)' },
  };

// Valores do protótipo. O back-end ainda não tem equações hipsométricas cadastradas.
export const DEFAULT_HYPSOMETRIC = {
  modelType: 'STOFFELS' as HypsometricModelType,
  beta0: 0.7241,
  beta1: 0.6815,
};
