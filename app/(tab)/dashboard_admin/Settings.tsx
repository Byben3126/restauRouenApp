import { StyleSheet, View, SafeAreaView, Image, TouchableOpacity, FlatList,ActivityIndicator } from 'react-native'
import React, { useEffect, useCallback } from 'react'
import { Container, Text, Icon, Button } from '@/components/atoms';
import { Header, Card } from '@/components/molecules';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Profil from '@/components/organisms/Pages/Profil';
import AddReward from '@/components/organisms/Pages/AddReward';
import NewOffer from '@/components/organisms/Pages/NewOffer';
import { getRewards, deleteReward } from '@/api/minted/reward';
import { useAuth } from '@/context/Auth';
import { useRouter } from "expo-router";
import * as Types from '@/types'; 
import { useSelector } from 'react-redux';
import { useLoader } from '@/context/Loader';
const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    Settings: undefined;
    Profil: undefined;
    AddReward: undefined;
    NewOffer: { userId?: number };
    Offers: undefined;
};


type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
const SettingsScreen = ({ navigation, route }: SettingsScreenProps) => {

  //redux
  const user = useSelector((state:Types.Store) => state.user.value);

  //context
  const {logout} = useAuth()
  const router = useRouter();

  const handlerSwtichMode = () => {
    if (user) {
      router.replace("/dashboard_user");
    }else {
     
    }
  }

  return (
    <SafeAreaView style={{ flex: 1}}>
        <Container.View flexGrow={1} style={styles.view}>
            <Container.Column flexGrow={1} gap={30}>
                <Container.RowCenterY flexGrow={0} gap={15}>
                    <Image
                        source={require('@/assets/images/picture_user_default.png')}
                        style={styles.imageUser}
                        resizeMode='cover'
                    />
                    <Text.SubTitle fontSize={24} lineHeight={24}>Hey {user?.identity?.first_name}</Text.SubTitle>
                </Container.RowCenterY>
                <Container.Column flexGrow={1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
                        <Container.RowCenterY style={styles.item} gap={5}>
                            <Text.SubTitle fontSize={17} lineHeight={17}>Paramètres du compte</Text.SubTitle>
                            <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                        </Container.RowCenterY>
                    </TouchableOpacity>
                    
                    <Container.RowCenterY style={styles.item} gap={5}>
                        <Text.SubTitle fontSize={17} lineHeight={17}>Centre de notifications</Text.SubTitle>
                        <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                    </Container.RowCenterY>

                    <TouchableOpacity onPress={() => navigation.navigate('NewOffer',{ userId: undefined})}>
                        <Container.RowCenterY style={styles.item} gap={5}>
                            <Text.SubTitle fontSize={17} lineHeight={17}>Ajouter une offre</Text.SubTitle>
                            <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                        </Container.RowCenterY>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
                        <Container.RowCenterY style={styles.item} gap={5}>
                            <Text.SubTitle fontSize={17} lineHeight={17}>Gestion des récompense</Text.SubTitle>
                            <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                        </Container.RowCenterY>
                    </TouchableOpacity>
                </Container.Column>
                <Container.Column gap={15} style={styles.containerButton}>
                  <TouchableOpacity onPress={handlerSwtichMode}>
                    <Button.ButtonLandingPage>Mode client</Button.ButtonLandingPage>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={logout}>
                    <Button.ButtonLandingPageOutline>Se déconnecter</Button.ButtonLandingPageOutline>
                  </TouchableOpacity>
                </Container.Column>

            </Container.Column>
        </Container.View>
    </SafeAreaView>
  )
}


type AddRewardScreenProps = NativeStackScreenProps<RootStackParamList, 'AddReward'>;
const AddRewardScreen = ({ navigation, route }: AddRewardScreenProps) => {
  return  (
    <AddReward closeCb={navigation.goBack}/>
  )
}

const OffersScreen = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Offers'>) => {
  const restaurantData = useSelector((state:Types.Store) => state.myRestaurant.restaurantData);

  
  const [rewards, setRewards] = React.useState<Types.RewardRead[]|null>(null);

  //context
  const { setLoader } = useLoader();


  
  const fetchRewards = async () => {
    if (!restaurantData) return
    try {
      const {data} = await getRewards(restaurantData.id)
      if (data.length % 2 !== 0) {
        data.push({...data[0], id: -1});
      }
      setRewards(data)
    } catch (error) {
      setRewards([])
    }
  };

  const deleteRewardHandler = useCallback(async (reward:Types.RewardRead)=>{
      setLoader(true)
      navigation.goBack()
      try {
         await deleteReward(reward.id)
      } catch (error) {
        console.log('Error deleting reward:', error);
      }
      navigation.navigate('Offers')
      setLoader(false)
  },[navigation])
  



  const renderItem = useCallback(({item:reward}:{item:Types.RewardRead})=>{
    if (reward.id === -1) return <View style={{flexGrow:1}}/>
    return <Card.CardReward reward={reward} cbButton={deleteRewardHandler} textButton={'Supprimer'}/>
  },[])



  useEffect(() => {
    fetchRewards()
  }, []);

  if (!rewards) {
    return <ActivityIndicator size={'small'}/>
  }


  return (

    <Container.Column flexGrow={1}>
      <Container.View>
        <Text.SubTitle fontSize={24} lineHeight={24} marginBottom={10}>Récompenses</Text.SubTitle>
      </Container.View>
    
      <Container.Column flexGrow={1}>
        { rewards.length &&
          <FlatList
            data={rewards}
            renderItem={renderItem}
            keyExtractor={(reward) => String(reward.id)}
            numColumns={2}
            contentContainerStyle={OffersStyles.listContainer}
            columnWrapperStyle={OffersStyles.columnWrapperStyle}
            style={OffersStyles.flatList}
            ListFooterComponent={<View style={{ paddingBottom: 5 }}/>} 
            scrollEnabled={false}
          />  
          ||
          <Container.ColumnCenter style={{paddingVertical:30}}>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Aucune récompense disponible</Text.Paragraphe>
          </Container.ColumnCenter>
      }
      </Container.Column>
      <Container.View>
        <TouchableOpacity onPress={()=>{
          navigation.goBack()
          setTimeout(() => {
            navigation.navigate('AddReward')
          }, 100);
        }} 
          style={{width:'100%'}}
        >
            <Button.ButtonLandingPage size={1}>
                Nouvelle récompense
            </Button.ButtonLandingPage>
        </TouchableOpacity>
        <SafeAreaView/>
      </Container.View>
    </Container.Column>
   
  )

}


