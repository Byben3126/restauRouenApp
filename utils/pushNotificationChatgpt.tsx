import { useState, useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { LogLevel, OneSignal, NotificationWillDisplayEvent, NotificationClickEvent, OSNotification } from 'react-native-onesignal';

// Hook pour gérer les notifications
interface UsePushNotificationsProps {
  userId?: number;
  clickNotification: (notification: OSNotification) => void;
}
export const usePushNotifications = ({userId, clickNotification}: UsePushNotificationsProps) => {
  
  const [notification, setNotification] = useState<OSNotification>();

  //ref
  const onesignalId = useRef<string | null>(null)


  const clickNativeNotification = useCallback((event:NotificationClickEvent) => {
    console.log('Notification cliquée :', event);
    clickNotification(event.notification)
  },[clickNotification,])

  const foregroundWillDisplay = useCallback((event:NotificationWillDisplayEvent) => {
    console.log('Notification reçue :', event);
    setNotification(event.notification)
  },[])

  useEffect(() => {
    console.log("initOneSingal useEffect")
    const initOneSingal = async ()=> {
      console.log("initOneSingal", userId)
      const oneSignalAppId = Constants?.expoConfig?.extra?.oneSignalAppId;
      if (oneSignalAppId) {
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.initialize(oneSignalAppId)

        OneSignal.Notifications.addEventListener('click', clickNativeNotification);
        OneSignal.Notifications.addEventListener('foregroundWillDisplay', foregroundWillDisplay)
        OneSignal.Notifications.addEventListener('permissionChange', async () => {
          const newId = await OneSignal.User.getOnesignalId();
          console.log('OneSignal permissionChange', newId);
          if (newId) OneSignal.login(String(userId))
        });

        OneSignal.Notifications.requestPermission(true);

        
     
        console.log("OneSignal Id1")
        onesignalId.current = await OneSignal.User.getOnesignalId()
        console.log("OneSignal Id2", onesignalId.current)
       

        if (onesignalId.current) {
          console.log('OneSignal login', userId)
          OneSignal.login(String(userId))
        }
      }
    }

    if (userId) {
      initOneSingal()
    }else{
      OneSignal.logout();
    }
 

    return () => {
      OneSignal.Notifications.removeEventListener('click', clickNativeNotification)
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay', foregroundWillDisplay)
    };
  }, [userId]);


  return { onesignalId, notification };
};