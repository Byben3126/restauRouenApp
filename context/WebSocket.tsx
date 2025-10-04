import React, { createContext, useContext, ReactNode, useEffect,  useState, useCallback, useRef}  from 'react'
import * as SecureStore from 'expo-secure-store';
import { AppState, AppStateStatus } from 'react-native';

const WEBSOCKET_URL = `wss://${process.env.EXPO_PUBLIC_API_URL?.replace(/^https?:\/\//, '')}/ws`;
console.log("WEBSOCKET_URL",WEBSOCKET_URL)

interface WebSocketProviderProps {
    children: ReactNode
}

interface WebSocketContextProps {
  subscribe: (eventName: string, handler: MessageHandler) => string; // Retourne un ID d'abonnement
  unsubscribe: (subscribeId: string) => void;
  simulateMessage: (type: string, data: Object) => void;
}

type MessageHandler = (data: any) => void;

type WebSocketMessage = {
  eventName: string;
  data: any;
};

const WebSocketContext = createContext<WebSocketContextProps | undefined>(undefined);

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {

    const ws = useRef<WebSocket | null>(null);
    const idCounter = useRef(0);
    const messageHandlers = useRef<{ [key: string]: { [idSuscriber: string]: MessageHandler} }>({});

    const connectWebSocket = useCallback(async () => {
        console.log("connectWebSocket")

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log('WebSocket déjà connecté');
          return;
        }
   
        // Remplacez l'IP par l'adresse de votre serveur FastAPI
        const token = await SecureStore.getItemAsync('access_token')

        if (token) {
            const socket = new WebSocket(WEBSOCKET_URL, [token]);

            socket.onopen = () => {
              console.log('WebSocket','✅ Connexion WebSocket ouverte')
              ws.current = socket;
            };
            socket.onmessage = (event) => receveidMessage(event);
            socket.onerror = (error) => {
              console.log('WebSocket', '❌ Erreur WebSocket :', error)
              ws.current = null;
            };
            socket.onclose = () => {
              console.log('WebSocket', '🔴  Connexion WebSocket fermée')
              ws.current = null;
            };
  
        }
    }, [])

    const subscribe = useCallback((eventName: string, handler: MessageHandler) => {
        eventName = eventName.replace('-', '_');
        const subscribeId = `${eventName}-${idCounter.current++}`; 

        messageHandlers.current = {
          ...messageHandlers.current,
          [eventName]: {
            ...(messageHandlers.current[eventName] || {}), 
            [subscribeId]: handler
          }
        }

        console.log("subscribe",messageHandlers.current)

        return subscribeId
    }, []);

    // Fonction pour se désabonner d'un type de message (mémorisée avec useCallback)
    const unsubscribe = useCallback((subscribeId: string) => {
        const eventName = subscribeId.split('-')[0]

        const updatedHandlers = { ...messageHandlers.current[eventName] };
        delete updatedHandlers[subscribeId];

        messageHandlers.current = {
            ...messageHandlers.current,
            [eventName]: updatedHandlers,
        };
        console.log("unsubscribe",messageHandlers.current)
    }, []);

    const receveidMessage = useCallback((event:WebSocketMessageEvent) => {
      try {
          console.log("receveidMessage",messageHandlers.current)
          const packet: WebSocketMessage = JSON.parse(event.data);
          const handlers = Object.values(messageHandlers.current[packet.eventName] || {});
          handlers.forEach((handler) => handler(packet.data));
      } catch (error) {
          console.error('Erreur lors du parsing du message :', error);
      }
    },[])

    const simulateMessage = useCallback((eventName: string, data:object) => {
      eventName = eventName.replace('-', '_');
      const handlers = Object.values(messageHandlers.current[eventName] || {});
      handlers.forEach((handler) => handler(data));
    },[])

    // use Effect
    useEffect(() => {

      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        console.log("handleAppStateChange", nextAppState, ws?.current?.readyState, WebSocket.CLOSED)
        if (nextAppState === 'active' && (!ws.current || ws.current.readyState === WebSocket.CLOSED)) {
          connectWebSocket();
        }
      };
      const eventAppState = AppState.addEventListener('change', handleAppStateChange);

      if (!ws.current) connectWebSocket();

      return () => {
        eventAppState.remove();
        console.log("connectWebSocket close", ws.current)
        if (ws.current) ws.current.close();
      };
    }, []);

    

  return (
    <WebSocketContext.Provider value={{subscribe, unsubscribe, simulateMessage}}>
      {children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketProvider

export const useWebSocket = (): WebSocketContextProps => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

