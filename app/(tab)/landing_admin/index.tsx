import { StyleSheet } from 'react-native'
import React, { ReactNode }  from 'react'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import RestaurantRegister from './RestaurantRegister';
import RestaurantLocation from './RestaurantLocation'
import { NavigatorScreenParams } from '@react-navigation/native';

interface LandingPageProps {
}

export type RootStackParamList = {
  RestaurantRegister: undefined;
  RestaurantLocation: {
    restaurantData: {
      buisnnessName: string;
      googleMyBuisnessLink: string | null;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    

        <Stack.Navigator 
          initialRouteName="RestaurantRegister"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' }
          }}
          >
          <Stack.Screen name="RestaurantRegister" component={RestaurantRegister} />
          <Stack.Screen name="RestaurantLocation" component={RestaurantLocation} />
        </Stack.Navigator>
    
    
  )
}

export default LandingPage

const styles = StyleSheet.create({
 
})