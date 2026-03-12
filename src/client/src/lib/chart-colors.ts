import { useMemo } from 'react';
import { useConfigState } from '../context/ConfigContext';

export const CHART_COLORS = {
  darkyellow: '#ffd300',
  orange: '#ffa940',
  orange2: '#FD5F00',
  lightblue: '#1890ff',
  green: '#a0d911',
  purple: '#6938f1',
  red: 'red',
};

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

export function useChartColors() {
  return CHART_COLORS;
}

export function useThemeColors() {
  const { theme } = useConfigState();

  return useMemo(() => {
    return {
      foreground: getCssVar('--foreground'),
      mutedForeground: getCssVar('--muted-foreground'),
      border: getCssVar('--border'),
    };
  }, [theme]);
}
