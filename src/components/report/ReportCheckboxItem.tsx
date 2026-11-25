interface ReportCheckboxItemProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export default function ReportCheckboxItem({
  id,
  label,
  checked,
  disabled = false,
  onChange,
}: ReportCheckboxItemProps) {
  return (
    <label
      htmlFor={id}
      className={`flex w-fit cursor-pointer select-none items-center gap-3 text-sm text-[#3B4439] transition-opacity ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:text-[#2C5F2D]'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border border-[#D7D0C2] bg-white accent-[#2C5F2D] focus:outline-none focus:ring-2 focus:ring-[#2C5F2D]/30 disabled:cursor-not-allowed"
      />
      <span>{label}</span>
    </label>
  );
}
