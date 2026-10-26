type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function Button({ label, onClick, className, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
