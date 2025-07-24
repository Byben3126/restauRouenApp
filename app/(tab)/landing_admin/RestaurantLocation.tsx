import { StyleSheet, Text, View } from 'react-native'
import React , { useCallback } from 'react'
import Localisation from '@/components/organisms/RestaurantProfil/Localisation'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './index';
import { useLoader } from '@/context/Loader';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { createMyRestaurant } from '@/api/minted/restaurant'
import { useNotification } from '@/context/Notification';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux'; 
import { set_restaurant_data } from '@/store/slices/myRestaurant';
import { getInfoCoords } from '@/api/google';
import type { InfoCoordsResult } from '@/types/google/adress.types';
type LocationProps = NativeStackScreenProps<RootStackParamList, 'RestaurantLocation'>;


const RestaurantLocation = ({navigation, route}: LocationProps) => {

  const { restaurantData } = route.params;
  
  const { setLoader } = useLoader()
  const { newNotification } = useNotification()
  const dispatch = useDispatch();
  const router = useRouter();

  const handleValidateLocation = useCallback( async (coordinates:{latitude:Float,longitude:Float}) => {
    setLoader(true)
    try {
      const payload = {
        name: restaurantData.buisnnessName,
        googleMyBuisnessLink: restaurantData.googleMyBuisnessLink,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        country: 'undefined',
        city: 'undefined',
      }


      const res:InfoCoordsResult = await getInfoCoords(coordinates)
      
      if (res.results && res.results.length && res.results[0].address_components) {
        payload.country = res.results[0].address_components.find((component) => component.types.includes('country'))?.long_name || 'undefined'
        payload.city = res.results[0].address_components.find((component) => component.types.includes('locality'))?.long_name || 'undefined'
      }
      console.log('payload',JSON.stringify(payload))
      const {data} = await createMyRestaurant(payload)
  
      dispatch(set_restaurant_data(data))
      router.push('/dashboard_admin')
      
    } catch (error) {
      newNotification({
        title: 'Enregistrement impossible',
        subTitle: "Veuillez contacter le support",
      })
      router.push('/dashboard_user')
    }
    //envoi un requestion a l'api pour creer son restaurant
    setLoader(false)
  }, []);

  return (
    <View>
      <Localisation 
        validateCb={handleValidateLocation}
      />
    </View>
    
  )
}

export default RestaurantLocation

const styles = StyleSheet.create({})