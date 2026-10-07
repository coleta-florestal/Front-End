type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({ label, onClick, className, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
