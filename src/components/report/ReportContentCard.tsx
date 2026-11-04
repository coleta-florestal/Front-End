import Button from '@/components/core/Button';
import ReportCheckboxItem from '@/components/report/ReportCheckboxItem';
import { ReportSectionKey, ReportSectionOption } from '@/types/report';

interface ReportContentCardProps {
  options: ReportSectionOption[];
  selectedSections: ReportSectionKey[];
  isExporting?: boolean;
  errorMessage?: string | null;
  onToggleSection: (sectionKey: ReportSectionKey, checked: boolean) => void;
  onExportPdf: () => void;
}

export default function ReportContentCard({
  options,
  selectedSections,
  isExporting = false,
  errorMessage = null,
  onToggleSection,
  onExportPdf,
}: ReportContentCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#DFDBD0] bg-[#FAF8F3] p-6 shadow-sm sm:p-8">
      <h2 className="font-serif text-xl font-bold text-[#2C5F2D]">Conteúdo do relatório</h2>

      <div className="mt-5 flex flex-col gap-3.5">
        {options.map((option) => (
          <ReportCheckboxItem
            key={option.key}
            id={`report-section-${option.key}`}
            label={option.label}
            checked={selectedSections.includes(option.key)}
            disabled={isExporting}
            onChange={(checked) => onToggleSection(option.key, checked)}
          />
        ))}
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 w-fit rounded-md border border-[#F2B8AD] bg-[#FDECE9] px-3 py-1.5 text-xs font-semibold text-[#C85A46]"
        >
          {errorMessage}
        </p>
      )}

      <div className="mt-6">
        <Button
          type="button"
          label={isExporting ? 'Exportando...' : 'Exportar PDF'}
          onClick={onExportPdf}
          disabled={isExporting}
          className="rounded-xl border border-[#84A58D] bg-white px-6 py-2.5 text-sm font-bold text-[#2C5F2D] shadow-none transition-colors hover:bg-[#E4EDE2]"
        />
      </div>
    </article>
  );
}
