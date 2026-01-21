import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import SplashScreen from './src/screens/SplashScreen';

// Keep the native splash screen visible while we load
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <>
      <SplashScreen />
      <StatusBar style="light" />
    </>
  );
}
