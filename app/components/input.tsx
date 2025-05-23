interface InputProps {
  Title: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  Title,
  setValue,
  value,
  placeholder,
  disabled,
  className,
}: InputProps) {
  return (
    <div className="flex-1 flex gap-1 flex-col">
      <span className="text-sm">{Title}</span>
      <input
        type="text"
        placeholder={placeholder}
        className={`rounded-md border border-[#E5E5EA] text-sm p-2 max-w-96 ${className}`}
        value={value}
        onChange={(e) => setValue(e.target.value)} // Corrigido aqui
        disabled={disabled ? disabled : false}
      />
    </div>
  );
}
