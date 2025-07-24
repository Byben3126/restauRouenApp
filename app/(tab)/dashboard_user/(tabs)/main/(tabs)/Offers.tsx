import { StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, View, ActivityIndicator, FlatList, RefreshControl} from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Container, Text, Icon, Button } from '@/components/atoms';
import { Input, Card, Header } from '@/components/molecules';
import { searchRestaurants } from '@/api/minted/restaurant';
import { get_all_promotions_user, get_all_promotions_for_user, get_restaurant_promotions, get_restaurant_promotions_for_me } from '@/api/minted/promotion';
import * as Types from '@/types';
import QrCodeView from '@/components/organisms/Pages/QrCodeView'
import { useLoader } from '@/context/Loader';
import { useNotification } from '@/context/Notification';
import { getTokenPromotion } from '@/api/minted/promotion';

export type StackParamList = {
  Offers: undefined;
  QrCode: {
    title:string;
    qrCodeValue: string;
  };
};

const Stack = createNativeStackNavigator<StackParamList>();

const buttons = [
  { id: "all", title: "Tous"},
  { id: "for-you", title: "Uniquement pour moi" },
];

type offersScreenProps = NativeStackScreenProps<StackParamList, 'Offers'>;
const OffersScreen = ({ navigation, route }:offersScreenProps) => {

    const [ searchValue, setSearchValue ] = useState<string>('')
    const [ resultAutocompleteRestaurantName, setResultAutocompleteRestaurantName ] = useState<Types.RestaurantData[]>([])
    const [ autocompleteLoadingState, setAutocompleteLoadingState ] = useState<boolean>(false)
    const [ restaurantSelected, setRestaurantSelected] = useState<Types.RestaurantData|null>(null)
    const [promotions, setPromotions] = useState<Types.PromotionRead[]>([])
    const [navSelected, setNavSelected] = useState<string>('all')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState<number>(0);

    //ref
    const refTimeoutSearch = useRef<number | null>(null);
    const inputRef = useRef<TextInput>(null);

    //context
    const { setLoader } = useLoader()
    const { newNotification } = useNotification()

    const searchAutocompleteAdress = (searchValue:string)=> {
            console.log('searchAutocompleteAdress')
            setSearchValue(searchValue)
        
            if (refTimeoutSearch.current) clearTimeout(refTimeoutSearch.current)
            setAutocompleteLoadingState(false)
        
            if (searchValue) {
                setAutocompleteLoadingState(true)
                refTimeoutSearch.current = window.setTimeout(async () => {
                    try {
                        setAutocompleteLoadingState(true)
                        const {data:restaurants} = await searchRestaurants(searchValue)
                        setAutocompleteLoadingState(false)
        
                        setResultAutocompleteRestaurantName(restaurants)
                    } catch (error) {
                        setResultAutocompleteRestaurantName([])
                    }
                }, 1000)
            }else{
                setResultAutocompleteRestaurantName([])
                if (restaurantSelected) {
                    setPromotions([])
                    setPage(0)
                    setRestaurantSelected(null)
                }
            }
    }

    const handlerClickRestaurant = (restaurant:Types.RestaurantData) => {
        console.log('handlerClickRestaurant')
        setSearchValue(restaurant.name)
        setResultAutocompleteRestaurantName([])
        setPromotions([])
        setPage(0)
        setRestaurantSelected(restaurant)
        if (inputRef.current) {
            inputRef.current.blur(); // Ferme le clavier
        }
     
        console.log('restaurantSelected', restaurant)
    }

    const handlerInputOnFocus = ()=> {
    }

    const handlerInputOnblur = ()=> {
        console.log('handlerInputOnblur')
        setResultAutocompleteRestaurantName([])

        if (restaurantSelected) {
            setSearchValue(restaurantSelected.name)
        }else{
            setSearchValue('')
        }
    }

    const fetchAllPromotions = async () => {
        console.log('fetchAllPromotions', page)
        if (page == -1) return;
        setIsLoading(true)
        if (restaurantSelected) {
            const {data} = await get_restaurant_promotions(restaurantSelected.id)
            setPromotions(data)
            setPage(-1)
        }else{
            const {data} =  await get_all_promotions_user(page)
            console.log(data)
            setPromotions([...promotions, ...data])
            setPage(data.length < 10 ? -1 : page + 1)
        }

        setIsLoading(false)
    }

    const fetchAllPromotionsForYou = async () => {
        console.log('fetchAllPromotionsForYou')
         if (page == -1) return;
        setIsLoading(true)
        if (restaurantSelected) {
            const {data} = await get_restaurant_promotions_for_me(restaurantSelected.id)
            setPromotions(data)
            setPage(-1)
        }else{
            const {data} = await get_all_promotions_for_user(page)
            console.log(data)
            setPromotions([...promotions, ...data])
            setPage(data.length < 10 ? -1 : page + 1)
        }
        setIsLoading(false)
    }

    const handleRefresh = () => {
        setRefreshing(true);
        console.log('Refreshing data...');
        // setRefreshing(true);
        // setTimeout(() => {
        //     // Simule un chargement de données
        //     setData((prevData) => [`New Item ${prevData.length + 1}`, ...prevData]);
        //     setRefreshing(false);
        // }, 2000); // Durée du "chargement"
    };

    const loadMoreItems = () => {

        console.log('loadMoreItems', page, navSelected)
        if (page == -1) return;
        switch (navSelected) {
            case 'all':
                fetchAllPromotions()
                break;
        
            case 'for-you':
                fetchAllPromotionsForYou()
                break;
        }
    }

    const changeNav = (type:string) => {
        if (navSelected === type) return;
        setPromotions([])
        setPage(0)
        setNavSelected(type)
    }


    const pressPromotionHandler = useCallback(async (promotion:Types.PromotionRead)=>{
          setLoader(true);
          try {
            const {data} = await getTokenPromotion(promotion.id)

            navigation.navigate('QrCode', {
                title: promotion.name,
                qrCodeValue: data,
            })
          } catch (error) {
            newNotification({
              title: 'Promotion indisponible',
              subTitle: "",
            })   
          }
          
          setLoader(false);
    },[setLoader])
        

    useEffect(() => {
        loadMoreItems();
    }, [navSelected]);

    useEffect(() => {
        loadMoreItems();
    }, [restaurantSelected]);

    return (
        <SafeAreaView style={{ flex: 1}}>
            <Container.Column flexGrow={1} style={styles.view} gap={20}>
                <Container.Column style={styles.headerOffers} gap={10}>


                    <Container.View style={styles.searchContainer}>
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
                            buttonClear={true}
                            isLoading={autocompleteLoadingState}
                            onFocus={handlerInputOnFocus}
                            onBlur={handlerInputOnblur}
                        />
                        {(resultAutocompleteRestaurantName.length > 0) && !autocompleteLoadingState && (
                            <View style={styles.containerListPlace}>
                                <Container.Column style={styles.listPlace}>
                                    {resultAutocompleteRestaurantName.map((restaurant, index) => (
                                        <TouchableOpacity key={index} style={styles.place} onPress={()=>handlerClickRestaurant(restaurant)}>
                                            <Container.ColumnCenter style={styles.containerIconPlace}>
                                            <Icon.Ionicons name='fast-food-outline' size={17} color={'#000000a0'}/> 
                                            </Container.ColumnCenter>
                                            <Text.Paragraphe fontSize={14} lineHeight={20}>{restaurant.name} </Text.Paragraphe>
                                        </TouchableOpacity>
                                    ))}
                                </Container.Column>
                            </View>
                        )}
                    </Container.View>


                    <Container.View>
                        <Text.SubTitle fontSize={24} lineHeight={24} style={{marginTop:5}}>Mes offres</Text.SubTitle>
                    </Container.View>
                    <ScrollView 
                        style={styles.navigation} 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.navigationContent}
                    >   
                        {buttons.map((button, index) => (
                            <TouchableOpacity onPress={()=>changeNav(button.id)}>
                                {navSelected == button.id ?
                                    <Button.ButtonRadius size={2}>{button.title}</Button.ButtonRadius>
                                :
                                    <Button.ButtonRadiusOutline size={2}>{button.title}</Button.ButtonRadiusOutline>
                            }
                            </TouchableOpacity>
                        ))}
                
                    </ScrollView>
                </Container.Column>
                {
                    isLoading && !promotions.length ?
                        <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>
                    : !promotions.length ?
                        <Container.ColumnCenter flexGrow={1}>
                            <Container.View>
                                <Text.Paragraphe fontSize={16} lineHeight={20} textAlign='center'>Aucune promotion disponible pour le moment.</Text.Paragraphe>
                            </Container.View>
                        </Container.ColumnCenter>
                      
                    :   
                        <FlatList
                            data={promotions}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false} 
                            style={{flex: 1}}
                            ItemSeparatorComponent={() => <Container.View style={{height: 20}} />}
                            onEndReached={loadMoreItems}
                            renderItem={({ item:promotion, index }) => (
                                <Container.View>
                                    <Card.CardOffer 
                                        key={index} 
                                        promotion={promotion} 
                                        cbChoose={pressPromotionHandler}
                                    />
                                </Container.View>
                 
                            )}
                            ListFooterComponent={() => (
                                <Container.ColumnCenter style={{height: page >= 0 ? 80 : 20}}>
                                    {page >= 0 && <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>}
                                </Container.ColumnCenter>
                            )}
                            // refreshControl={}
                                // {{refreshing && <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>}}
                                // <RefreshControl refreshing={refreshing} size={0} onRefresh={handleRefresh} />
                        />
                }
            </Container.Column>
        </SafeAreaView>
    )
}

