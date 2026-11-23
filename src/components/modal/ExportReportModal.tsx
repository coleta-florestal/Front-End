'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/core/Button';

export interface ExportFormat<T extends string> {
  value: T;
  label: string;
}

export interface ExportReportModalProps<T extends string> {
  isOpen: boolean;
  onClose: () => void;
  formats: ExportFormat<T>[];
  onExport: (format: T) => void;
}

export function ExportReportModal<T extends string>({
  isOpen,
  onClose,
  formats,
  onExport,
}: ExportReportModalProps<T>) {
  const [selected, setSelected] = useState<T>(formats[0].value);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-report-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="export-report-modal-title"
          className="text-2xl font-semibold text-verde-mata font-newsreader"
        >
          Exportar relatório
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#3d3d3d]">Escolha o formato do arquivo.</p>

        <fieldset className="mt-4 flex flex-col gap-2">
          <legend className="sr-only">Formato</legend>
          {formats.map((format) => (
            <label
              key={format.value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D7D0C2] bg-white px-4 py-3 text-sm font-semibold text-verde-mata has-checked:border-verde-mata has-checked:bg-[#E4EDE2]"
            >
              <input
                type="radio"
                name="export-format"
                value={format.value}
                checked={selected === format.value}
                onChange={() => setSelected(format.value)}
                className="accent-verde-mata"
              />
              {format.label}
            </label>
          ))}
        </fieldset>

        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <Button
            label="Cancelar"
            onClick={onClose}
            className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
          />
          <Button
            label="Exportar"
            onClick={() => {
              onClose();
              onExport(selected);
            }}
            className="bg-verde-mata text-white hover:bg-verde-mata/90 rounded-xl px-6 py-3 font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
