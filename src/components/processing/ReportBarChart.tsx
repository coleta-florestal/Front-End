export interface ReportBarChartItem {
  label: string;
  value: number;
  valueLabel: string;
}

interface ReportBarChartProps {
  items: ReportBarChartItem[];
  reference?: { value: number; label: string };
  ariaLabel: string;
}

// Medidas em unidades do viewBox; o SVG escala para a largura da página
const WIDTH = 640;
const LABEL_WIDTH = 120;
const VALUE_WIDTH = 96;
const ROW_HEIGHT = 22;
const BAR_HEIGHT = 12;
const REFERENCE_SPACE = 18;
const BAR_AREA = WIDTH - LABEL_WIDTH - VALUE_WIDTH;

// SVG com atributos em vez de style={{}}: as barras mudam de tamanho conforme os dados
export function ReportBarChart({ items, reference, ariaLabel }: ReportBarChartProps) {
  const max = Math.max(...items.map((item) => item.value), reference?.value ?? 0) || 1;
  const rowsHeight = items.length * ROW_HEIGHT;
  const height = rowsHeight + (reference ? REFERENCE_SPACE : 0);
  const referenceX = reference ? LABEL_WIDTH + (reference.value / max) * BAR_AREA : 0;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className="h-auto w-full text-[#2C2F33]"
    >
      {items.map((item, index) => {
        const y = index * ROW_HEIGHT;
        const barY = y + (ROW_HEIGHT - BAR_HEIGHT) / 2;
        const barWidth = Math.max(1, (item.value / max) * BAR_AREA);

        return (
          <g key={`${item.label}-${index}`}>
            <text
              x={LABEL_WIDTH - 8}
              y={y + ROW_HEIGHT / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="11"
              className="fill-current"
            >
              {item.label}
            </text>
            <rect
              x={LABEL_WIDTH}
              y={barY}
              width={BAR_AREA}
              height={BAR_HEIGHT}
              rx="3"
              className="fill-[#F1EEE6]"
            />
            <rect
              x={LABEL_WIDTH}
              y={barY}
              width={barWidth}
              height={BAR_HEIGHT}
              rx="3"
              className="fill-verde-mata"
            />
            <text
              x={LABEL_WIDTH + BAR_AREA + 8}
              y={y + ROW_HEIGHT / 2}
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="600"
              className="fill-verde-mata"
            >
              {item.valueLabel}
            </text>
          </g>
        );
      })}

      {reference && (
        <g>
          <line
            x1={referenceX}
            x2={referenceX}
            y1="0"
            y2={rowsHeight}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="stroke-coral-flor"
          />
          <text
            x={referenceX}
            y={rowsHeight + 12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            className="fill-coral-flor"
          >
            {reference.label}
          </text>
        </g>
      )}
    </svg>
  );
}
