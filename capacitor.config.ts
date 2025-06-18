
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.c4540e66c76042bdbadb46efada5b2f3',
  appName: 'Fiestas Patronales',
  webDir: 'dist',
  server: {
    url: 'https://c4540e66-c760-42bd-badb-46efada5b2f3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
