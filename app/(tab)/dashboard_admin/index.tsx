import { SafeAreaView, StyleSheet } from "react-native";
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import {  WebSocketProvider, BottomSheetRefProvider } from "@/context";
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/atoms'; 
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { screenOptions } from '@/constants/Tab'

import Home from './Home';
import Users from './Users';
import QrCode from './QrCode';
import Profil from './Profil';
import Settings from './Settings';

import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import Localisation from "@/components/organisms/RestaurantProfil/Localisation";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

interface MainProps {
}


export type RootStackParamList = {
  MainTabs: undefined;
  Localisation: {
    defaultCoordinates: {latitude:Float,longitude:Float},
    validateCb: ({navigation,route}:LocalisationScreenProps, coordinates:{latitude:Float,longitude:Float})=>void
    backCb?: ({navigation,route}:LocalisationScreenProps)=>void
  };
};

export type RootTabParamList = {
  Home: undefined;
  Users: {
    autoFocusInput?: boolean;
  };
  Scan: undefined;
  Profil: undefined;
  settings: undefined;
};


const Tab = createMaterialTopTabNavigator<RootTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator: React.FC<MainProps> = () => {

  return (
    
    <WebSocketProvider>
      <LinearGradient style={styles.linearGradient} colors={['#fff', '#fff']}>
        {/* <BottomSheetModalProvider>
          <BottomSheetRefProvider> */}
            
              <Tab.Navigator 
                initialRouteName="Home" 
                tabBarPosition="bottom" 
                screenOptions={screenOptions}
              >

                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused, color }) => <Icon.RR name={focused ? "home" : "home"} color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor} size={18} style={styles.iconTab}/>
                  }}
                  component={Home}
                />

                <Tab.Screen
                  name="Users"
                  options={{
                    tabBarLabel: "Clients",
                    tabBarIcon: ({ focused, color }) => <Icon.RR name={focused ? "users" : "users"} color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor} size={18} style={styles.iconTab}/>
                  }}
                  component={Users}
                />

                <Tab.Screen
                  name="Scan"
                  options={{
                    tabBarLabel: "Scan",
                    tabBarIcon: ({ focused, color }) => <Icon.RR name={focused ? "scan" : "scan"} color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor} size={18} style={styles.iconTab}/>
                  }}
                  component={QrCode}
                />

                <Tab.Screen
                  name="Profil"
                  options={{
                    tabBarLabel: "Profil",
                    tabBarIcon: ({ focused, color }) => <Icon.RR name={focused ? "user" : "user"} color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor} size={18} style={styles.iconTab}/>
                  }}
                  component={Profil}
                />

                <Tab.Screen
                  name="settings"
                  options={{
                    tabBarLabel: "Réglages",
                    tabBarIcon: ({ focused, color }) => <Icon.RR name={focused ? "settings" : "settings"} color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor} size={18} style={styles.iconTab}/>
                  }}
                  component={Settings}
                />

               
              </Tab.Navigator>
              <SafeAreaView/>
           
          {/* </BottomSheetRefProvider>
        </BottomSheetModalProvider> */}
      </LinearGradient>
    </WebSocketProvider>
  )
}

const Main = () => {
  
  useEffect(() => {
    SecureStore.setItemAsync('currentDashboard', 'dashboard_admin');
  }, []); 


  return (
    <WebSocketProvider>
      <LinearGradient style={styles.linearGradient} colors={["#F8FAFC", "#F8FAFC"]}>
  
          <RootStack.Navigator>
            {/* Groupe principal */}
            <RootStack.Group>
              <RootStack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
              />
            </RootStack.Group>

            {/* Groupe modal */}
            <RootStack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
              <RootStack.Screen
                name="Localisation"
                component={LocalisationScreen}
                options={{ headerShown: false }}
              />
            </RootStack.Group>
          </RootStack.Navigator>
        
      </LinearGradient>
    </WebSocketProvider>
  );
};


type LocalisationScreenProps = NativeStackScreenProps<RootStackParamList, 'Localisation'>;

const LocalisationScreen = ({navigation, route}: LocalisationScreenProps) => {

  const validateCb = (coordinate:{latitude:Float,longitude:Float}) => {
    route.params.validateCb({navigation, route}, coordinate)
  }

  const backCb = () => {
    route.params.backCb && route.params.backCb({navigation, route})
  }


  return (
    <>
      <Localisation 
        defaultCoordinates={route.params.defaultCoordinates} 
        validateCb={validateCb}
        backCb={route.params.backCb && backCb}
      />
    </>
    
  )
}


export default Main

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },

    iconTab : {
      width : 30,
      textAlign: 'center',
      lineHeight: 18
    },
})