const SettingsStack = () => {

    return (
        <Stack.Navigator
          initialRouteName="Settings"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
          }}
          
        >
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen 
            name="Profil" 
            component={Profil} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: false,
              headerTitle: '',
              sheetAllowedDetents: [0.99],
              // presentation: 'modal',
        
              headerLeft: () => (
                <Header.HeaderStack.Left navigation={navigation}/>
              ),
            })}
          />

          <Stack.Screen 
            name="AddReward" 
            component={AddRewardScreen} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: false,
              headerTitle: '',
              sheetAllowedDetents: [0.99],
              presentation: 'pageSheet',
        
              headerLeft: () => (
                <Header.HeaderStack.Left navigation={navigation}/>
              ),
            })}
          />  
          <Stack.Screen 
            name="Offers" 
            component={OffersScreen} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: false,
              headerTitle: '',
              sheetAllowedDetents: [0.99],
              presentation: 'pageSheet',
        
              headerLeft: () => (
                <Header.HeaderStack.Left navigation={navigation}/>
              ),
            })}
          />  
          <Stack.Screen 
            name="NewOffer" 
            component={NewOffer} 
            options={({ navigation }) => ({
              headerShown: true,
              headerTransparent: false,
              headerTitle: '',
              sheetAllowedDetents: [0.99],
              presentation: 'pageSheet',
        
              headerLeft: () => (
                <Header.HeaderStack.Left navigation={navigation}/>
              ),
            })}
          />  

        </Stack.Navigator>
     
    )
};

export default SettingsStack

const styles = StyleSheet.create({
    view : {
        marginTop: 20,
    },
    imageUser : {
        width: 43,
        height: 43,
        borderRadius: 99999,
    },
    item: {
        justifyContent: 'space-between',
        height: 40,
    },
    containerButton: {
        marginBottom: 20,
    }
})

const OffersStyles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
    paddingTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  columnWrapperStyle: {
    gap: 20
  }
})