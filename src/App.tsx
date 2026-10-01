import { StatusBar, useColorScheme, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { rnLightTheme, rnDarkTheme } from '@ems/config';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppTabs from './navigation/AppTabs';
import LoginScreen from './screens/LoginScreen';

function Root() {
  const isDark = useColorScheme() === 'dark';
  const brand = isDark ? rnDarkTheme : rnLightTheme;
  const base = isDark ? DarkTheme : DefaultTheme;
  const { user, loading } = useAuth();

  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: brand.colors.primary,
      background: brand.colors.bg,
      card: brand.colors.surface,
      text: brand.colors.text,
      border: brand.colors.border,
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: brand.colors.bg }}>
          <ActivityIndicator color={brand.colors.primary} />
        </View>
      ) : user ? (
        <NavigationContainer theme={navTheme}>
          <AppTabs />
        </NavigationContainer>
      ) : (
        <LoginScreen />
      )}
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
