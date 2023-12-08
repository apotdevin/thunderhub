import { useState, useEffect } from 'react';
import { Input } from '../input';

// A debounced input react component
export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  placeholder,
  count,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  count: number;
  debounce?: number;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <Input
      maxWidth={'300px'}
      value={value || ''}
      onChange={e => setValue(e.target.value)}
      placeholder={`Search ${count} ${placeholder || ''}`}
    />
  );
}
