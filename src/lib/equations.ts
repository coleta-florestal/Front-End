import { EquationType } from '@/types/equation';

interface EquationModel {
  label: string;
  formula: string;
  usesBeta2: boolean;
}

// Mesmas fórmulas usadas em calculateTreeVolumeM3 (lib/farmResults.ts)
export const EQUATION_MODELS: Record<EquationType, EquationModel> = {
  SCHUMACHER_HALL: {
    label: 'Schumacher-Hall',
    formula: 'ln(V) = β0 + β1 · ln(DAP) + β2 · ln(H)',
    usesBeta2: true,
  },
  SPURR: {
    label: 'Spurr',
    formula: 'V = β0 + β1 · DAP² · H',
    usesBeta2: false,
  },
  HUSCH: {
    label: 'Husch',
    formula: 'ln(V) = β0 + β1 · ln(DAP)',
    usesBeta2: false,
  },
};
