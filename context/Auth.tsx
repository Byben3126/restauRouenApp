import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { refreshToken as refreshTokenApi } from '@/api/minted/auth';
import * as Types from '@/types'
import * as SecureStore from 'expo-secure-store';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, set_user } from '@/store/slices/user';
import { fetchMyRestaurant, set_restaurant_data } from '@/store/slices/myRestaurant';
import { check_subscription_from_token } from '@/store/slices/subscription';
import { Redirect } from 'expo-router';

import { useNavigation } from '@react-navigation/native';
import { useRouter, usePathname } from 'expo-router';
interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextProps {
  login: (user: Types.User, access_token:string, refresh_token:string) => void;
  logout: () => void;
  setUser: (user:Types.User|null) => void;
  refreshToken: () => void;
  providerIsInit: boolean;
  user: Types.User | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  
  const user = useSelector((state:Types.Store) => state.user.value);
  const [providerIsInit, setProviderInitState] = useState(false)
  const dispatch = useDispatch<Types.Dispatch>()
  const navigation = useNavigation();
  const router = useRouter()
  const pathname = usePathname();;

  const setUser = (user:Types.User|null) => {
    dispatch(set_user(user))
  }

  const login = async (user: Types.User, access_token:string, refresh_token:string) => {
    await SecureStore.setItemAsync('access_token', access_token);
    await SecureStore.setItemAsync('refresh_token', refresh_token);
    dispatch(check_subscription_from_token(access_token))
    await getMyRestaurant()
    setUser(user)
  }

  const logout = async() => {
    setUser(null)
    dispatch(set_restaurant_data(null))
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('access_token');
  }

  const getUser = async() => {
    await dispatch(fetchUser())
  }

  const getMyRestaurant = async() => {
    await dispatch(fetchMyRestaurant())
  }
  const refreshToken = useCallback(async()=>{
    const refresh_token:string|null = await SecureStore.getItemAsync('refresh_token')
    if (!refresh_token)  throw new Error('refresh_token not found');

    const {data} = await refreshTokenApi(refresh_token)
    if (data.access_token && data.refresh_token) {
      await SecureStore.setItemAsync('refresh_token', data.refresh_token);
      await SecureStore.setItemAsync('access_token', data.access_token);
      dispatch(check_subscription_from_token(data.access_token))
    }else{
      throw new Error('Invalid response structure');
    }
  },[])

  const init = useCallback(async() => {
    const token = await SecureStore.getItemAsync('access_token')
    if (token)  dispatch(check_subscription_from_token(token))
    await getUser()
    await getMyRestaurant()
    setProviderInitState(true)
  },[])

  useEffect(()=>{
    init()
  },[])

  useEffect(()=>{
    console.log('savedDashboard', pathname)
    const handleRedirection = async () => {
      if (!providerIsInit) return;
      // if (pathname == '/') return

      if (user) {
        console.log('clemclem652')
        if (!pathname.startsWith('/dashboard') && !pathname.startsWith('/onboarding/Client')) {
          const savedDashboard = await SecureStore.getItemAsync('currentDashboard');
          console.log('savedDashboard', savedDashboard)
          if (savedDashboard === 'dashboard_admin') {
            router.replace('/dashboard_admin');
          } else {
            router.replace('/dashboard_user');
          }
        }
      }else if(!pathname.startsWith('/landing')){
        console.log('user not found, redirecting to landing')
        router.replace('/landing');
      }
    }
    
    handleRedirection();
  },[user, providerIsInit])

  return (
    <AuthContext.Provider value={{providerIsInit, user, login, setUser, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

