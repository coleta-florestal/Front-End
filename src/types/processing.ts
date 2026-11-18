import { EquationType } from './equation';
import { TreeQuality } from './farm';

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
  includeTreesInResult?: boolean;
}

export interface TreeProcessingResult {
  id?: string;
  name?: string;
  diameterDapCm: number;
  heightM: number | null;
  quality: TreeQuality;
  volumeM3: number;
  basalAreaM2: number;
  isValid: boolean;
  warnings?: string[];
}

export interface SubPlotProcessingResult {
  id?: string;
  name: string;
  areaM2: number;
  treeCount: number;
  validTreeCount?: number;
  totalVolumeM3: number;
  volumePerHa: number;
  totalBasalAreaM2: number;
  basalAreaPerHa: number;
  treesPerHa: number;
  meanDapCm: number;
  meanHeightM: number | null;
  trees?: TreeProcessingResult[];
  plotId?: string;
  plotName?: string;
}

export interface PlotProcessingResult {
  plotId: string;
  plotName: string;
  plotAreaHa: number;
  totalSubPlotsSampled: number;
  meanVolumePerHaM3: number;
  estimatedTotalVolumeM3: number;
}

export interface StatisticalMetricResult {
  n: number;
  total: number;
  mean: number;
  variance: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  standardError: number;
  standardErrorPercent: number;
  degreesOfFreedom: number;
  tStudent: number;
  confidenceLevel: number;
  absoluteSamplingError: number;
  relativeSamplingErrorPercent: number;
  confidenceIntervalLower: number;
  confidenceIntervalUpper: number;
  meetsErrorThreshold: boolean;
  targetErrorPercent: number;
}

export interface ProcessingEquationContext {
  id?: string;
  name: string;
  modelType: EquationType;
  beta0: number;
  beta1: number;
  beta2?: number | null;
}

export interface ProcessingContext {
  farmId?: string;
  farmName?: string;
  plotId?: string;
  plotName: string;
  plotAreaHa?: number | null;
  equationUsed: ProcessingEquationContext;
  processedAt: string;
}

export interface DiameterClassResult {
  classRange: string;
  minDapCm: number;
  maxDapCm: number;
  treeCount: number;
  percentage: number;
  totalVolumeM3: number;
}

export interface QualityClassResult {
  quality: string;
  treeCount: number;
  percentage: number;
  totalVolumeM3: number;
}

export interface ProcessingTotals {
  totalSubPlotsSampled: number;
  totalTreesMeasured: number;
  totalValidTreesMeasured?: number;
  totalSampleVolumeM3: number;
  meanVolumePerSubPlotM3: number;
  meanVolumePerHaM3: number;
  meanBasalAreaPerHaM2: number;
  meanTreesPerHa: number;
  meanDapCm: number;
  quadraticMeanDapCm: number;
  meanHeightM: number | null;
  estimatedTotalVolumeM3?: number | null;
  estimatedTotalVolumeLowerM3?: number | null;
  estimatedTotalVolumeUpperM3?: number | null;
}

export interface InventoryProcessingResult {
  stage: 'COMPLETED';
  context: ProcessingContext;
  totals: ProcessingTotals;
  statistics: {
    volumePerHa: StatisticalMetricResult;
    volumePerSubPlot: StatisticalMetricResult;
  };
  qualityDistribution: QualityClassResult[];
  diameterClasses: DiameterClassResult[];
  plots?: PlotProcessingResult[];
  subPlots: SubPlotProcessingResult[];
}
