
import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'default'>('default');

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsSupported(true);
      initializePushNotifications();
    } else if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission as 'granted' | 'denied' | 'default');
    }
  }, []);

  const initializePushNotifications = async () => {
    try {
      const result = await PushNotifications.checkPermissions();
      setPermission(result.receive as 'granted' | 'denied' | 'default');

      if (result.receive === 'prompt') {
        const permissionResult = await PushNotifications.requestPermissions();
        setPermission(permissionResult.receive as 'granted' | 'denied' | 'default');
      }

      if (result.receive === 'granted') {
        await PushNotifications.register();
      }

      // Listen for registration token
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token: ' + token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push registration error: ', error.error);
      });

      // Listen for push notifications
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received: ', notification);
      });

      // Listen for notification actions
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (Capacitor.isNativePlatform()) {
      try {
        const result = await PushNotifications.requestPermissions();
        setPermission(result.receive as 'granted' | 'denied' | 'default');
        if (result.receive === 'granted') {
          await PushNotifications.register();
        }
        return result.receive === 'granted';
      } catch (error) {
        console.error('Error requesting push notification permission:', error);
        return false;
      }
    } else if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result as 'granted' | 'denied' | 'default');
      return result === 'granted';
    }
    return false;
  };

  const scheduleNotification = (title: string, body: string, scheduledTime: Date) => {
    if (!isSupported || permission !== 'granted') return;

    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        if (Capacitor.isNativePlatform()) {
          // Para notificaciones nativas, necesitarías un plugin adicional para scheduling
          console.log('Would send native notification:', { title, body });
        } else if ('Notification' in window) {
          new Notification(title, {
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-192x192.png'
          });
        }
      }, delay);
    }
  };

  return {
    isSupported,
    permission,
    requestPermission,
    scheduleNotification
  };
};
