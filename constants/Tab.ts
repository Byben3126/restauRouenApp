import { Platform } from 'react-native'
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';

export const screenOptions:MaterialTopTabNavigationOptions  = {
    tabBarShowLabel: true,
    tabBarActiveTintColor: "#000",
    tabBarInactiveTintColor: "#9E9D9D",
    tabBarStyle: {
    
      borderTopWidth: 0.2,
      borderColor: "#ffffff",
      backgroundColor: 'transport',
    
      justifyContent:"center",
     
      
      ...Platform.select({
        ios: {
          marginBottom: 0, // Adjust as needed for iOS
        
        },
        android: {
          paddingBottom: 0, // Adjust as needed for iOS
        },
      }),

    },

    tabBarContentContainerStyle: {
      justifyContent: 'space-evenly',
      paddingHorizontal: 10,
      height: 50
    },

    tabBarItemStyle: {
      width: "auto",
      position: 'relative',
      top: 9
    },

    tabBarIndicatorStyle: {
      height: 0,
      display:'none'
    },

    // tabBarIconStyle: {
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   width: 18,
    //   height: 18,
    //   margin: 0,
   
    // },

    tabBarLabelStyle: { 
      fontSize: 9,
      lineHeight: 9,
      margin:0,
      marginTop: 3
    },      
  }