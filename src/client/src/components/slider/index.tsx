import { Slider as ShadcnSlider } from '@/components/ui/slider';

type SliderProps = {
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
};

export const Slider = ({ value, max, min, onChange }: SliderProps) => {
  return (
    <ShadcnSlider
      className="max-w-[440px]"
      value={[value]}
      max={max}
      min={min}
      onValueChange={values => onChange(values[0])}
    />
  );
};
