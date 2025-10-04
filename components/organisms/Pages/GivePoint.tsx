import { StyleSheet, Image, TouchableOpacity , View} from 'react-native'
import React, {useState} from 'react'
import { Button, Container, Text } from '@/components/atoms'
import { Input } from '@/components/molecules'
import Colors from '@/constants/Colors'
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ButtonLandingPageOutline } from '@/components/atoms/Button'
import {givePoints} from '@/api/minted/customer';
import { useNotification } from '@/context/Notification'
import * as Types from '@/types';

export type RootStackParamList = {
    GivePoint: { customer?: Types.Customer };
    Succefull: { customer: Types.Customer, points: number };
};




const Stack = createNativeStackNavigator<RootStackParamList>();


export interface GivePointScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GivePoint'>;
  route: RouteProp<RootStackParamList, 'GivePoint'>;
}

const GivePointScreen = ({ navigation, route }: GivePointScreenProps) => {
  const [points, setPoints] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //context
  const { newNotification } = useNotification()

  const confirm = async () => {
    if (isLoading || !route.params?.customer) return;
    setIsLoading(true)
    try {
      await givePoints(route.params?.customer.id, Number(points))
      navigation.replace('Succefull', { customer: route.params.customer, points: Number(points) })
    } catch (error) {

      newNotification({
          title: "Envoi de points impossible",
          subTitle: 'Veuillez contacter le support'
      })
      navigation.goBack()
    }
    setIsLoading(false)

  }

  return (
    <Container.DismissKeyboard>
      <Container.View flexGrow={1}>
      <Container.ColumnCenter flexGrow={1} gap={30}>
        <Container.ColumnCenter gap={10}>
          <Text.SubTitle fontSize={24} lineHeight={24}>
            Envoi de point
          </Text.SubTitle>
          <Container.View>
            <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={14} lineHeight={16}>Veuillez saisir le nombre de points que vous souhaitez donner à cet utilisateur.

</Text.Paragraphe>
          </Container.View>
        </Container.ColumnCenter>
        <Container.Column gap={20}>
          <Input.MainInput
            placeholderTextColor={Colors.grey}
            placeholder="Entrez le nombre de points"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={3}
            value={points}
            onChangeText={setPoints}
          />
      
        </Container.Column>
        <TouchableOpacity style={{ width: "100%" }} onPress={confirm}>
          <Button.ButtonLandingPage style={{ width: "100%" }} loading={isLoading} disabled={!points || isNaN(Number(points)) || Number(points) <= 0}>
            Envoyé
          </Button.ButtonLandingPage>
        </TouchableOpacity>
      
      </Container.ColumnCenter>
      </Container.View>
    </Container.DismissKeyboard>
  )
}

export interface SuccefullScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Succefull'>;
  route: RouteProp<RootStackParamList, 'Succefull'>;
}

const SuccefullScreen = ({ navigation, route }: SuccefullScreenProps) => {
  return (
    <Container.View flexGrow={1}>
      <Container.ColumnCenter flexGrow={1} gap={30}>
        <Image style={[{aspectRatio: 1/1, width: '70%', height: 'auto'}]} source={require('@/assets/images/sucess_add_point.png')}/>
        <Text.Title fontSize={16} lineHeight={24} textAlign='center'>
          🎉 Les points ont bien été ajoutés !
        </Text.Title>
        <View>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={22} textAlign='center'>
              Tu as donné à <Text.Title fontSize={14} lineHeight={22}>{ (`${route.params.customer?.user?.identity.first_name || ''}`).trim()}</Text.Title> {route.params.points} points! {'\n'}Merci de les faire se sentir spéciaux et de les encourager à revenir
            </Text.Paragraphe>
        </View>
       
        <Container.Column style={{ width: "100%" }} gap={15}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Button.ButtonLandingPage style={{ width: "100%" }}>
              Retour à l'accueil
            </Button.ButtonLandingPage>
          </TouchableOpacity>
          {/* <ButtonLandingPageOutline>
            Scan next QR code
          </ButtonLandingPageOutline> */}
        </Container.Column>
       
      </Container.ColumnCenter>
    </Container.View>
  )
}

type RootStackDefault = {
  GivePoint: { customer?: Types.Customer };
};


export interface GivePointStackProps {
  navigation: NativeStackNavigationProp<RootStackDefault, 'GivePoint'>;
  route: RouteProp<RootStackDefault, 'GivePoint'>;
}

const GivePointStack = ({ navigation, route }: GivePointStackProps) =>  {
  console.log('GivePointStack', route.params.customer);
  return (
    <Stack.Navigator
      initialRouteName="GivePoint"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'white' },
      }}
      
    >
      <Stack.Screen 
        name="GivePoint" 
        component={GivePointScreen} 
        initialParams={{customer : route.params?.customer }}
      />

      <Stack.Screen 
        name="Succefull" 
        component={SuccefullScreen} 
        initialParams={{customer : route.params?.customer }}
        options={({ navigation }) => ({
          headerShown: false,
          headerTransparent: false,
          headerTitle: '',
          sheetAllowedDetents: [0.99],  
        })}
      />

    </Stack.Navigator>
  )
}

export default GivePointStack

const styles = StyleSheet.create({
  input: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputTextarea: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 120,
    textAlignVertical: "top",
  },
  inputStyleTextarea: {
    lineHeight: 20,
  },
  datePicker: {
    backgroundColor: "#fff",
    height: 56,
    borderColor: "#71717A",
    borderWidth: 1,
    borderRadius: 24,
    width: 300,
  },
});

