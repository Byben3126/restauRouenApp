import { StyleSheet, View, Image, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useRef, useCallback, useEffect} from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Text, Button, Container } from '@/components/atoms';
import { Card, Input, Header } from '@/components/molecules';
import NewOffer from '@/components/organisms/Pages/NewOffer';
import GivePoint from '@/components/organisms/Pages/GivePoint';
import { BarcodeScanningResult } from 'expo-camera';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useNotification } from '@/context/Notification';
import { searchCustomers, createCustomer } from '@/api/minted/customer';
import { useTokenReward } from '@/api/minted/reward';
import { useTokenPromotion } from '@/api/minted/promotion';
import { useLoader } from '@/context/Loader';
import Colors from '@/constants/Colors';
import * as Types from '@/types';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';

export type RootStackParamList = {
  QrCode: { customer?: Types.CustomerCardAdmin };
  EnterCode: undefined;
  NewOffer: { customer?: Types.Customer };
  GivePoint: { customer?: Types.Customer };
  PromotionUsed: { promotion: Types.PromotionRead };
  RewardUsed: { reward: Types.RewardRead };
};

interface DecodedToken {
  promotion_id?: number;
  reward_id?: number;
  link_code?: string;
  [key: string]: any; // Pour les autres propriétés potentielles
}



const Stack = createNativeStackNavigator<RootStackParamList>();

export interface QrCodeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QrCode'>;
  route: RouteProp<RootStackParamList, 'QrCode'>;
}

const QrCodeScreen = ({ navigation, route }: QrCodeScreenProps) => {

    const [permission, requestPermission] = useCameraPermissions();
    const [isFocused, setIsFocused] = useState(false);
    const [customer, setCustomer] = useState<Types.CustomerCardAdmin|null>(null);
  
    //Ref
    const scanned = useRef(false);

    //conntext
    const { newNotification } = useNotification()
    const { setLoader } = useLoader()

    const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
      console.log('handleBarCodeScanned', scanned.current);
      if (!scanned.current) { // Vérifiez scanned.current
        scanned.current = true;

        if (result.type === 'qr') {

          if (result.data.length == 8) {
            const {data} = await searchCustomers(result.data)
            if (data && data.length > 0) {
              setCustomer(data[0]);
              return
            }else{
              const {data} = await createCustomer({
                user_link_code: result.data.toUpperCase(),
              })
              navigation.navigate('QrCode', { customer: data })
              return
            }
          }else{

            try {
              const decodedToken:DecodedToken= jwtDecode(result.data);
              
              if (decodedToken.link_code) {
           
                if (decodedToken.promotion_id) {
                  setLoader(true)
                  setTimeout(async () => {
                    try {
                      const {data} = await useTokenPromotion(result.data);
                      navigation.navigate('PromotionUsed', { promotion: data });
                    } catch (error) {
                      if (error instanceof AxiosError ) {
                        newNotification({
                          title: 'QrCode invalid',
                          subTitle: "Veuillez réessayer avec un autre code",
                        })
                      }
                    }
         
                    console.log('Reward détectée:', decodedToken);
                    setLoader(false)
                    scanned.current = false;
                  },1000)
                  return
                }else if (decodedToken.reward_id) {
                  setLoader(true)
                  setTimeout(async () => {
                    try {
                      const {data} = await useTokenReward(result.data);
                      navigation.navigate('RewardUsed', { reward: data });
                    } catch (error) {
                      if (error instanceof AxiosError ) {
                        newNotification({
                          title: 'QrCode invalid',
                          subTitle: "Veuillez réessayer avec un autre code",
                        })
                      }
                    }
                    setLoader(false)
                    scanned.current = false;
                  },1000)
             
                  return
                }
              }
              
            } catch (error) {
              console.error("Error decoding JWT", error);
            }
          }

          newNotification({
            title: 'QrCode invalid',
            subTitle: "Veuillez réessayer avec un autre code",
          })
        }

        scanned.current = false;
      };
    }

    const handlerCardOnBlur = () => {
      setCustomer(null)
      scanned.current = false;
    }

    useFocusEffect(
      useCallback(() => {
          setIsFocused(true);
          scanned.current = false;
          
          return () => {
            // setCustomer(null)
            setIsFocused(false);
          };
      }, [navigation])
    );

    useEffect(() => {
      if (route.params?.customer) {
        setCustomer(route.params.customer);
      }
    }, [route.params?.customer]);

    if (!permission) {
      // Camera permissions are still loading.
      return <View />;
    }
  
    if (!permission.granted) {
      // Camera permissions are not granted yet.
      return (
        <View style={QrCodeScreenStyles.container}>
          <Text.SubTitle style={QrCodeScreenStyles.message}>We need your permission to show the camera</Text.SubTitle>
        
          <TouchableOpacity onPress={requestPermission}><Button.ButtonRadius>Grant permission</Button.ButtonRadius></TouchableOpacity>
        </View>
      );
    }

    return (
        <View style={QrCodeScreenStyles.container}>
          <View style={QrCodeScreenStyles.overlay}>

            {customer && 
              <View style={QrCodeScreenStyles.containerCardUser}>
                <Card.CardUser
                  customer={customer}
                  newOfferCb={()=>navigation.navigate('NewOffer', { customer: customer })} 
                  givePointCb={()=>navigation.navigate('GivePoint', { customer: customer })}
                />
              </View>
            }

            <TouchableWithoutFeedback onPress={handlerCardOnBlur}>
              <SafeAreaView style={QrCodeScreenStyles.safeAreaView}>
                <Container.ColumnCenter gap={12} style={QrCodeScreenStyles.topOverlay}>
                  <Text.SubTitle fontSize={24} lineHeight={24} color='#fff'>Scan QR Code</Text.SubTitle>
                  <Text.Paragraphe fontSize={16} lineHeight={19} color='#fff' fontFamily='Urbanist-Medium' textAlign='center'>{"Alignez le QR code avec le cadre\n pour le scanner automatiquement"}</Text.Paragraphe>
                </Container.ColumnCenter>
                <TouchableOpacity style={QrCodeScreenStyles.bottomOverlay} onPress={() => navigation.navigate('EnterCode')}>
                  <Text.Paragraphe fontSize={16} lineHeight={16} color='#fff' fontFamily='Urbanist-Medium' textAlign='center'>Scan impossible?</Text.Paragraphe>
                  <Text.SubTitle fontSize={16} lineHeight={16} color='#fff'>Saisir code</Text.SubTitle>
                </TouchableOpacity>
              </SafeAreaView>
            </TouchableWithoutFeedback>

            

            <Image
              source={require('@/assets/images/overlay_qr_code.png')} // Chemin vers l'image
              style={QrCodeScreenStyles.overlayImage}
              resizeMode="cover" // Ajuste l'image pour couvrir l'écran
            />
          </View>

          <CameraView 
              style={QrCodeScreenStyles.camera} 
              facing={'back'}
              barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarCodeScanned}
              active={isFocused} // Active la caméra uniquement lorsque l'écran est focalisé
          />
        </View>
      );
};

