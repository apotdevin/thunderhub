import { NativeSelect, NativeSelectOption } from '../ui/native-select';

export type ValueProp = {
  value: string | number;
  label: string | number;
};

type SelectProps = {
  options: ValueProp[];
  maxWidth?: string;
  callback: (value: ValueProp[]) => void;
};

export const Select = ({ options, maxWidth, callback }: SelectProps) => {
  return (
    <div style={{ maxWidth: maxWidth || undefined, width: '100%' }}>
      <NativeSelect
        defaultValue=""
        onChange={e => {
          const option = options.find(o => String(o.value) === e.target.value);
          if (option) callback([option]);
        }}
      >
        <NativeSelectOption value="">Select...</NativeSelectOption>
        {options.map(opt => (
          <NativeSelectOption key={String(opt.value)} value={String(opt.value)}>
            {String(opt.label)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};

type SelectWithValueProps = {
  options: ValueProp[];
  value: ValueProp | undefined;
  maxWidth?: string;
  minWidth?: string;
  isClearable?: boolean;
  callback: (value: ValueProp[]) => void;
};

export const SelectWithValue = ({
  options,
  maxWidth,
  minWidth,
  callback,
  value,
  isClearable = true,
}: SelectWithValueProps) => {
  return (
    <div style={{ maxWidth, minWidth, width: maxWidth ? undefined : 'auto' }}>
      <NativeSelect
        value={value ? String(value.value) : ''}
        onChange={e => {
          const selectedValue = e.target.value;
          if (!selectedValue) {
            callback([]);
            return;
          }
          const option = options.find(o => String(o.value) === selectedValue);
          if (option) callback([option]);
        }}
      >
        {(isClearable || !value) && (
          <NativeSelectOption value="">Select...</NativeSelectOption>
        )}
        {options.map(opt => (
          <NativeSelectOption key={String(opt.value)} value={String(opt.value)}>
            {String(opt.label)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};

export const SmallSelectWithValue = ({
  options,
  maxWidth,
  callback,
  value,
  isClearable = true,
}: SelectWithValueProps) => {
  return (
    <div style={{ maxWidth, width: '100%' }}>
      <NativeSelect
        size="sm"
        value={value ? String(value.value) : ''}
        onChange={e => {
          const selectedValue = e.target.value;
          if (!selectedValue) {
            callback([]);
            return;
          }
          const option = options.find(o => String(o.value) === selectedValue);
          if (option) callback([option]);
        }}
      >
        {(isClearable || !value) && (
          <NativeSelectOption value="">Select...</NativeSelectOption>
        )}
        {options.map(opt => (
          <NativeSelectOption key={String(opt.value)} value={String(opt.value)}>
            {String(opt.label)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
};
