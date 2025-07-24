import { StyleSheet, ScrollView , SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, {useCallback, useState, useEffect} from 'react'
import { Container, Text, Button } from '@/components/atoms';
import { Input, Card, Header } from '@/components/molecules';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Restaurant, Notifications } from '@/components/organisms/Pages';
import { searchCustomers } from '@/api/minted/customer';
import * as Types from '@/types'

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Home: undefined;
  Restaurant: {
    restaurantData: Types.RestaurantData;
  };
  Notifications: undefined;
};



type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;


const HomeScreen = ({ navigation, route }: HomeScreenProps) => {
  const [customers, setCustomers] = useState<Types.CustomerCardAdmin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchCustomers = async () => {
      setIsLoading(true)
      const { data } = await searchCustomers('', 0, 'default', 5);
      setCustomers(data)
    
      setIsLoading(false)
  }
  const inputFocued = () => {
    navigation.getParent()?.navigate('Users', { autoFocusInput: true });
  }

  useEffect(() => {
      fetchCustomers();
   
  }, []);
  return (
    <SafeAreaView style={{ flex: 1}}>
      <Header.HeaderMain
        navigation={navigation}
      />
      <Container.Column flexGrow={1}>
        <Container.View>
          <Input.MainInput 
              inputStyle={styles.inputStyle} 
              placeholder={'Rechercher un client...'} 
              placeholderTextColor={"#B8B8BC"} 
              style={styles.containerInput}
              // onChangeText={handlerSetQuery}
              // value={query}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
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
        
          
            <Container.Column style={styles.bestRestaurant} gap={10}>

              <Text.SubTitle fontSize={16} lineHeight={16}>Mes dernier Clients</Text.SubTitle>
              <Container.Column gap={15}>  
                { isLoading && 
                  <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>
                  ||
                  customers.map((customer, index) => (
                      <Card.CardUser customer={customer}/>
                  ))
                }
                
              </Container.Column>
            </Container.Column>
            <TouchableOpacity onPress={() => navigation.navigate('Users')}>
              <Button.ButtonLandingPage>Voir plus</Button.ButtonLandingPage>
            </TouchableOpacity>
           

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
type RestaurantScreenProps = NativeStackScreenProps<RootStackParamList, 'Restaurant'>;
const RestaurantScreen = ({ navigation, route }: RestaurantScreenProps) => (
  <Restaurant restaurantData={route.params.restaurantData}/>
)

const HomeStack = () => {

  return (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
        
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen 
          name="Restaurant" 
          component={RestaurantScreen} 
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

        <Stack.Screen 
          name="Notifications" 
          component={Notifications} 
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: false,
            headerTitle: '',
            // sheetAllowedDetents: [0.99],
            // presentation: 'modal',
      
            headerLeft: () => (
              <Header.HeaderStack.Left navigation={navigation}/>
            ),
          })}
        />
      </Stack.Navigator>
  )
};



export default HomeStack

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