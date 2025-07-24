import { StyleSheet, ScrollView , SafeAreaView, TouchableOpacity} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Container, Text } from '@/components/atoms';
import { Input, Card, Header } from '@/components/molecules';
import ProgressBar from '@/components/organisms/Home/ProgressBar'
import { getTopRestaurants, getLastVisitedCustomersWithRestaurants } from '@/api/minted/restaurant';
import * as Location from 'expo-location';
import { getNearByRestaurants } from '@/api/minted/restaurant';
import * as Types from '@/types';

import { useRouter, router } from 'expo-router';
import type { Href } from 'expo-router';
import { RouterParamsList} from '@/types/app/navigation.types';

import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from './../_layout';


const Home = () => {

  const [ customers, setCustomers ] = useState<Types.CustomerWithPregress[]>([]);
  const [ lastCustomers, setLastCustomers ] = useState<Types.CustomerWithPregress[]>([]);
  const [ suggestRestaurants, setSuggestRestaurants ] = useState<Types.RestaurantData[]>([]);

  //context
  const TabNavigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  // const router = useRouter();

  const fetchTopRestaurants = async () => {
    const { data } = await getTopRestaurants();
    setCustomers(data);
  }

  const fetchLastVisits = async () => {
     const { data } = await getLastVisitedCustomersWithRestaurants();
     setLastCustomers(data);
  }

  const fetchSuggestRestaurants = async () => {
      try {
        let location = await Location.getCurrentPositionAsync({});
        const {data} = await getNearByRestaurants(location.coords.latitude, location.coords.longitude, 10.0, 3)
        setSuggestRestaurants(data);

      } catch (error) {
        console.error("Error fetching location:", error);
      }
      
  }

  const openRestaurantScreen = useCallback((restaurant:Types.RestaurantData, progressBarInfo?: Types.CustomerProgress) => {
    console.log("Home screen rendered");

    if (!restaurant?.id) return;
    router.push({
      pathname: '/(tab)/dashboard_user/(tabs)/restaurant/[id]',
      params: { 
        id: restaurant.id,
        restaurantData: JSON.stringify(restaurant),
        progressBarInfo: JSON.stringify(progressBarInfo)
      }
    });

  },[router])

  const inputFocued = () => {
    TabNavigation.navigate('(tabs)/Map', { autoFocusInput: true });
  }

  useEffect(() => {
    fetchTopRestaurants();
    fetchLastVisits();
    fetchSuggestRestaurants();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1}}>
      <Header.HeaderMain
        navigation={TabNavigation}
      />
      <Container.Column flexGrow={1}>
        <Container.View>
          <Input.MainInput 
              inputStyle={styles.inputStyle} 
              placeholder={'Rechercher un restaurant'} 
              placeholderTextColor={"#B8B8BC"} 
              style={styles.containerInput}
              iconLeft={true}
              onPress={inputFocued}
              readOnly={true}
          />
        </Container.View>
       
        <ScrollView 
          showsVerticalScrollIndicator={false}  
          style={{flex: 1, }}
        >
          <Container.View style={styles.scrollViewContent}>
            <ProgressBar customers={customers}/>


            {lastCustomers.length > 0 &&
              <Container.Column style={styles.bestRestaurant} gap={10}>
                <Text.SubTitle fontSize={16} lineHeight={16}>Mes dernières visites</Text.SubTitle>
                <Container.Column gap={10}>
                  
                    {lastCustomers.map((customer, index) => (
                      customer.restaurant && 
                      (<TouchableOpacity activeOpacity={0.7} onPress={() => customer.restaurant && openRestaurantScreen(customer.restaurant)}>
                        <Card.CardRestaurant 
                          customerProgress={customer.progress}
                          restaurantData={customer?.restaurant}
                          cbViewMore={openRestaurantScreen} key={index}
                        />
                      </TouchableOpacity>)
                    ))}
              
                </Container.Column>
              </Container.Column>
            }


            {suggestRestaurants.length > 0 &&
              <Container.Column style={styles.bestRestaurant} gap={10}>
                <Text.SubTitle fontSize={16} lineHeight={16}>Restaurant suggéré</Text.SubTitle>
                <Container.Column gap={10}>
                  
                    {suggestRestaurants.map((restaurant, index) => (
                   
                      <TouchableOpacity activeOpacity={0.7} onPress={() => restaurant && openRestaurantScreen(restaurant)}>
                        <Card.CardRestaurant 
                          restaurantData={restaurant}
                          cbViewMore={openRestaurantScreen} key={index}
                        />
                      </TouchableOpacity>
                    ))}
              
                </Container.Column>
              </Container.Column>
            }

            {/* <Button.ButtonLandingPage>View all</Button.ButtonLandingPage> */}

            {/* <Container.Column style={styles.yourActivities} gap={10}>
              <Text.SubTitle fontSize={16}>Your activities</Text.SubTitle>
            
            </Container.Column>
             */}
          </Container.View>
        </ScrollView>
      </Container.Column>
    </SafeAreaView>
  )
}


export default Home

const styles = StyleSheet.create({
  scrollViewContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
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

  yourActivities: {
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    padding: 16,
  },

  bestRestaurant: {

  }
})