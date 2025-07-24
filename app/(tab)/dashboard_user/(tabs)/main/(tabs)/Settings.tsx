import { StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Container, Text, Icon, Button } from '@/components/atoms';
import { Input, Header } from '@/components/molecules';
import { Notifications } from '@/components/organisms/Pages';
import Colors from '@/constants/Colors';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Profil from '@/components/organisms/Pages/Profil';
import { useAuth } from '@/context/Auth';
import { useSelector } from 'react-redux';
import { useRouter } from "expo-router";
import * as Types from '@/types'; 


const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    Settings: undefined;
    Profil: undefined;
    Notifications: undefined;
};

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
  route: RouteProp<RootStackParamList, 'Settings'>;
}

const SettingsScreen = ({ navigation, route }: HomeScreenProps) => {

  //redux
  const restaurantData = useSelector((state:Types.Store) => state.myRestaurant.restaurantData);
  
  const user = useSelector((state:Types.Store) => state.user.value);
  //context
  const {logout} = useAuth()
  const router = useRouter();

  const handlerLogout = async () => {
    logout()
  }

  const handlerSwtichMode = () => {
    console.log('handlerSwtichMode',restaurantData)
    if (restaurantData) {
      router.replace("/dashboard_admin");
    }else {
      router.replace("/onboarding/(tabs)/Restaurant");
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
                    {/* <Container.RowCenterY style={styles.item} gap={5}>
                        <Text.SubTitle fontSize={17} lineHeight={17}>Mes activités</Text.SubTitle>
                        <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                    </Container.RowCenterY> */}
                    {/* <Container.RowCenterY style={styles.item} gap={5}>
                        <Text.SubTitle fontSize={17} lineHeight={17}>My favorites</Text.SubTitle>
                        <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                    </Container.RowCenterY> */}
                    <TouchableOpacity onPress={() => router.navigate("/(tab)/dashboard_user/(tabs)/notifications")}>
                      <Container.RowCenterY style={styles.item} gap={5}>
                          <Text.SubTitle fontSize={17} lineHeight={17}>Centre de notifications</Text.SubTitle>
                          <Icon.RR name={"arrow_right"} size={14} lineHeight={14}/>
                      </Container.RowCenterY>
                    </TouchableOpacity>
                </Container.Column>
                <Container.Column gap={15} style={styles.containerButton}>
                  <TouchableOpacity onPress={handlerSwtichMode}>
                    <Button.ButtonLandingPage>Mode entreprise</Button.ButtonLandingPage>
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={handlerLogout}>
                     <Button.ButtonLandingPageOutline>Se déconnecter</Button.ButtonLandingPageOutline>
                  </TouchableOpacity>
                </Container.Column>

            </Container.Column>
        </Container.View>
    </SafeAreaView>
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