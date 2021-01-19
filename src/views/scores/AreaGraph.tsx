import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import {
  withTooltip,
  Tooltip,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { max, extent, bisector } from 'd3-array';
import { chartColors, themeColors } from 'src/styles/Themes';
import format from 'date-fns/format';
import numeral from 'numeral';

const tooltipStyles = {
  ...defaultStyles,
  background: themeColors.blue7,
  border: '1px solid white',
  color: 'white',
};

const getDate = (d: DataType) => new Date(d.date);
const getValue = (d: DataType) => d?.value || 0;
const bisectDate = bisector<DataType, Date>(d => new Date(d.date)).left;

type DataType = {
  date: string;
  value: number;
};

export type AreaProps = {
  data: DataType[];
  areaColor?: string;
  lineColor?: string;
  tooltipText?: string;
  clickCallback?: () => void;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const AreaGraph = withTooltip<AreaProps, DataType>(
  ({
    data,
    areaColor = chartColors.orange,
    lineColor = themeColors.blue2,
    tooltipText,
    clickCallback,
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<DataType>) => {
    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, data]
    );

    const valueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, max(data, getValue) || 0],
          nice: false,
        }),
      [margin.top, innerHeight, data]
    );

    const handleTooltip = useCallback(
      (
        event:
          | React.TouchEvent<SVGRectElement>
          | React.MouseEvent<SVGRectElement>
      ) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);

        const index = bisectDate(data, x0, 1);

        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;

        if (d1 && getDate(d1)) {
          const firstPart = x0.valueOf() - getDate(d0).valueOf();
          const secondPart = getDate(d1).valueOf() - x0.valueOf();

          d = firstPart > secondPart ? d1 : d0;
        }

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: valueScale(getValue(d)),
        });
      },
      [showTooltip, valueScale, dateScale, data]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <AreaClosed<DataType>
            data={data}
            x={d => dateScale(getDate(d)) ?? 0}
            y={d => valueScale(getValue(d)) ?? 0}
            yScale={valueScale}
            strokeWidth={1}
            stroke={areaColor}
            fill={areaColor}
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            onClick={() => {
              clickCallback && clickCallback();
            }}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={lineColor}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={lineColor}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`${tooltipText}${numeral(getValue(tooltipData)).format('0,0')}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {format(getDate(tooltipData), 'LLL d, yyyy')}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);
