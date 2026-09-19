import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.agri.arms',
  appName: 'ARMS Agri Retail',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#14532d",
      showSpinner: true,
      spinnerColor: "#86efac"
    }
  }
};

export default config;
