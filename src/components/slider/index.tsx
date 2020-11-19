import ReactSlider from 'react-slider';
import {
  sliderBackgroundColor,
  sliderThumbColor,
  themeColors,
} from 'src/styles/Themes';
import styled from 'styled-components';

const StyledSlider = styled(ReactSlider)<{ maxWidth?: string }>`
  max-width: ${({ maxWidth }) => maxWidth || '500px'};
  width: 100%;
  height: 38px;
  display: flex;
  align-items: center;
  outline: none;
`;

const StyledThumb = styled.div`
  height: 24px;
  width: 24px;
  background-color: ${sliderThumbColor};
  color: #fff;
  border-radius: 50%;
  cursor: grab;
`;

const Thumb = (props: any) => <StyledThumb {...props} />;

const StyledTrack = styled.div<{ index: number }>`
  height: 8px;
  background: ${({ index }) =>
    index === 1 ? sliderBackgroundColor : themeColors.blue2};
  border-radius: 8px;
`;

const Track = (props: any, state: any) => (
  <StyledTrack {...props} index={state.index} />
);

type SliderProps = {
  value: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  maxWidth?: string;
};

export const Slider = ({
  value,
  max,
  min,
  onChange,
  maxWidth,
}: SliderProps) => {
  return (
    <StyledSlider
      maxWidth={maxWidth}
      value={value}
      max={max}
      min={min}
      renderTrack={Track}
      renderThumb={Thumb}
      onChange={value => value && typeof value === 'number' && onChange(value)}
    />
  );
};