export interface PromotionUsedScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PromotionUsed'>;
  route: RouteProp<RootStackParamList, 'PromotionUsed'>;
}
const PromotionUsedScreen = ({ navigation, route }: PromotionUsedScreenProps) => {
  const { promotion } = route.params;
  return (
    <Container.View flexGrow={1}>
      <Container.ColumnCenter flexGrow={1} gap={30}>
        <Image style={[{aspectRatio: 1/1, width: '70%', height: 'auto'}]} source={require('@/assets/images/sucess_add_point.png')}/>
        <Text.Title fontSize={16} lineHeight={24} textAlign='center'>
          Promotion valide ! 
        </Text.Title>
        <View>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={22} textAlign='center'>
             
              {promotion.name}
              {'\n'}
               {'\n'}
              La promotion a été utilisée avec succès.
            </Text.Paragraphe>
        </View>
       
        <Container.Column style={{ width: "100%" }} gap={15}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Button.ButtonLandingPage style={{ width: "100%" }}>
              Return
            </Button.ButtonLandingPage>
          </TouchableOpacity>
        </Container.Column>
       
      </Container.ColumnCenter>
    </Container.View>
  );
}

export interface RewardUsedScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RewardUsed'>;
  route: RouteProp<RootStackParamList, 'RewardUsed'>;
}
const RewardUsedScreen = ({ navigation, route }: RewardUsedScreenProps) => {
  const { reward } = route.params;
  return (
    <Container.View flexGrow={1}>
      <Container.ColumnCenter flexGrow={1} gap={30}>
        <Image style={[{aspectRatio: 1/1, width: '70%', height: 'auto'}]} source={require('@/assets/images/sucess_add_point.png')}/>
        <Text.Title fontSize={16} lineHeight={24} textAlign='center'>
          Reward valide ! 
        </Text.Title>
        <View>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={22} textAlign='center'>
             
              {reward.name}
              {'\n'}
               {'\n'}
              Le reward a été utilisée avec succès.
            </Text.Paragraphe>
        </View>
       
        <Container.Column style={{ width: "100%" }} gap={15}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Button.ButtonLandingPage style={{ width: "100%" }}>
              Return
            </Button.ButtonLandingPage>
          </TouchableOpacity>
        </Container.Column>
       
      </Container.ColumnCenter>
    </Container.View>
  );
}

