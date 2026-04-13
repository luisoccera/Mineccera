import { useEffect, useState } from 'react';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Platform, View } from 'react-native';
import { MainTabs } from './src/navigation/MainTabs';
import { palette } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PressStart2P_400Regular,
  });
  const [fontTimeout, setFontTimeout] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setFontTimeout(true), 3500);
    return () => clearTimeout(timeoutId);
  }, []);

  const appReady = fontsLoaded || Boolean(fontError) || fontTimeout || Platform.OS === 'web';

  if (!appReady) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: palette.appBackground,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={palette.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.appBackground,
          border: palette.border,
          card: palette.surface,
          notification: palette.secondary,
          primary: palette.primary,
          text: palette.text,
        },
      }}
    >
      <StatusBar style="dark" />
      <MainTabs />
    </NavigationContainer>
  );
}
