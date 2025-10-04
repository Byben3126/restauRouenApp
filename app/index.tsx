import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuth } from '@/context/Auth';

const Index = () => {

    const { providerIsInit, user } = useAuth()

    
    if (!providerIsInit) return null;
    //le providerAuth gere les redirection




    if (user) {
        //return  <Redirect href="/landing" />;
        // return <Redirect href="/dashboard_admin"/>;
        // return <Redirect href="/dashboard_user"/>;
        // return <Redirect href="/onboarding"/>;
        // return <Redirect href="/landing_admin"/>;
    }else{
        //return <Redirect href="/landing" />;
    }
  
};

export default Index;