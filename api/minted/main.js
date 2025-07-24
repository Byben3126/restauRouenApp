import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { refreshToken } from './auth';
import store from '@/store';
import { set_user } from '@/store/slices/user';
import { check_subscription_from_token } from '@/store/slices/subscription';

const api = axios.create({
  baseURL: 'https://rr.clement-guilloux.fr/api',//'https://allegedly-advanced-bedbug.ngrok-free.app', //'http://MacBook-Pro-de-Clement.local:8000',
  timeout: 60000,
});

// Middleware global pour gérer les erreurs
api.interceptors.response.use(
  
  (response) => {
    return response; // Retourne la réponse si tout va bien
  },
  
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      console.log('interceptors', status)
      if (status === 401) {
        if (error.config.url == "/refresh" || error.config._retry) {
          store.dispatch(set_user(null));
          return Promise.reject(error);
        }
        
        try {
          const refresh_token = await SecureStore.getItemAsync('refresh_token')
          if (!refresh_token)  throw new Error('refresh_token not found');

          const {data} = await refreshToken(refresh_token)
          if (data.access_token && data.refresh_token) {
            await SecureStore.setItemAsync('refresh_token', data.refresh_token);
            await SecureStore.setItemAsync('access_token', data.access_token);
            store.dispatch(check_subscription_from_token(data.access_token));
            const config = error.config
            config.headers.Authorization = `Bearer ${data.access_token}`
            config._retry = true;
            const retryResponse = await api.request(config);
            return retryResponse

          }else{
            throw new Error('Invalid response structure');
          }
        } catch (error) {
          await SecureStore.deleteItemAsync('refresh_token');
          await SecureStore.deleteItemAsync('access_token');
          store.dispatch(set_user(null));
        }
        
        
      } else if (status >= 500) {
        console.error('Erreur serveur : ', status);
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur.',error.request);
    } else {
      console.error('Erreur lors de la requête : ', error.message);
    }
    
    return Promise.reject(error); // Rejette l'erreur pour le traitement local
  }
);

const apiRequest = async (method, url, data = null, params = null, needAuthenticate = false ,headers = {}) => {
  if (!headers) {
    headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }
  try {
    if (needAuthenticate) {
      const token = await SecureStore.getItemAsync('access_token')
      headers = {
        ...headers,
        Authorization: `Bearer ${token}`,
      }
    }
    
    const response = await api({
      method,
      url,
      data,
      headers,
      params: params
    });
    return response; // Retourne les données de la réponse
  } catch (error) {
    throw error; // Propager l'erreur pour qu'elle puisse être capturée au niveau du composant
  }
};

export default apiRequest;


