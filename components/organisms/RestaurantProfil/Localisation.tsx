import { StyleSheet, SafeAreaView, View, TouchableOpacity, TextInput} from 'react-native'
import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Container, Text, Icon, Button} from '@/components/atoms'
import { Input, Card } from '@/components/molecules'
import { autocompleteAdress, getInfoPlaceId } from '@/api/google';
import { AutocompleteResult, PlaceDetails } from '@/types/google'
import { useNotification } from '@/context/Notification'
import { useLoader } from '@/context/Loader'
import IconLocation from './IconLocation'
import Map from './Map'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import * as Location from 'expo-location';

type LocalisationProps = {
    validateCb: (coordinates:{latitude:Float,longitude:Float})=>void
    backCb?: () => void
    defaultCoordinates?: {latitude:Float,longitude:Float}
}

const Localisation = ({ validateCb, backCb, defaultCoordinates }: LocalisationProps) => {
    
    const [ searchValue, setSearchValue ] = useState<string>('')
    const [ resultAutocompleteAdress, setResultAutocompleteAdress ] = useState<AutocompleteResult[]>([])
    const [ autocompleteLoadingState, setAutocompleteLoadingState ] = useState<boolean>(false)
    const [ coordinatesMap, setCoordinatesMap] = useState<{latitude:Float,longitude:Float} | null>(null)
    
    //conext
    const {newNotification} = useNotification()
    const {setLoader} = useLoader()

    //ref
    const refTimeoutSearch = useRef<number | null>(null);
    const coordinates = useRef<{latitude:Float,longitude:Float} | null>(null);
    const lastSearchValue = useRef<string| null>(null);
    const inputRef = useRef<TextInput>(null);
    
    const searchAutocompleteAdress = useCallback((searchValue:string)=> {
        setSearchValue(searchValue)
        if (refTimeoutSearch.current) clearTimeout(refTimeoutSearch.current)
        setAutocompleteLoadingState(false)

        if (searchValue) {
            setAutocompleteLoadingState(true)
            refTimeoutSearch.current = window.setTimeout(async () => {
                try {
                    setAutocompleteLoadingState(true)
                    const result = await autocompleteAdress(searchValue)
                    setAutocompleteLoadingState(false)

                    if (!result)  throw new Error("Echec");
                    console.log("result",result)
                    if (result.predictions && result.predictions.length) {
                        setResultAutocompleteAdress(result.predictions)
                    }else{
                        throw new Error("predictions not found");
                    }
                } catch (error) {
                    setResultAutocompleteAdress([])
                }
            }, 1000)
        }else{
        }
    
    },[])

    const handlerClickAdress = useCallback(async (adress:AutocompleteResult)=> {
        if (inputRef.current) inputRef.current.blur();
        setResultAutocompleteAdress([])
        setSearchValue(adress.description)
        try {          
            setLoader(true)
            const placeDetails:PlaceDetails = await getInfoPlaceId(adress.place_id)

            const coords = {
                latitude: placeDetails.geometry.location.lat,
                longitude: placeDetails.geometry.location.lng
            }
            setCoordinatesMap(coords)
            coordinates.current = coords

            setLoader(false)
        }catch{
            
            newNotification({
                title: "Lecture de l'adresse impossible",
                subTitle: 'Veuillez contacter le support'
            })
            setLoader(false)
        }
    }, [])

    const validate = useCallback(()=> {
        if (coordinates.current) {
            validateCb(coordinates.current)
        }
    }, [validateCb])

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

        setSearchValue('Ma localisation')
    }

    const handlerInputOnFocus = ()=> {
        lastSearchValue.current = searchValue

        if (searchValue.toLowerCase() == 'personnalisé' || searchValue.toLowerCase() == 'ma localisation') {
            setSearchValue('')
        }
    }

    const handlerInputOnblur = ()=> {
        if (!searchValue && lastSearchValue.current) {
            setSearchValue(lastSearchValue.current)
        }
    }
    
    const customCoordinateMap = (coords:{latitude:Float,longitude:Float})=>{
        coordinates.current = coords
        setCoordinatesMap(null)
        setSearchValue('Personnalisé')
    }

    useEffect(()=> {
        if (defaultCoordinates && defaultCoordinates.latitude && defaultCoordinates.longitude) {
            coordinates.current = defaultCoordinates
            setCoordinatesMap(defaultCoordinates)
        }else{
            getCurrentLocation()
        }
    },[])

    return (
      <Container.Column flexGrow={1} style={styles.mapContainer}>
        {resultAutocompleteAdress.length == 0 && <View style={styles.iconLocation}><IconLocation/></View>}
        {resultAutocompleteAdress.length > 0 && <View style={styles.mapOverlay}/>}

        <Map 
            longitude={coordinatesMap?.longitude} 
            latitude={coordinatesMap?.latitude}
            changeCoordinate={customCoordinateMap}
        />

        <SafeAreaView style={styles.searchContainer}>
        <Container.View>
            <Input.MainInput 
                ref={inputRef}
                inputStyle={styles.inputStyle} 
                placeholder={'Rechercher un restaurant'} 
                placeholderTextColor={"#B8B8BC"} 
                style={styles.containerInput}
                onChangeText={searchAutocompleteAdress}
                value={searchValue}
                // keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                iconLeft={true}
                buttonClear={searchValue.toLowerCase() !== 'personnalisé' && searchValue.toLowerCase() !== 'ma localisation'}
                isLoading={autocompleteLoadingState}
                onFocus={handlerInputOnFocus}
                onBlur={handlerInputOnblur}
            />
            {resultAutocompleteAdress.length > 0 && !autocompleteLoadingState && (
                <Container.Column style={styles.listPlace}>
                    {resultAutocompleteAdress.map((address, index) => (
                        <Container.ColumnCenterY key={index} style={styles.place}>
                            <TouchableOpacity onPress={()=>handlerClickAdress(address)}>
                                <Text.Paragraphe fontSize={14} lineHeight={20}>
                                    {address.description}
                                </Text.Paragraphe>
                            </TouchableOpacity>
                        </Container.ColumnCenterY>
                    ))}
                </Container.Column>
            )}
        </Container.View>
        </SafeAreaView>
        <SafeAreaView  style={styles.ContainerBottomButtons}>

            <TouchableOpacity style={styles.locateButton} onPress={getCurrentLocation}>
                <Icon.RR name={"target"} size={24} lineHeight={25} color={'#000'}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={validate} style={{width:'100%'}}>
                <Button.ButtonLandingPage size={1}>
                    Valider
                </Button.ButtonLandingPage>
            </TouchableOpacity>

            {backCb &&
                <TouchableOpacity onPress={backCb} style={{width:'100%'}}>
                    <Button.ButtonLandingPageOutline size={1}>
                        Retour
                    </Button.ButtonLandingPageOutline>
                </TouchableOpacity>
             }
        </SafeAreaView>
      </Container.Column>
    )
}

export default Localisation

const styles = StyleSheet.create({
  mapContainer: {
        backgroundColor: 'red',
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,  
        zIndex:99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
  },

  iconLocation: {
    position: 'absolute',
    zIndex: 1,
    transform: [{translateY: '-50%'}]
  },
  mapOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      zIndex: 2
  },

  searchContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999
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
        //height: 50,
        paddingLeft: 25,
        borderBottomWidth: 1,
        borderColor:"#71717A1A",
        paddingVertical: 15
  },

  ContainerBottomButtons : {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 15
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
})