import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';


import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const screenTitles: Record<string, string> = {
    car: "Car Details",
    maintenance: "Maintenance",
    gaslog: "Gas Log"
  }

  const activeScreen = segments[segments.length - 1];
  const headerTitle = screenTitles[activeScreen] || "Default Screen";
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'All Cars', headerShown: false }} />
        <Stack.Screen name="addcar" options={{ title: 'Add New Car', headerShown: true }} />
        <Stack.Screen name="screens" options={{ title: headerTitle, headerShown: true }} />
        <Stack.Screen name="+not-found"  />
      </Stack>
    </ThemeProvider>
  );
}
