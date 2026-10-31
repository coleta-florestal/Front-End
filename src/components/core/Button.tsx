export type ButtonVariant =
  'default' | 'primary' | 'outline' | 'danger' | 'danger-outline' | 'coral';

type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const variantStyles: Record<ButtonVariant, string> = {
  default: '',
  primary: 'bg-verde-mata text-white hover:bg-verde-mata/90',
  outline: 'border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5]',
  danger: 'bg-[#a96a50] text-white hover:bg-[#945a45]',
  'danger-outline': 'border border-coral-flor bg-white text-[#B85C47] hover:bg-coral-flor/10',
  coral: 'bg-coral-flor text-white hover:bg-coral-flor/90',
};

export default function Button({
  label,
  variant = 'default',
  onClick,
  className = '',
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`font-semibold py-2 px-4 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
