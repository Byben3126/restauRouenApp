import { StyleSheet, SafeAreaView,FlatList, View, Text,Animated, TouchableOpacity, PanResponder } from 'react-native'
import React, { useState, useEffect, useRef, createContext, useContext, ReactNode, use }  from 'react'
import { Container, Icon } from '@/components/atoms'
import { Toast } from '@/components/molecules/Notification'
import { usePushNotifications } from '@/utils/pushNotificationChatgpt'
import { OSNotification } from 'react-native-onesignal';
import { Notification } from '@/types'
import { useAuth } from './Auth'
import { useRouter, usePathname } from 'expo-router'

interface NotificationProviderProps {
  children: ReactNode
}

export interface NotificationContextProps {
  newNotification: (notification: Notification) => void;
  clickNotification: (notification: OSNotification | Notification) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  
  const [notifications, setNotification] = useState([]);
  const [listIndex, setListIndex] = useState(-1);
  const [timeStartDrag, setTimeStartDrag] = useState(0);
  const [timeoutHide, setTimeoutHide] = useState(null);

  //ref
  const scrollXIndex = useRef(new Animated.Value(-1)).current;
  const scrollXAnimated = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current; 
  const clickedNotificationPedding = useRef<OSNotification | Notification | null>(null);
  //context
  const { user } = useAuth()
  const router = useRouter();
  const pathname = usePathname();
  
  const newNotification = (notificationConfig = {}) => {
    setListIndex((prevIndex) => {
      setNotification((current) => {
        return [...current.slice(0,prevIndex+1),{id:Date.now(), ...notificationConfig}]
      })
      const nextIndex = prevIndex+1;
      scrollXIndex.setValue(nextIndex); 
     
      Animated.spring(dragY, {
        toValue: 0, // Revenir à la position initiale
        stiffness: 90, // Ajuste la rigidité
        damping: 10,   // Plus de damping pour ralentir la vibration
        mass: 1,       // Masse pour moduler l'inertie
        useNativeDriver: true,
      }).start();

      return nextIndex
    });
    refreshTimeoutHide()
   
  };

  const refreshTimeoutHide = function() {
    console.log('refreshTimeoutHide')
    setTimeoutHide((prevTimeoutId) => {
      if (prevTimeoutId) clearTimeout(prevTimeoutId)
      return setTimeout(() => {
        hideNotifications()
      }, 5000);
    })
  }

  const clearTimeoutHide = function() {
    console.log('clearTimeoutHide')
    setTimeoutHide((prevTimeoutId) => {
      if (prevTimeoutId) clearTimeout(prevTimeoutId)
      return null
    })
  }
  
  const removeNotification = (id) => {
    console.log('removeNotification')
    const nextIndex = listIndex-1;
    if (nextIndex >=0) {
      scrollXIndex.setValue(nextIndex); 
      setListIndex(nextIndex);
      refreshTimeoutHide()
    }else{
      hideNotifications()
    }
    
  }

  const hideNotifications = () => {

    clearTimeoutHide()

    Animated.timing(dragY, {
      toValue: -280, // Revenir à la position initiale
      duration: 200, // Ajuste la rigidité
      useNativeDriver: true,
    }).start(()=> {
      console.log('setListIndex a -1')
      scrollXIndex.setValue(-1); 
      setListIndex(-1);
    });
    
    console.log("hideNotifications",listIndex)
  }

  const clickNotification = (notification:OSNotification|Notification) => {
    console.log('clickNotification', pathname)
    if (pathname == '/') {
      clickedNotificationPedding.current = notification;
      return;
    }
    if (notification?.additionalData) {
      switch (notification.additionalData.type) {
        case 'new_promotion':
        case 'new_reward':
          if (notification.additionalData?.restaurant_id) {
            console.log('clemclem651')
            
            router[pathname.startsWith('/dashboard_user/restaurant/') ? 'replace' : 'navigate']({
              pathname: '/dashboard_user/restaurant/[id]',
              params: {
                id: notification.additionalData.restaurant_id,
              }
            });
            if ('id' in notification) removeNotification(notification.id)
          }
          break;
      }
    }
  }

  const { notification } = usePushNotifications({
    userId : user?.id, 
    clickNotification
  });
  
