import { SafeAreaView } from "react-native";
import { screenOptions } from '@/constants/Tab'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Icon } from '@/components/atoms';

export type TabParamList = {
  '(tabs)/Home': undefined;
  '(tabs)/Offers': undefined;
  '(tabs)/QrCode': undefined;
  '(tabs)/Map': {
    autoFocusInput?: boolean;
  };
  '(tabs)/Settings': undefined;
};

const { Navigator } = createMaterialTopTabNavigator<TabParamList>();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  any,
  any
>(Navigator);

const tabBarIcons: Record<keyof TabParamList, string> = {
  "(tabs)/Home": "home",
  "(tabs)/Offers": "gift",
  "(tabs)/QrCode": "qrcode",
  "(tabs)/Map": "map",
  "(tabs)/Settings": "settings",
}


export default function Layout() {
  return (
  <>
    <MaterialTopTabs
      initialRouteName="(tabs)/Home" 
      tabBarPosition="bottom" 
      screenOptions={({route, navigation, theme})=>({
        tabBarIcon : ({ focused, color }) => (<Icon.RR 
            name={route.name && tabBarIcons[route.name as keyof typeof tabBarIcons] || "home"}
            color={focused ? screenOptions.tabBarActiveTintColor : screenOptions.tabBarInactiveTintColor}
            size={18}
        />),
        tabBarLabel: route.name.replace('(tabs)/', ''),
        ...screenOptions
      })}
    >
      <MaterialTopTabs.Screen
        name="(tabs)/Home"
        options={{
          tabBarLabel: "Home",
        }}
      />
      <MaterialTopTabs.Screen
        name="(tabs)/Offers"
        options={{
          tabBarLabel: "Offers",
        }}
      />
      <MaterialTopTabs.Screen
        name="(tabs)/QrCode"
        options={{
          tabBarLabel: "QrCode",
        }}
      />
      <MaterialTopTabs.Screen
        name="(tabs)/Map"
        options={{
          tabBarLabel: "Map",
        }}
      />
      <MaterialTopTabs.Screen
        name="(tabs)/Settings"
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </MaterialTopTabs>
    <SafeAreaView style={{ backgroundColor: "#FFF" }}/>
  </>
    
    
  
  );
}