import { useConfigState } from '../context/ConfigContext';

export const useThemeMode = () => {
  const { theme } = useConfigState();
  return theme as 'dark' | 'light';
};
