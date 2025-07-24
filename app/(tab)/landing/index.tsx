import { StyleSheet } from 'react-native'
import React, { ReactNode }  from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './Welcome';
import Register from './Register';
import Login from './Login';
import SecuritySendCode from './SecuritySendCode';
import ForgotPassword from './ForgotPassword'
import NewPassword from './NewPassword'

interface LandingPageProps {
}

const Stack = createNativeStackNavigator();

const LandingPage: React.FC<LandingPageProps> = () => {
  return (
    

        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' }
          }}
          >

          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
          <Stack.Screen name="SecuritySendCode" component={SecuritySendCode} />
        </Stack.Navigator>
    
    
  )
}

export default LandingPage

const styles = StyleSheet.create({
 
})