type qrCodeScreenProps = NativeStackScreenProps<StackParamList, 'QrCode'>;
const QrCodeScreen = ({ navigation, route }:qrCodeScreenProps) => {
    return (
        <QrCodeView
            title={route.params.title}
            qrCodeValue={route.params.qrCodeValue}
            cbButton={() => navigation.goBack()}
        />

    )
}

const OffersStack = () => (
       
    <Stack.Navigator
        initialRouteName="Offers"
        screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
        }}
        
    >
    <Stack.Screen name="Offers" component={OffersScreen} />
    <Stack.Screen 
        name="QrCode" 
        component={QrCodeScreen} 
        options={({ navigation }) => ({
        headerShown: true,
        headerTransparent: false,
        headerTitle: '',
        sheetAllowedDetents: [0.99],
        presentation: 'modal',
    
        headerLeft: () => (
            <Header.HeaderStack.Left navigation={navigation}/>
        ),
        })}
    />
    </Stack.Navigator>
)


export default OffersStack

const styles = StyleSheet.create({
    view : {
        marginTop: 20,
    },

    headerOffers: {
    },
    searchContainer: {
        position: 'relative',
    },
    containerListPlace: {
    },

    listPlace: {
        backgroundColor: '#fff',
        borderColor:"#71717A",
        borderWidth: 1,
        borderRadius : 25,
        position: 'absolute',
        top: 10,
        left:0,
        right: 0,
        zIndex: 10,
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
    },
    navigation: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexGrow: 0,
    },
    navigationContent: { 
        paddingLeft: 20, 
        paddingRight: 20,
        gap: 10,
    },
    scrollViewContent: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 20,
        paddingTop: 20,
        paddingBottom: 20,

    },
})