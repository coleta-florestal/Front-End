import Button from '@/components/core/Button';

export interface ParcelRowProps {
  numero: string;
  status: string;
  concluido: boolean;
  area: string;
  arvoresMedidas: number;
  metaReferencia: number;
  onReabrir?: () => void;
  onVerArvores?: () => void;
  primaryLabel?: string;
  primaryOnClick?: () => void;
  primaryClassName?: string;
  concluirLabel?: string;
  concluirOnClick?: () => void;
  concluirClassName?: string;
}

export function ParcelRow({
  numero,
  status,
  concluido,
  area,
  arvoresMedidas,
  metaReferencia,
  onReabrir,
  onVerArvores,
  primaryLabel,
  primaryOnClick,
  primaryClassName,
  concluirLabel,
  concluirOnClick,
  concluirClassName,
}: ParcelRowProps) {
  const percentual = Math.min((arvoresMedidas / metaReferencia) * 100, 100);

  const isConcluida = status === 'CONCLUÍDA' || concluido;
  const isEmAndamento = status === 'EM ANDAMENTO';
  const isNaoIniciada = status === 'NÃO INICIADA';

  let badgeClasses = '';
  if (isConcluida) {
    badgeClasses = 'bg-[#EBF2EA] text-verde-mata border-[#C8DEC9]';
  } else if (isEmAndamento) {
    badgeClasses = 'bg-[#FDF4E6] text-[#A06E22] border-[#E8D1B1]';
  } else {
    badgeClasses = 'bg-[#F2EFEA] text-[#7A7A7A] border-[#D7D0C2]';
  }

  let progressFillClass = 'bg-verde-mata';
  if (isEmAndamento) {
    progressFillClass = 'bg-[#CC7A60]';
  }

  return (
    <div className="bg-[#FCFAF8] rounded-2xl border border-[#D7D0C2] p-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="mt-1 shrink-0">
            {isConcluida && (
              <div className="w-10 h-10 bg-verde-mata rounded-full flex items-center justify-center text-white shadow-sm">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            {isEmAndamento && (
              <div className="w-10 h-10 border-[2.5px] border-verde-mata rounded-full flex items-center justify-center bg-transparent">
                <div className="w-2.5 h-2.5 bg-verde-mata rounded-full" />
              </div>
            )}
            {isNaoIniciada && (
              <div className="w-10 h-10 bg-[#F0EBE1] rounded-full flex items-center justify-center border border-[#E3DCD0]">
                <div className="w-4 h-4 rounded-full border-2 border-[#A8A399]" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-verde-mata font-bold text-xl font-newsreader">{numero}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider ${badgeClasses}`}
              >
                {status}
              </span>
            </div>

            <p className="text-[#848079] text-sm font-medium">
              Área {area} · {arvoresMedidas} de {metaReferencia} árvores
            </p>

            <div className="w-full h-1.5 bg-[#EBE7DF] rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressFillClass}`}
                style={{ width: `${percentual}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          {isConcluida && (
            <>
              <Button
                label="Reabrir Parcela →"
                onClick={onReabrir}
                className="w-full sm:w-auto border border-[#BFC9BF] bg-transparent text-verde-mata hover:bg-[#F3EFE9] rounded-xl px-5 py-2.5 font-semibold text-sm"
              />
              <Button
                label="Ver árvores →"
                onClick={onVerArvores}
                className="w-full sm:w-auto border border-[#BFC9BF] bg-transparent text-verde-mata hover:bg-[#F3EFE9] rounded-xl px-5 py-2.5 font-semibold text-sm"
              />
            </>
          )}

          {!concluido && concluirOnClick && (
            <Button
              label={concluirLabel || 'Concluir parcela →'}
              onClick={concluirOnClick}
              className={`w-full sm:w-auto border border-[#BFC9BF] bg-transparent text-verde-mata hover:bg-[#F3EFE9] rounded-xl px-6 py-2.5 font-semibold text-sm ${concluirClassName || ''}`}
            />
          )}

          {isEmAndamento && (
            <Button
              label={primaryLabel || 'Continuar coleta →'}
              onClick={primaryOnClick}
              className={`w-full sm:w-auto bg-verde-mata text-creme-flor hover:bg-[#1E4320] rounded-xl px-6 py-2.5 font-semibold text-sm ${primaryClassName || ''}`}
            />
          )}

          {isNaoIniciada && (
            <Button
              label={primaryLabel || 'Iniciar coleta →'}
              onClick={primaryOnClick}
              className={`w-full sm:w-auto border border-[#BFC9BF] bg-transparent text-verde-mata hover:bg-[#F3EFE9] rounded-xl px-6 py-2.5 font-semibold text-sm ${primaryClassName || ''}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
