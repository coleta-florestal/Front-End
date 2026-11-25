export type EquationType = 'SCHUMACHER_HALL' | 'SPURR' | 'HUSCH';

export interface VolumetricEquationParams {
  modelType: EquationType;
  beta0: number;
  beta1: number;
  beta2?: number | null;
}

export interface VolumetricEquation extends VolumetricEquationParams {
  id: string;
  name: string;
  r2?: number | null;
  syx?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
