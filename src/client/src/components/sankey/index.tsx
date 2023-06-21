import { useContext, useMemo } from 'react';
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { SankeyChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { ThemeContext } from 'styled-components';

echarts.use([
  SankeyChart,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  GraphicComponent,
  TitleComponent,
  LegendComponent,
  ToolboxComponent,
]);

export type SankeyProps = {
  width: number;
  height: number;
  data: SankeyData;
};

interface SankeyNode {
  name: string;
}

interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  links: SankeyLink[];
  nodes: SankeyNode[];
}

export const Sankey = ({ data, width, height }: SankeyProps) => {
  const themeContext = useContext(ThemeContext);

  const option = useMemo(() => {
    const fontColor = themeContext.mode === 'light' ? 'black' : 'white';
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
      },
      series: [
        {
          type: 'sankey',
          nodeAlign: 'justify',
          layoutIterations: 32,
          data: data.nodes,
          links: data.links,
          nodeGap: 100,
          dragable: false,
          label: {
            show: true,
            color: fontColor,
          },
          emphasis: {
            focus: 'adjacency',
          },
          lineStyle: {
            color: 'gradient',
            curveness: 0.25,
          },
          itemStyle: {
            borderWidth: 50,
          },
        },
      ],
    };
  }, [data, themeContext]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      showLoading={false}
      style={{ height, width }}
    />
  );
};
