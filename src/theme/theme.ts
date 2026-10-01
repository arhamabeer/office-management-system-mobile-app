import { useColorScheme } from 'react-native';
import { rnLightTheme, rnDarkTheme, type RnTheme } from '@ems/config';

/** Resolve the BrainCrop RN theme from the device color scheme (PLAN.md §6). */
export function useTheme(): RnTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? rnDarkTheme : rnLightTheme;
}
