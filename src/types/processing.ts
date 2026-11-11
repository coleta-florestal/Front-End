import { EquationType } from './equation';

// O back-end (PR #38) só calcula Amostragem Aleatória Simples
export type SamplingMethod = 'AAS';

export interface CustomEquationDto {
  name?: string;
  modelType: EquationType;
  beta0: number;
  beta1: number;
  beta2?: number | null;
}

export interface ProcessInventoryDto {
  equationId?: string;
  equation?: CustomEquationDto;
  confidenceLevel?: number;
  errorThresholdPercent?: number;
  finitePopulation?: boolean;
}

export interface ProcessingSamplingStatistics {
  mean: number;
  relativeSamplingErrorPercent: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
  meetsErrorThreshold: boolean;
  targetErrorPercent: number;
  confidenceLevel: number;
}

// Só os campos usados no resumo; o resultado completo fica para a tela de resultados (#23)
export interface InventoryProcessingResult {
  stage: 'COMPLETED';
  context: {
    plotName: string;
    equationUsed: { name: string; modelType: EquationType };
    processedAt: string;
  };
  totals: {
    totalSubPlotsSampled: number;
    totalTreesMeasured: number;
    meanVolumePerHaM3: number;
    estimatedTotalVolumeM3?: number | null;
  };
  statistics: {
    volumePerHa: ProcessingSamplingStatistics;
  };
}
