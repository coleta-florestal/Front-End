import { ReportPreviewData, ReportSectionKey } from '@/types/report';

interface ReportPreviewCardProps {
  previewData: ReportPreviewData;
  selectedSections: ReportSectionKey[];
}

export default function ReportPreviewCard({
  previewData,
  selectedSections,
}: ReportPreviewCardProps) {
  const hasIdentification = selectedSections.includes('sampleIdentification');
  const hasSubplots = selectedSections.includes('subplotsAndTrees');
  const hasMethodology = selectedSections.includes('methodology');
  const hasEquation = selectedSections.includes('equationAndCoefficients');
  const hasResultsOrQualitative =
    selectedSections.includes('resultsAndStatistics') ||
    selectedSections.includes('qualitativeAnalysis');

  return (
    <article className="flex flex-col rounded-2xl bg-[#2C5F2D] p-6 shadow-sm sm:p-7">
      <h2 className="font-serif text-lg font-bold text-[#FAF8F3]">Prévia</h2>

      <div className="mt-4 flex flex-col rounded-xl bg-[#FAF8F3] p-6">
        <h3 className="font-serif text-xl font-bold text-[#2C5F2D]">{previewData.systemTitle}</h3>

        <p className="mt-1 text-xs text-[#6E776B]">Inventário florestal · {previewData.farmName}</p>

        <div className="mt-4 flex flex-col gap-2">
          <div
            className={`h-2 w-2/5 rounded-full bg-[#D96B4F] transition-opacity duration-200 ${
              hasIdentification ? 'opacity-100' : 'opacity-30'
            }`}
          />

          <div
            className={`h-1.5 w-3/5 rounded-full bg-[#8FA895] transition-opacity duration-200 ${
              hasSubplots ? 'opacity-100' : 'opacity-30'
            }`}
          />

          <div
            className={`h-1.5 w-7/12 rounded-full bg-[#8FA895] transition-opacity duration-200 ${
              hasMethodology ? 'opacity-100' : 'opacity-30'
            }`}
          />

          <div
            className={`h-1.5 w-1/2 rounded-full bg-[#8FA895] transition-opacity duration-200 ${
              hasEquation ? 'opacity-100' : 'opacity-30'
            }`}
          />
        </div>

        <div
          className={`mt-4 h-24 w-full rounded-xl bg-[#2C5F2D] transition-opacity duration-200 ${
            hasResultsOrQualitative ? 'opacity-100' : 'opacity-30'
          }`}
        />
      </div>
    </article>
  );
}
