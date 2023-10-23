import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aracnereport.aracne3',
  appName: 'Aracne 3',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    BackgroundRunner: {
      label: 'com.aracnereport.aracne3.check',
      src: 'runners/runner.js',
      event: 'checkIn',
      repeat: true,
      interval: 1,
      autoStart: true,
    },
    SplashScreen: {
      launchShowDuration: 0
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }, 
  }
  // server: { allowNavigation: ['aracnewsr.salesland.net'] },
  // server: { hostname: 'localhost:8100', androidScheme: 'http' },
};

export default config;
