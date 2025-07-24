import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Interface qui définit l'état retourné par le hook
export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken; // Le token unique pour envoyer des notifications push
  notification?: Notifications.Notification;   // La dernière notification reçue
}

// Le hook personnalisé pour gérer les notifications push
export const usePushNotifications = (): PushNotificationState => {
  // Configuration globale pour le comportement des notifications reçues
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false, // Pas de son
      shouldShowAlert: true,  // Afficher une alerte visuelle
      shouldSetBadge: false,  // Ne pas modifier le badge de l'application
    }),
  });

  // État pour stocker le token Expo Push
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  // État pour stocker la dernière notification reçue
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  // Références pour gérer les abonnements (listeners) aux événements de notifications
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  // Fonction asynchrone pour demander les permissions et enregistrer le device pour les notifications push
  async function registerForPushNotificationsAsync() {
    let token;

    // Vérifier si le périphérique est physique (les notifications push ne fonctionnent pas sur un simulateur)
    if (Device.isDevice) {
      // Vérifier si les permissions ont déjà été accordées
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si les permissions ne sont pas encore accordées, les demander
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Si toujours pas de permissions, afficher un message d'erreur et arrêter
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      // Récupérer le token Expo Push si tout est en règle
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId, // Project ID utilisé si EAS est configuré
      });
    } else {
      // Alerte si l'utilisateur utilise un simulateur
      alert("Must be using a physical device for Push notifications");
    }

    // Configurer un canal de notifications pour Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default", // Nom du canal
        importance: Notifications.AndroidImportance.MAX, // Importance maximale pour les alertes
        vibrationPattern: [0, 250, 250, 250], // Vibration
        lightColor: "#FF231F7C", // Couleur de la LED (sur certains appareils Android)
      });
    }

    // Retourner le token
    return token;
  }

  // Effet qui s'exécute une seule fois à la première montée du composant
  useEffect(() => {
    // Enregistrer le périphérique et récupérer le token
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token); // Stocker le token dans l'état
    });

    // Ajouter un listener pour écouter les notifications entrantes
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification); // Mettre à jour l'état avec la notification reçue
      });

    // Ajouter un listener pour gérer les réponses de l'utilisateur aux notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response); // Réagir aux interactions avec la notification
      });

    // Nettoyer les abonnements quand le composant est démonté
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  // Retourner le token et la notification actuelle
  return {
    expoPushToken,
    notification,
  };
};
