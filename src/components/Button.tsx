interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function Button({ children, onClick, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        px-3
        py-1.5
        border
        border-gray-300
        bg-white
        text-gray-700
        font-mono
        text-[0.70rem]
        tracking-wide
        transition-opacity
        hover:opacity-60
        cursor-pointer
        disabled:opacity-40
        disabled:cursor-not-allowed
      "
    >
      {children}
    </button>
  );
}