export interface EnterCodeScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EnterCode'>;
    route: RouteProp<RootStackParamList, 'EnterCode'>;
}

const EnterCodeScreen = ({ navigation, route }: EnterCodeScreenProps) => {
  const [linkCode, setLinkCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  //conntext
  const { newNotification } = useNotification()

  const comfirm = async () => {
    if (isLoading) return
    if (linkCode.length == 8) {
      setIsLoading(true);


      try {
        const {data} = await searchCustomers(linkCode.toUpperCase())
        if (data && data.length > 0) {
          navigation.navigate('QrCode', { customer: data[0] })
          return
        }else{
          const {data} = await createCustomer({
            user_link_code: linkCode.toUpperCase(),
          })
          navigation.navigate('QrCode', { customer: data })
          return
        }
      } catch (error) {
       
      }
      
      setIsLoading(false);

      
   
    }

    newNotification({
      title: 'Code invalid',
      subTitle: "Veuillez réessayer",
    })   
  }

  return (
    <Container.View flexGrow={1}>
      <Container.ColumnCenter flexGrow={1} gap={30}>
        <Container.ColumnCenter gap={10}>
          <Text.SubTitle fontSize={24} lineHeight={24}>
            Saisir le code
          </Text.SubTitle>
          <Container.View>
            <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={14} lineHeight={16}>Si vous rencontrez des difficultés lors du sacan, saisissez le code ci-dessous</Text.Paragraphe>
          </Container.View>
        </Container.ColumnCenter>
        <Container.Column gap={20}>
          <Input.MainInput
            placeholderTextColor={Colors.grey}
            placeholder="Entrez le code"
            style={EnterCodeScreenStyles.input}
            maxLength={8}
            value={linkCode}
            onChangeText={setLinkCode}
            autoCapitalize="characters"
            readOnly={isLoading}
          />
      
        </Container.Column>
        <TouchableOpacity onPress={comfirm} disabled={linkCode.length !== 8} style={{ width: "100%" }}>
          <Button.ButtonLandingPage style={{ width: "100%" }} loading={isLoading} disabled={linkCode.length !== 8}>
            Suivant
          </Button.ButtonLandingPage>
        </TouchableOpacity>
      
      </Container.ColumnCenter>

      <TouchableOpacity style={EnterCodeScreenStyles.bottomOverlay} onPress={() => navigation.navigate('QrCode')}>
        <Text.Paragraphe fontSize={16} lineHeight={16} color='#000' fontFamily='Urbanist-Medium' textAlign='center'>Scan possible?</Text.Paragraphe>
        <Text.SubTitle fontSize={16} lineHeight={16} color='#000'>Scanner le QR Code</Text.SubTitle>
      </TouchableOpacity>
    </Container.View>
  )
}

const QrCodeStack = () => {
  
  return (
      <Stack.Navigator
        initialRouteName="QrCode"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        }}
        
      >
        <Stack.Screen name="QrCode" component={QrCodeScreen} />
        <Stack.Screen name="EnterCode" component={EnterCodeScreen} />

        <Stack.Screen 
          name="PromotionUsed" 
          component={PromotionUsedScreen} 
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
          name="RewardUsed" 
          component={RewardUsedScreen} 
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
          name="NewOffer" 
          component={NewOffer} 
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
          name="GivePoint" 
          component={GivePoint} 
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
};

export default QrCodeStack;

const QrCodeScreenStyles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  overlay: {
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex:999,
  },


  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex:1000
  },

  safeAreaView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex:1001
  },
  topOverlay: {
    height: '34%',
  },
  bottomOverlay: {
    height: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  containerCardUser: {
    position: 'absolute',
    bottom: 0,
    left:0,
    right:0,
    padding: 15,
    zIndex: 1002,
  }
});

const EnterCodeScreenStyles = StyleSheet.create({
  input: {
    width: "100%",
    paddingHorizontal: 20,
  },
  bottomOverlay: {
    height: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
})