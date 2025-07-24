import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Header } from '@/components/molecules';

export default function Layout() {


  useEffect(() => {
    SecureStore.setItemAsync('currentDashboard', 'dashboard_user');
  }, []); 

  return (
    <Stack
      initialRouteName='(tabs)/main' // Assurez-vous que cette route est correcte
      screenOptions={{

          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
      }}
    >
     <Stack.Screen 
        name="(tabs)/restaurant/[id]" 
        options={({ navigation }) => ({ // Récupérer navigation depuis options
          headerShown: true,
          headerTransparent: false,
          headerTitle: '',
          headerLeft: () => (
            <Header.HeaderStack.Left navigation={navigation}/>
          ),
        })}
      />

       <Stack.Screen 
        name="(tabs)/notifications/index" 
        options={({ navigation }) => ({ // Récupérer navigation depuis options
          headerShown: true,
          headerTransparent: false,
          headerTitle: '',
          headerLeft: () => (
            <Header.HeaderStack.Left navigation={navigation}/>
          ),
        })}
      />

    </Stack>
  );
}