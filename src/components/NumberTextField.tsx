import { useCallback } from 'react'
import { NumberRegex } from "../utils/dex";

interface NumberTextFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  placeHolder?: string;
}

export default function NumberTextField({
  value,
  onChange,
  autoFocus = false,
  disabled = false,
  className = "",
  placeHolder = "",
}: NumberTextFieldProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (NumberRegex.test(e.target.value)) {
      onChange(e);
    }
  }, [onChange]);

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      autoFocus={autoFocus}
      disabled={disabled}
      placeholder={placeHolder}
      className={`bg-transparent text-left text-lg text-medium text-white focus:outline-none focus:ring-0 border-none ${className}`}
      // Add more Tailwind CSS classes as needed
    />
  );
}