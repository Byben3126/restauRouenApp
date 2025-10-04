import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput, Animated, TouchableWithoutFeedback} from 'react-native'
import { useCallback, useState, useRef, useEffect } from 'react'
import { Container, Text, Icon} from '@/components/atoms'
import { Input, Card , Header} from '@/components/molecules'
import { autocompleteAdress, getInfoPlaceId } from '@/api/google';
import { AutocompleteResult, PlaceDetails } from '@/types/google'
import { useNotification } from '@/context/Notification'
import { useLoader } from '@/context/Loader'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import * as Location from 'expo-location';
import Map from '@/components/organisms/Map/Map';
import { searchRestaurants, getNearByRestaurants } from '@/api/minted/restaurant';
import * as Types from '@/types';
import { Region } from 'react-native-maps';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Restaurant } from '@/components/organisms/Pages';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from './../_layout';




const MapScreen = () => {

  const [ searchValue, setSearchValue ] = useState<string>('')
  const [ resultAutocompleteAdress, setResultAutocompleteAdress ] = useState<AutocompleteResult[]>([])
  const [ resultAutocompleteRestaurantName, setResultAutocompleteRestaurantName ] = useState<Types.RestaurantData[]>([])
  const [ autocompleteLoadingState, setAutocompleteLoadingState ] = useState<boolean>(false)
  const [ coordinatesMap, setCoordinatesMap] = useState<{latitude:Float,longitude:Float} | null>({latitude:49.44312112271373,longitude:1.0918521881103516})
  const [ marker, setMarker] = useState<Types.Marker|null>(null)
  const [ markers, setMarkers] = useState<Types.Marker[]>([])
  const [ restaurantSelected, setRestaurantSelected] = useState<Types.RestaurantData|null>(null)

  //context
  const {newNotification} = useNotification()
  const {setLoader} = useLoader()
  const TabNavigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const router = useRouter();
  
  //ref
  const refTimeoutSearch = useRef<number | null>(null);
  const coordinates = useRef<{latitude:Float,longitude:Float} | null>(null);
  const lastSearchValue = useRef<string| null>(null);
  const inputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(100)).current; // valeur initiale hors écran
  

  const searchAutocompleteAdress = (searchValue:string)=> {
      setRestaurantSelected(null)
      setSearchValue(searchValue)
      setMarker(null)
      if (refTimeoutSearch.current) clearTimeout(refTimeoutSearch.current)
      setAutocompleteLoadingState(false)

      if (searchValue) {
          setAutocompleteLoadingState(true)
          refTimeoutSearch.current = window.setTimeout(async () => {
              try {
                  setAutocompleteLoadingState(true)
                  const result = await autocompleteAdress(searchValue)
                  const {data:restaurants} = await searchRestaurants(searchValue)

                  setAutocompleteLoadingState(false)

                  setResultAutocompleteRestaurantName(restaurants)
                  
                  if (result && result.predictions && result.predictions.length) {
                      setResultAutocompleteAdress(result.predictions)
                  }else{
                      setResultAutocompleteAdress([])
                  }
              } catch (error) {
                setResultAutocompleteAdress([])
                setResultAutocompleteRestaurantName([])
              }
          }, 1000)
      }else{
        setResultAutocompleteAdress([])
        setResultAutocompleteRestaurantName([])
      }
  
  }

  const handlerClickAdress = async (adress:AutocompleteResult)=> {
      if (inputRef.current) inputRef.current.blur();
      setResultAutocompleteAdress([])
      setResultAutocompleteRestaurantName([])
      setSearchValue(adress.description)
      try {          
          setLoader(true)
          const placeDetails:PlaceDetails = await getInfoPlaceId(adress.place_id)

          const coords = {
              latitude: placeDetails.geometry.location.lat,
              longitude: placeDetails.geometry.location.lng
          }

          console.log("placeDetails",placeDetails)
          setMarker({
            id: placeDetails.place_id,
            coordinate: {
              latitude: placeDetails.geometry.location.lat,
              longitude: placeDetails.geometry.location.lng
            },
            title: 'test',
            description: 'description',
          })

          setTimeout(() => {
            setCoordinatesMap(coords)
            coordinates.current = coords
          }, 100);
          

          setLoader(false)
      }catch{
          
          newNotification({
              title: "Lecture de l'adresse impossible",
              subTitle: 'Veuillez contacter le support'
          })
          setLoader(false)
      }
  }

  const handlerClickRestaurant = (restaurant:Types.RestaurantData) => {
    if (inputRef.current) inputRef.current.blur();
    setResultAutocompleteAdress([])
    setResultAutocompleteRestaurantName([])
    setSearchValue(restaurant.name)


    const coords = {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude
    }
    
    setMarker({
      id: restaurant.id,
      coordinate: {
        latitude: coords.latitude,
        longitude: coords.longitude
      },
      image: require('@/assets/images/restaurant_marker.png'),
      onPress: () => {
        console.log(restaurant)
        setRestaurantSelected(restaurant)
      }
    })
    
    setTimeout(() => {
      setCoordinatesMap(coords)
      coordinates.current = coords
    }, 100);

  }

  const getCurrentLocation = async() => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          newNotification({
              title: 'Permission refusée',
              subTitle: 'Veuillez activer la géolocalisation dans les paramètres.',
          });
          return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
      }
  
      setCoordinatesMap(coords)
      coordinates.current = coords

      setSearchValue('')
  }

  const handlerInputOnFocus = ()=> {
      lastSearchValue.current = searchValue
  }

  const handlerInputOnblur = ()=> {
      if (!searchValue && lastSearchValue.current) {
          setSearchValue(lastSearchValue.current)
      }
  }

  const handlerPressOverlayBackground = () => {
    setRestaurantSelected(null)
    setResultAutocompleteAdress([])
    setResultAutocompleteRestaurantName([])
  }
    
  const customRegionMap = useCallback(async (region: Region)=>{
    
    console.log('region.latitudeDelta',region.latitudeDelta, region.longitudeDelta,region.latitude, region.longitude)

    if (region.latitudeDelta <= 0.13390782489619824 && region.longitudeDelta <= 0.10611288249492645) {
      
        //charger tout les point dans la zone
        const {data} = await getNearByRestaurants(region.latitude, region.longitude, 6.0)
        const id = Date.now()

        setMarkers(data.map((restaurant:Types.RestaurantData) => ({
          id: restaurant.id,
          coordinate: {
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
          },
          image: require('@/assets/images/restaurant_marker-min.png'),
          onPress: () => {
            setRestaurantSelected(restaurant)
          },
          title: restaurant.name,
        })))
    }else{
      setMarkers([])
    }

    coordinates.current = {
      longitude: region.longitude,
      latitude: region.latitude
    }
    setCoordinatesMap(null)
  }, [markers])

  const openRestaurantScreen = useCallback((restaurant:Types.RestaurantData, progressBarInfo: Types.CustomerProgress) => {
    router.push({
      pathname: '/(tab)/dashboard_user/(tabs)/restaurant/[id]',
      params: { 
        id: restaurant.id,
        restaurantData: JSON.stringify(restaurant),
        progressBarInfo: JSON.stringify(progressBarInfo)
      }
    });
  },[router])

  //hook
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: restaurantSelected ? 0 : 100,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  }, [restaurantSelected]);
  
  //useFocusEffect detecte si l'utilisateur revient sur l'écran Map
  useFocusEffect(
    useCallback(() => {      
      let timeoutId: number|null = null;

      if (TabNavigation) {
        const tabNavigatorState = TabNavigation.getState();
        const tabNavigatorRoute = tabNavigatorState.routes[tabNavigatorState.index];
        const autoFocusInput = tabNavigatorRoute.params?.autoFocusInput;

        if (autoFocusInput && inputRef.current) {
          searchAutocompleteAdress('')
          timeoutId = setTimeout(() => {
              inputRef.current?.focus();
          }, 500);
          TabNavigation.setParams({ autoFocusInput: undefined });
        }
      }
       
      return () => {
          if (timeoutId) {
              clearTimeout(timeoutId);
          }
      };
    }, [TabNavigation])
  );
  
  return (

    <Container.Column flexGrow={1} style={styles.mapContainer}>
      

      <Map 
          longitude={coordinatesMap?.longitude} 
          latitude={coordinatesMap?.latitude}
          changeRegion={customRegionMap}
          marker={marker}
          markers={markers}
      />

  
      {(resultAutocompleteAdress.length > 0 || autocompleteLoadingState || restaurantSelected) && 
        <TouchableWithoutFeedback onPress={handlerPressOverlayBackground}>
          <View style={styles.mapOverlay}/>
        </TouchableWithoutFeedback>
      }
      <SafeAreaView style={styles.searchContainer}>
        <Container.View>
            <Input.MainInput 
                ref={inputRef}
                inputStyle={styles.inputStyle} 
                placeholder={'Où manger ? Où aller ?'} 
                placeholderTextColor={"#B8B8BC"} 
                style={styles.containerInput}
                onChangeText={searchAutocompleteAdress}
                value={searchValue}
                // keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                iconLeft={true}
                buttonClear={true}
                isLoading={autocompleteLoadingState}
                onFocus={handlerInputOnFocus}
                onBlur={handlerInputOnblur}
            />
          {(resultAutocompleteAdress.length > 0 || resultAutocompleteRestaurantName.length > 0) && !autocompleteLoadingState && (
              <Container.Column style={styles.listPlace}>
                  {resultAutocompleteRestaurantName.map((restaurant, index) => (
                      <TouchableOpacity key={index} style={styles.place} onPress={()=>handlerClickRestaurant(restaurant)}>
                          <Container.ColumnCenter style={styles.containerIconPlace}>
                            <Icon.Ionicons name='fast-food-outline' size={17} color={'#000000a0'}/> 
                          </Container.ColumnCenter>
                          <Text.Paragraphe fontSize={14} lineHeight={20}>{restaurant.name} </Text.Paragraphe>
                      </TouchableOpacity>
                  ))}

                  {resultAutocompleteAdress.map((address, index) => (
          
                    <TouchableOpacity key={index} style={styles.place} onPress={()=>handlerClickAdress(address)}>
                        <Container.ColumnCenter style={styles.containerIconPlace}>
                          <Icon.RR name='ping' size={16} lineHeight={20} color={'#000000a0'}/>
                        </Container.ColumnCenter>
                        <Text.Paragraphe fontSize={14} lineHeight={20} style={{flexGrow:1, width:0}}>{address.description}</Text.Paragraphe>
                    </TouchableOpacity>
                      
                  ))}
              </Container.Column>
            )}
        </Container.View>
      </SafeAreaView>
      <SafeAreaView style={styles.containerLocateButton}>
          <TouchableOpacity style={styles.locateButton} onPress={getCurrentLocation}>
              <Icon.RR name={"target"} size={24} lineHeight={25} color={'#000'}/>
          </TouchableOpacity>
      </SafeAreaView>

      {restaurantSelected && (
        <Animated.View 
          style={[
            styles.restaurantCard,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Card.CardRestaurant 
            restaurantData={restaurantSelected} 
            cbViewMore={openRestaurantScreen}
          />
        </Animated.View>
      )}
    </Container.Column>

  )
}

export default MapScreen

const styles = StyleSheet.create({
    mapContainer: {
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,  
    },
    mapOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputStyle: {

    },
    containerInput : {
      width: '100%',
      // paddingLeft:22,
      paddingRight:8,
      backgroundColor: '#fff',
      height: 50,
      borderColor:"#71717A",
      borderWidth: 1,
      borderRadius : 25,
      marginBottom: 10,
    },
    listPlace: {
      backgroundColor: '#fff',
      borderColor:"#71717A",
      borderWidth: 1,
      borderRadius : 25,
    },
    place: {
          display: 'flex',
          flexDirection: 'row',
          paddingLeft: 25,
          borderBottomWidth: 1,
          borderColor:"#71717A1A",
          paddingVertical: 15,
          gap: 8
    },
    containerIconPlace: {
      height: 19,
      width: 19,
    },
    containerLocateButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
    locateButton: {
       
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius : 25,
    },
    restaurantCard: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        left: 20,
    }
})


