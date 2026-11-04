import { VolumetricEquationParams } from '@/types/equation';
import {
  DiametricClassItem,
  PlotVolumeItem,
  PrismaFarmRecord,
  PrismaTreeRecord,
  SubPlotVolumeItem,
} from '@/types/farm';

const DEFAULT_EQUATION: VolumetricEquationParams = {
  modelType: 'SCHUMACHER_HALL',
  beta0: -9.8,
  beta1: 1.85,
  beta2: 0.92,
};

export function calculateTreeVolumeM3(
  tree: PrismaTreeRecord,
  equation: VolumetricEquationParams = DEFAULT_EQUATION,
): number {
  const dapCm = tree.diameterDapCm;
  const heightM = tree.height ?? 0;

  if (dapCm <= 0) return 0;

  switch (equation.modelType) {
    case 'SCHUMACHER_HALL':
      if (equation.beta2 == null || heightM <= 0) return 0;
      return Math.exp(
        equation.beta0 + equation.beta1 * Math.log(dapCm) + equation.beta2 * Math.log(heightM),
      );

    case 'SPURR':
      if (heightM <= 0) return 0;
      return Math.max(0, equation.beta0 + equation.beta1 * (dapCm ** 2 * heightM));

    case 'HUSCH':
      return Math.exp(equation.beta0 + equation.beta1 * Math.log(dapCm));

    default:
      return 0;
  }
}

export function buildFarmChartMetrics(
  farmRecord: PrismaFarmRecord,
  equation: VolumetricEquationParams = DEFAULT_EQUATION,
): {
  subPlotVolumes: SubPlotVolumeItem[];
  plotVolumes: PlotVolumeItem[];
  diametricClasses: DiametricClassItem[];
} {
  const plots = farmRecord.plots ?? [];
  const subPlotVolumes: SubPlotVolumeItem[] = [];
  const plotVolumes: PlotVolumeItem[] = [];
  const allTrees: { dapCm: number; volumeM3: number }[] = [];

  for (const plot of plots) {
    let plotTotalVolume = 0;
    const subPlots = plot.subPlots ?? [];

    for (const subPlot of subPlots) {
      const trees = subPlot.trees ?? [];
      const subPlotVolume = trees.reduce((acc, tree) => {
        const volume = calculateTreeVolumeM3(tree, equation);
        allTrees.push({ dapCm: tree.diameterDapCm, volumeM3: volume });
        return acc + volume;
      }, 0);

      plotTotalVolume += subPlotVolume;

      subPlotVolumes.push({
        id: subPlot.id,
        plotName: plot.name,
        subPlotName: subPlot.name,
        volumeM3: Number(subPlotVolume.toFixed(2)),
      });
    }

    plotVolumes.push({
      id: plot.id,
      plotName: plot.name,
      volumeM3: Number(plotTotalVolume.toFixed(2)),
    });
  }

  const classStepCm = 5;
  const buckets = new Map<number, { count: number; volume: number }>();

  for (const tree of allTrees) {
    if (tree.dapCm <= 0) continue;
    const lowerBound = Math.floor(tree.dapCm / classStepCm) * classStepCm;
    const current = buckets.get(lowerBound) ?? { count: 0, volume: 0 };
    buckets.set(lowerBound, {
      count: current.count + 1,
      volume: current.volume + tree.volumeM3,
    });
  }

  const diametricClasses: DiametricClassItem[] = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([lower, data]) => ({
      id: `dap-${lower}-${lower + classStepCm}`,
      rangeLabel: `${lower}–${lower + classStepCm} cm`,
      treeCount: data.count,
      volumeM3: Number(data.volume.toFixed(2)),
    }));

  return { subPlotVolumes, plotVolumes, diametricClasses };
}
