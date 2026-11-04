'use client';

import { useState } from 'react';
import ReportContentCard from '@/components/report/ReportContentCard';
import ReportPreviewCard from '@/components/report/ReportPreviewCard';
import { ReportPreviewData, ReportSectionKey, ReportSectionOption } from '@/types/report';

interface ReportGenerationSectionProps {
  previewData: ReportPreviewData;
}

const REPORT_SECTION_OPTIONS: ReportSectionOption[] = [
  { key: 'sampleIdentification', label: 'Identificação da amostra' },
  { key: 'subplotsAndTrees', label: 'Parcelas e árvores' },
  { key: 'methodology', label: 'Metodologia' },
  { key: 'equationAndCoefficients', label: 'Equação e coeficientes' },
  { key: 'resultsAndStatistics', label: 'Resultados e estatísticas' },
  { key: 'qualitativeAnalysis', label: 'Análise qualitativa' },
];

const DEFAULT_SELECTED_SECTIONS: ReportSectionKey[] = [
  'sampleIdentification',
  'subplotsAndTrees',
  'methodology',
  'equationAndCoefficients',
  'resultsAndStatistics',
  'qualitativeAnalysis',
];

export default function ReportGenerationSection({ previewData }: ReportGenerationSectionProps) {
  const [selectedSections, setSelectedSections] =
    useState<ReportSectionKey[]>(DEFAULT_SELECTED_SECTIONS);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleToggleSection = (sectionKey: ReportSectionKey, checked: boolean) => {
    setErrorMessage(null);

    setSelectedSections((prev) =>
      checked ? [...prev, sectionKey] : prev.filter((item) => item !== sectionKey),
    );
  };

  const handleExportPdf = () => {
    setErrorMessage(null);

    if (!previewData.hasData) {
      setErrorMessage('Não há dados para exportar neste talhão');
      return;
    }

    if (selectedSections.length === 0) {
      setErrorMessage('Selecione ao menos um conteúdo para exportar o relatório');
      return;
    }

    setIsExporting(true);
    window.print();
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ReportContentCard
        options={REPORT_SECTION_OPTIONS}
        selectedSections={selectedSections}
        isExporting={isExporting}
        errorMessage={errorMessage}
        onToggleSection={handleToggleSection}
        onExportPdf={handleExportPdf}
      />

      <ReportPreviewCard previewData={previewData} selectedSections={selectedSections} />
    </div>
  );
}
