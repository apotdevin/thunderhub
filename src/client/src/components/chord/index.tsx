import React from 'react';
import { Arc } from '@visx/shape';
import { Group } from '@visx/group';
import { Chord, Ribbon } from '@visx/chord';
import { scaleOrdinal } from '@visx/scale';

const pink = '#ff2fab';
const orange = '#ffc62e';
const purple = '#dc04ff';
const purple2 = '#7324ff';
const red = '#d04376';
const green = '#52f091';
const blue = '#04a6ff';
const lime = '#00ddc6';

function descending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

export type SingleGroupProps = {
  endAngle: number;
  index: number;
  startAngle: number;
  value: number;
};

export type SingleChordProps = {
  source: SingleGroupProps;
  target: SingleGroupProps;
};

const groupColor = scaleOrdinal<number, string>({
  domain: [0, 1, 2, 3, 4, 5, 6, 7],
  range: [pink, orange, purple, purple2, red, green, blue, lime],
});

export type ChordProps = {
  matrix: number[][];
  width: number;
  height: number;
  centerSize?: number;
  groupCallback?: (group: SingleGroupProps) => void;
  chordCallback?: (chord: SingleChordProps) => void;
};

export const ChordGraph = ({
  matrix,
  width,
  height,
  centerSize = 20,
  groupCallback,
  chordCallback,
}: ChordProps) => {
  const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10);
  const innerRadius = outerRadius - centerSize;

  return width < 10 ? null : (
    <div className="chords">
      <svg width={width} height={height}>
        <Group top={height / 2} left={width / 2}>
          <Chord matrix={matrix} padAngle={0.05} sortSubgroups={descending}>
            {({ chords }) => (
              <g>
                {chords.groups.map((group, i) => (
                  <Arc
                    key={`key-${i}`}
                    data={group}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill={groupColor(i)}
                    onClick={() => {
                      groupCallback && groupCallback(group);
                    }}
                  />
                ))}
                {chords.map((chord, i) => {
                  return (
                    <Ribbon
                      key={`ribbon-${i}`}
                      chord={chord}
                      radius={innerRadius}
                      fill={groupColor(chord.source.index)}
                      fillOpacity={0.75}
                      onClick={() => {
                        chordCallback && chordCallback(chord);
                      }}
                    />
                  );
                })}
              </g>
            )}
          </Chord>
        </Group>
      </svg>
      <style jsx>{`
        .chords {
          display: flex;
          flex-direction: column;
          user-select: none;
        }
        svg {
          margin: 1rem 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
