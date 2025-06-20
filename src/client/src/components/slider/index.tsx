import { Slider as RadixSlider } from 'radix-ui';

type SliderProps = {
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
};

export const Slider = ({ value, max, min, onChange }: SliderProps) => {
  return (
    <RadixSlider.Root
      max={max}
      min={min}
      value={[value]}
      onValueChange={v => onChange(v[0])}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        touchAction: 'none',
        maxWidth: '440px',
        width: '100%',
        height: '20px',
      }}
    >
      <RadixSlider.Track
        style={{
          backgroundColor: '#737a86',
          position: 'relative',
          flexGrow: '1',
          height: '2px',
          borderRadius: '10px',
        }}
      >
        <RadixSlider.Range
          style={{
            position: 'absolute',
            backgroundColor: '#6284e4',
            borderRadius: '10px',
            height: '100%',
          }}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        style={{
          display: 'block',
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '10px',
          cursor: 'grab',
        }}
      />
    </RadixSlider.Root>
  );
};
