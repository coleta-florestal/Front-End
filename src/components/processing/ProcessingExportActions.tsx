'use client';

import Button from '@/components/core/Button';
import { QUALIDADE_LABELS } from '@/components/trees/TreeForm';
import {
  buildParcelsCsv,
  buildTreesCsv,
  csvFileName,
  downloadCsv,
  hasTrees,
  slugify,
} from '@/lib/processingCsv';
import { TreeQuality } from '@/types/farm';
import { InventoryProcessingResult } from '@/types/processing';

export interface ProcessingExportActionsProps {
  result: InventoryProcessingResult;
}

const buttonClass =
  'cursor-pointer rounded-xl border-2 border-[#D7D0C2] bg-white px-6 py-3 text-verde-mata shadow-none hover:bg-[#F5F2EC]';

export function ProcessingExportActions({ result }: ProcessingExportActionsProps) {
  // O navegador sugere o document.title como nome do arquivo ao salvar em PDF
  const handleExportPdf = () => {
    const previousTitle = document.title;
    const day = result.context.processedAt.slice(0, 10);
    document.title = `relatorio-${slugify(result.context.plotName) || 'talhao'}-${day}`;
    window.print();
    document.title = previousTitle;
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        label="Exportar PDF"
        onClick={handleExportPdf}
        className="cursor-pointer rounded-xl bg-verde-mata px-6 py-3 text-white hover:bg-verde-mata/90"
      />
      <Button
        label="Baixar CSV das parcelas"
        onClick={() => downloadCsv(csvFileName(result, 'parcelas'), buildParcelsCsv(result))}
        className={buttonClass}
      />
      {hasTrees(result) && (
        <Button
          label="Baixar CSV das árvores"
          onClick={() =>
            downloadCsv(
              csvFileName(result, 'arvores'),
              buildTreesCsv(
                result,
                (quality) => QUALIDADE_LABELS[quality as TreeQuality] ?? quality,
              ),
            )
          }
          className={buttonClass}
        />
      )}
    </div>
  );
}
