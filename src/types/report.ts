export type ReportSectionKey =
  | 'sampleIdentification'
  | 'subplotsAndTrees'
  | 'methodology'
  | 'equationAndCoefficients'
  | 'resultsAndStatistics'
  | 'qualitativeAnalysis';

export interface ReportSectionOption {
  key: ReportSectionKey;
  label: string;
}

export interface ReportExportPayload {
  farmId: string;
  plotId?: string;
  format: 'PDF';
  sections: ReportSectionKey[];
}

export interface ReportPreviewData {
  systemTitle: string;
  farmName: string;
  hasData: boolean;
}
