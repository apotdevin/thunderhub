import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from 'd3-time-format';
import { ParentSize } from '@visx/responsive';
import { chartColors } from 'src/styles/Themes';
import { ThemeContext } from 'styled-components';
import { useContext } from 'react';
import { TooltipWithBounds, defaultStyles, useTooltip } from '@visx/tooltip';
import { Price } from '../price/Price';
import { localPoint } from '@visx/event';

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

const amountOfYTicks = (height: number) => {
  switch (true) {
    case height < 300:
      return 3;
    case height < 400:
      return 6;
    default:
      return 10;
  }
};

const amountOfXTicks = (width: number) => {
  switch (true) {
    case width < 300:
      return 2;
    case width < 400:
      return 6;
    default:
      return 10;
  }
};

const parseDate = timeParse('%Y-%m-%d');
const format = timeFormat('%b %d');

const formatDate = (date: string) => format(parseDate(date) as Date);

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

  const keys = Object.keys(data[0]).filter(d => d !== 'date');

  let tooltipTimeout: number;

  const getDate = (d: any) => d.date;

  const xScale = scaleBand<string>({
    domain: data.map(getDate),
    padding: 0.2,
  });

  const barScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });

  const yScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(...data.map(d => Math.max(...keys.map(key => Number(d[key]))))),
    ],
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
  barScale.rangeRound([0, xScale.bandwidth()]);

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          <BarGroup
            data={data}
            keys={keys}
            height={yMax}
            x0={getDate}
            x0Scale={xScale}
            x1Scale={barScale}
            yScale={yScale}
            color={colorScale}
          >
            {barGroups =>
              barGroups.map(barGroup => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map(bar => (
                    <rect
                      key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
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
          </BarGroup>
        </Group>
        <AxisLeft
          numTicks={amountOfYTicks(height)}
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
        <AxisBottom
          numTicks={amountOfXTicks(width)}
          top={yMax + margin.top}
          tickFormat={formatDate}
          scale={xScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            textAnchor: 'middle',
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

export const BarChart = (props: BarChartProps) => (
  <ParentSize>
    {parent => <Chart width={parent.width} height={parent.height} {...props} />}
  </ParentSize>
);
