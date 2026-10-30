import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { VeryfyLogoMark } from './src/components/icons/VeryfyLogoMark';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular: require('./assets/fonts/Geist_400Regular.ttf'),
    Geist_500Medium: require('./assets/fonts/Geist_500Medium.ttf'),
    Geist_600SemiBold: require('./assets/fonts/Geist_600SemiBold.ttf'),
    Geist_700Bold: require('./assets/fonts/Geist_700Bold.ttf'),
  });

  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Inject Google Fonts stylesheet on web as progressive enhancement
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const existingLink = document.getElementById('veryfy-google-fonts');
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'veryfy-google-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap';
        document.head.appendChild(link);
      }
    }

    // Safety timeout: never block app startup for more than 1500ms
    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const isAppReady = fontsLoaded || !!fontError || timedOut;

  if (!isAppReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#3D52D5' }}>
        <StatusBar style="light" />
        <VeryfyLogoMark width={108} height={118} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
