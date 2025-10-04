import { StyleSheet, Image, View, ScrollView, SafeAreaView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, Text, Button } from '@/components/atoms';
import Map from '@/components/organisms/RestaurantProfil/Map'
import IconLocation from '@/components/organisms/RestaurantProfil/IconLocation'
import { Input } from '@/components/molecules';
import ImageCarousel from '@/components/organisms/RestaurantProfil/ImageCarousel'
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './index';
import { useSelector } from 'react-redux';
import * as Types from '@/types'
import { useLoader } from '@/context/Loader';
import { useNotification } from '@/context/Notification';
import { updateMyRestaurant } from '@/api/minted/restaurant';
import { set_restaurant_data } from '@/store/slices/myRestaurant';
import { useDispatch } from 'react-redux';
import { getInfoCoords } from '@/api/google';
import type { InfoCoordsResult } from '@/types/google/adress.types';

type ProfilScreenProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const Stack = createNativeStackNavigator();


const ProfilScreen = ({ navigation, route }: ProfilScreenProps) => {
  const restaurantData = useSelector((state:Types.Store) => state.myRestaurant.restaurantData);
 

  const [name, setName] = useState<string>('')
  const [googleMyBuisnessLink, setGoogleMyBuisnessLink] = useState<string>('')
  const [loadingSave, setLoadingSave] = useState<boolean>(false)

  const { setLoader } = useLoader()
  const { newNotification } = useNotification()
  const dispatch = useDispatch();

  const handlerPressMap = () => {
    if (!restaurantData) return
    navigation.navigate('Localisation', {
      async validateCb({navigation, route}, coordinates) {
       
        navigation.goBack()
        setLoader(true)

        const payload:Types.RestaurantUpdate = {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }

        try {
          const res:InfoCoordsResult = await getInfoCoords(coordinates)
          console.log('res', res)
          if (res.results && res.results.length && res.results[0].address_components) {
            payload.country = res.results[0].address_components.find((component) => component.types.includes('country'))?.long_name || 'France'
            payload.city = res.results[0].address_components.find((component) => component.types.includes('locality'))?.long_name || 'France'
          }
        } catch (error) {
          console.error('Error fetching address info:', error);
        }
        console.log('validateCb',payload)
        try {
          const {data} = await updateMyRestaurant(payload)
          dispatch(set_restaurant_data(data))          
        } catch (error) {
          newNotification({
            title: 'Enregistrement impossible',
            subTitle: "Veuillez contacter le support",
          })
        }
        setLoader(false)
       
      },
      backCb: ({navigation, route}) => {
        navigation.goBack()
      },
      defaultCoordinates : {
        latitude: restaurantData.latitude,
        longitude: restaurantData.longitude
      }
    })
  }

  useEffect(() => {
    if (restaurantData) {
      console.log('restaurantData', restaurantData.latitude)
      setName(restaurantData.name)
      setGoogleMyBuisnessLink(restaurantData.googleMyBuisnessLink || '')
    }

  },[restaurantData])

  const handlerSave = async () => {
    if (loadingSave) return
    try {
      setLoadingSave(true)
      const {data} = await updateMyRestaurant({
        name,
        googleMyBuisnessLink
      })
      dispatch(set_restaurant_data(data))   
      
      
    } catch (error) {
      newNotification({
        title: 'Enregistrement impossible',
        subTitle: "Veuillez contacter le support",
      })
    }

    setLoadingSave(false)
  }
  
  return (
    <SafeAreaView style={styles.SafeAreaView}>
        <Container.View>
          <Text.SubTitle fontSize={24} lineHeight={24} textAlign='center' style={styles.title}>
            Modifier mes informations
          </Text.SubTitle>
        </Container.View>
        <View style={styles.containerScrollView}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.imageCarouselContainer}>
              <ImageCarousel paddingHorizontal={20}/>
            </View>
            <Container.View>
              <Container.ColumnCenter flexGrow={1} gap={30}>
                <Container.Column style={{width: '100%'}} gap={15} flexGrow={1}>
              
                    <Container.ColumnCenterY gap={8}>
                      <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Nom de l'enseigne</Text.Paragraphe>
                      <Input.MainInput 
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                      />
                    </Container.ColumnCenterY>

                    <Container.ColumnCenterY gap={8}>
                      <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Lien Google Buisiness</Text.Paragraphe>
                      <Input.MainInput 
                        style={styles.input}
                      />
                    </Container.ColumnCenterY>

                    <Container.ColumnCenterY gap={8}>
                      <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Localisation</Text.Paragraphe>
                      <TouchableOpacity style={styles.mapContainer} activeOpacity={0.6} onPress={handlerPressMap}>
                      
                          <View style={styles.iconLocation}><IconLocation/></View>
                          <Map 
                              longitude={restaurantData?.longitude} 
                              latitude={restaurantData?.latitude}
                              lock={true}
                          />
                      </TouchableOpacity>
                    </Container.ColumnCenterY>
                
                </Container.Column>
                
              </Container.ColumnCenter>
            </Container.View>
          </ScrollView>
       </View>
        <Container.View style={styles.containerBtnSave}>
          <TouchableOpacity onPress={handlerSave} activeOpacity={0.6}>
            <Button.ButtonLandingPage loading={loadingSave}>Souvegarder</Button.ButtonLandingPage>
          </TouchableOpacity>
        </Container.View>
    </SafeAreaView>
  )
}

export default ProfilScreen

const styles = StyleSheet.create({
  SafeAreaView: {
    flexGrow:1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: 40,
    marginBottom: 30
  },
  containerScrollView: {
    flexGrow: 1,
    height:0,
  },
  scrollView: {
    width: '100%',
  },
  imageCarouselContainer : {
    marginBottom: 20
  },
  input: {
    width: '100%',
    paddingHorizontal: 20
  },
  mapContainer: {
    backgroundColor: 'red',
    position: 'relative',
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    borderColor:"#71717A",
    borderWidth: 1,
    marginBottom: 30
  },

  iconLocation: {
    position: 'absolute',
    zIndex: 1,
    transform: [{translateY: '-50%'}]
  },

  containerBtnSave: {
    marginBottom: 10
  }
})