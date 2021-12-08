import { Group } from '@visx/group';
import { BarGroupHorizontal, Bar } from '@visx/shape';
import { AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { ParentSize } from '@visx/responsive';
import { chartColors } from '../../../src/styles/Themes';
import { ThemeContext } from 'styled-components';
import { useContext } from 'react';
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Price } from '../price/Price';

type BarGroupProps = {
  width: number;
  height: number;
} & BarChartProps;

type BarChartProps = {
  data: any[];
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  colorRange?: string[];
  priceLabel?: boolean;
};

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };
const defaultColorRange = [
  chartColors.green,
  chartColors.orange,
  chartColors.lightblue,
];

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

const Chart = ({
  width,
  height,
  margin = defaultMargin,
  data = [],
  colorRange = defaultColorRange,
  priceLabel,
}: BarGroupProps) => {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<any>();

  const themeContext = useContext(ThemeContext);
  const axisColor = themeContext.mode === 'light' ? 'black' : 'white';

  const keys = Object.keys(data[0] || {}).filter(d => d !== 'label');

  if (!keys.length) return null;

  const maxValue = Math.max(
    ...data.map(d => Math.max(...keys.map(key => Number(d[key]))))
  );

  let tooltipTimeout: number;

  const getLabel = (d: any) => d.label;

  const yScale = scaleBand<string>({
    domain: data.map(getLabel),
  });

  const barScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });

  const xScale = scaleLinear<number>({
    domain: [0, maxValue + 0.1 * maxValue],
  });

  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: colorRange,
  });

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale output dimensions
  xScale.rangeRound([0, xMax]);
  yScale.rangeRound([yMax, 0]);
  barScale.rangeRound([0, yScale.bandwidth()]);

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height - 10}>
        <Group top={margin.top} left={margin.left}>
          <BarGroupHorizontal
            data={data}
            keys={keys}
            width={xMax}
            y0={getLabel}
            y0Scale={yScale}
            y1Scale={barScale}
            xScale={xScale}
            color={colorScale}
          >
            {barGroups =>
              barGroups.map(barGroup => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.y0}`}
                  top={barGroup.y0}
                >
                  {barGroup.bars.map(bar => (
                    <Bar
                      key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width < 10 ? 10 : bar.width}
                      height={Math.abs(bar.height)}
                      fill={bar.color}
                      onMouseOver={(e: any) => {
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);

                        const coords = localPoint(e.target.ownerSVGElement, e);
                        if (!coords) return;

                        showTooltip({
                          tooltipLeft: coords.x,
                          tooltipTop: coords.y,
                          tooltipData: bar,
                        });
                      }}
                      onMouseLeave={() => {
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300);
                      }}
                    />
                  ))}
                </Group>
              ))
            }
          </BarGroupHorizontal>
        </Group>
        <AxisLeft
          left={width - margin.left}
          top={margin.bottom}
          hideZero={true}
          scale={yScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            textAnchor: 'end',
            dy: '0.33em',
            dx: '-0.33em',
          })}
        />
      </svg>
      {tooltipOpen && tooltipData ? (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          {priceLabel ? (
            <Price amount={tooltipData.value} />
          ) : (
            tooltipData.value
          )}
        </TooltipWithBounds>
      ) : null}
    </div>
  );
};

export const HorizontalBarChart = (props: BarChartProps) => (
  <ParentSize>
    {parent => <Chart width={parent.width} height={parent.height} {...props} />}
  </ParentSize>
);
