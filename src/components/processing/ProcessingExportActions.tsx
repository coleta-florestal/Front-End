'use client';

import { useState } from 'react';
import Button from '@/components/core/Button';
import { ExportFormat, ExportReportModal } from '@/components/modal/ExportReportModal';
import { QUALIDADE_LABELS } from '@/components/trees/TreeForm';
import { buildProcessingCsv, csvFileName, downloadCsv, slugify } from '@/lib/processingCsv';
import { TreeQuality } from '@/types/farm';
import { InventoryProcessingResult } from '@/types/processing';

export interface ProcessingExportActionsProps {
  result: InventoryProcessingResult;
}

type ExportFormatValue = 'pdf' | 'csv';

const FORMATS: ExportFormat<ExportFormatValue>[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV (parcelas, árvores e estatísticas)' },
];

const qualityLabel = (quality: string) => QUALIDADE_LABELS[quality as TreeQuality] ?? quality;

export function ProcessingExportActions({ result }: ProcessingExportActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // O navegador sugere o document.title como nome do arquivo ao salvar em PDF
  const handleExportPdf = () => {
    const previousTitle = document.title;
    const day = result.context.processedAt.slice(0, 10);
    document.title = `relatorio-${slugify(result.context.plotName) || 'talhao'}-${day}`;
    window.print();
    document.title = previousTitle;
  };

  const handleExport = (format: ExportFormatValue) => {
    if (format === 'pdf') return handleExportPdf();
    downloadCsv(csvFileName(result), buildProcessingCsv(result, qualityLabel));
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        label="Exportar relatório"
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer rounded-xl bg-verde-mata px-6 py-3 text-white hover:bg-verde-mata/90"
      />
      <ExportReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formats={FORMATS}
        onExport={handleExport}
      />
    </div>
  );
}