  useEffect(() => {
    // console.log("expoPushToken",expoPushToken)
    Animated.timing(scrollXAnimated, {
      toValue: scrollXIndex,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [listIndex]);

  useEffect(() => {
    if (notification) {
      console.log("useEffectnotification", notification, notification?.attachments?.profile_picture ?? null)
      newNotification({
        title: notification.title,
        subTitle: notification.body,
        urlImage: notification?.attachments?.profile_picture ?? null,
        additionalData: notification?.additionalData
      })
    }
  },[notification])

  useEffect(() => { 
    if (pathname !== '/' && clickedNotificationPedding.current) {
      clickNotification(clickedNotificationPedding.current)
      clickedNotificationPedding.current = null;
    }
  },[ pathname, clickedNotificationPedding.current])

  // Gestion du drag

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event,other) => (false),
    onStartShouldSetPanResponderCapture: (event) => {
      setTimeStartDrag(event.timeStamp)
      return false
    },
    onMoveShouldSetPanResponder: (event) => {
      clearTimeoutHide()
      return event.timeStamp - timeStartDrag > 300
    }, 
    onPanResponderMove: (_, gestureState) => {
      dragY.setValue(Math.min(70,gestureState.dy));
    },

    onPanResponderRelease: (_, gestureState) => {
      console.log('onPanResponderRelease', gestureState.dy)
      if (gestureState.dy < -10) {
        hideNotifications()
      }else{
        Animated.spring(dragY, {
          toValue: 0, // Revenir à la position initiale
          stiffness: 90, // Ajuste la rigidité
          damping: 10,   // Plus de damping pour ralentir la vibration
          mass: 1,       // Masse pour moduler l'inertie
          useNativeDriver: true,
        }).start();
      }
      refreshTimeoutHide()
      
    },
  });

  const translateYFlatList = dragY.interpolate({
    inputRange: [-100, 0, 100], // Autoriser uniquement les valeurs ≤ 0
    outputRange: [-100, 0, 0], // Sortie reste à 0 si dragY > 0
  });


  return (
    <NotificationContext.Provider value={{newNotification, clickNotification}}>
      <Container.Column style={styles.overlay}>
        <SafeAreaView {...panResponder.panHandlers}>
        <Animated.View
          style={{
            transform: [{ translateY: Animated.divide(translateYFlatList, 2) }],
   
            // height: 0=
          }}
        >

          {notifications.map((item, index)=> {
            const top = dragY.interpolate({
              inputRange: [-50, 0, 100], // Adaptez selon le déplacement attendu
              outputRange: [-7, 0, 2],
              extrapolate: 'clamp',
            });
            
            const inputRange = [index-1, index-0.999, index-0.5, index, index+1, index + 2, index + 3];
            const translateY = scrollXAnimated.interpolate({
              inputRange,
              outputRange: [-100,-21, -21, 0, 7, 14, 14],
            });
            
            const scale = scrollXAnimated.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 1, 0.97, 0.9409, 0],
              extrapolate: 'clamp'
            });
            
            const opacity = scrollXAnimated.interpolate({
              inputRange,
              outputRange: [0, 0, 0.5, 1, 1, 1, 1],
            });
            
            return (
              <Animated.View
                style={{
                  position: 'absolute',
                  transform: [
                    { translateY:index < listIndex ? Animated.multiply(top, listIndex - index) : 0 }
                  ],
                  width: "100%",
                }}
              >
              <Animated.View
                style={{
                  position: 'absolute',
                  transform: [
                    { scale },
                    { translateY }
                  ],
                  opacity:opacity,
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (index == listIndex) {
                      clickNotification(item)
                     
                    }
                  }}
                >
                  <Toast {...item} remove={()=>removeNotification(item.id)} />
                </TouchableOpacity>
              </Animated.View>
              </Animated.View>
            );
          })}
            {/* <FlatList
              data={notifications}
              keyExtractor={(item) => item.id.toString()}
              style={{
                height: 21 + 7 * (3) + 70,
                transform: [
                  { translateY: -21 },
                ],
                paddingTop:21,
              }}
              initialNumToRender={Infinity}            
              scrollEnabled={false}
              renderItem={({ item, index }) => {   
                
                const top = dragY.interpolate({
                  inputRange: [-50, 0, 100], // Adaptez selon le déplacement attendu
                  outputRange: [-7, 0, 2],
                  extrapolate: 'clamp',
                });
                
                const inputRange = [index-1, index-0.999, index-0.5, index, index+1, index + 2, index + 3];
                const translateY = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [-100,-21, -21, 0, 7, 14, 14],
                });
                
                const scale = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [1, 1, 1, 1, 0.97, 0.9409, 0],
                  extrapolate: 'clamp'
                });
                
                const opacity = scrollXAnimated.interpolate({
                  inputRange,
                  outputRange: [0, 0, 0.5, 1, 1, 1, 1],
                });
                
                return (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      transform: [
                        { translateY:index < listIndex ? Animated.multiply(top, listIndex - index) : 0 }
                      ],
                      width: "100%",
                    }}
                  >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      transform: [
                        { scale },
                        { translateY }
                      ],
                      opacity:opacity,
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        if (index == listIndex) console.log('view notification');
                      }}
                    >
                      <Toast {...item} remove={()=>removeNotification(item.id)}/>
                    </TouchableOpacity>
                  </Animated.View>
                  </Animated.View>
                );
              }}
            /> */}
        </Animated.View>
        </SafeAreaView>
      </Container.Column>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};


const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 10
  },
})



