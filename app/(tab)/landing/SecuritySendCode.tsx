import { StyleSheet , View, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback,Keyboard, Alert } from 'react-native'
import React, { ReactNode, useState, useEffect, useRef, useCallback }  from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { BlurView } from 'expo-blur';
import { TextInput } from 'react-native'; // Import TextInput from React Native
import { sendCode as sendCodeAuth, resendCode as resendCodeAuth } from '@/api/minted/auth';
import * as SecureStore from 'expo-secure-store';
import { isLoading } from 'expo-font';
import { useAuth } from '@/context/Auth';
import { RouteProp } from '@react-navigation/native';
import { useNotification } from '@/context/Notification';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Register: undefined;
  Welcome: undefined;
  Login: undefined;
  SecuritySendCode: undefined;
  ForgotPassword: { email?: string };
  NewPassword: undefined;

};


type SecuritySendCodeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SecuritySendCode',
  'Welcome'
>;

interface RouteParams {
  email: string;
}

interface SecuritySendCodeProps {
  navigation: SecuritySendCodeScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'SecuritySendCode'>;
}

const SecuritySendCode: React.FC<SecuritySendCodeProps> = ({navigation, route}) => {

  const [isloading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60)
  const [code, setCode] = useState(['','','','',''])
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { login } = useAuth();
  const { newNotification } = useNotification();
  const router = useRouter()

  const handleInputChange = (value :string, index: number) => {
    console.log("code",code)
    let newCode = [...code]
    if (value.length >= 5) {
      newCode = newCode.map((e,i)=> value[i] ? value[i] : e)
      setCode(newCode)
      inputRefs.current[value.length-1]?.focus(); // Passe au prochain input
    }else{
      newCode[index] = value[0]
      setCode(newCode)

      if (value.length == 1 && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus(); // Passe au prochain input
      }
    }
    sendCode(newCode)
  
  };

  const handleKeyDown = (e: React.KeyboardEvent<TextInput>, index: number) => {
    console.log("keyDown", e.nativeEvent.key)
    if (e.nativeEvent.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Retour au précédent input
    }
  };

  const sendCode = useCallback(async (codeSend:string|null = null) => {
    if (!codeSend) codeSend = code
    for (let i = 0; i < codeSend.length; i++) {
      if (codeSend[i] == "" || isNaN(parseInt(codeSend[i]))) return
    }
    setIsLoading(true)
    try {
      const {data} = await sendCodeAuth(codeSend.join(''), route.params.email)
      console.log('response', data)
      if (data.access_token && data.refresh_token && data.user) {
        router.replace("/(tab)/onboarding/(tabs)/Client");
        login(data.user, data.access_token, data.refresh_token)
        
      }else{
        throw new Error("");
      }
    } catch (error) {
      newNotification({
        icon: {name: 'circleWarning'},
        title: 'Code invalide ou expiré',
      })
      setCode(['','','','',''])
    }
  
    setIsLoading(false)
  },[code])

  const resendCode = useCallback(async () => {
    if (timeLeft > 0) return
    try {
      const {status} = await resendCodeAuth(route.params.email)
      if (status == 200) {
        newNotification({
          title: 'Le code envoyé avec succès',
          subTitle: 'Expire dans 60 secondes',
        })
        setTimeLeft(60)
      }
    } catch (error) {
      Alert.alert('Impossible de renvoyer le code de sécurité, veuillez réessayer ultérieurement.');
    }

  },[route.params.email, timeLeft])

  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Décrémente le temps toutes les secondes
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Nettoie l'intervalle à chaque changement d'état
  }, [timeLeft]);

  return (
    <Container.DismissKeyboard>
      <SafeAreaView style={{ flex: 1}}>
      
          <Container.Column flexGrow={1} style={{padding:30}}>
              <Container.ColumnCenterY flexGrow={1} gap={45}>
                {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Welcome')}>
                    <BlurView style={styles.buttonBack} intensity={10}>
                        <Icon.Minted name="chevron-left-bold" color='#fff' size={12}/>
                    </BlurView>
                </TouchableOpacity> */}
                
                <Container.Column>
                  <Container.Column gap={50}>

                    <Container.Column gap={7}>
                      <Text.SubTitle fontSize={24} lineHeight={24} letterSpacing={0.6} style={{textAlign: 'center'}}>Code de sécurité</Text.SubTitle>
                      <Text.Paragraphe color='#111132' fontSize={16} letterSpacing={0.6} lineHeight={21} style={{textAlign: 'center'}}>{`Entrez le code  vérification envoyé a,\n l\'adresse ${route.params.email}`}</Text.Paragraphe>
                    </Container.Column>
                    <Container.Row gap={0} style={{justifyContent: 'space-between'}}>

                        {
                          Array.from({ length: 5 }, (_,index) => (
                            <Input.MainInput 
                              ref={(el) => (inputRefs.current[index] = el)}
                              onChangeText={(text)=> handleInputChange(text ,index)}
                              onKeyPress={(e)=> handleKeyDown(e, index)}
                              value={code[index]}
                              inputStyle={styles.inputStyle} 
                              placeholder={'0'} 
                              placeholderTextColor={"#B8B8BC"} 
                              style={styles.containerInput}
                              keyboardType="number-pad" 
                            />
                          ))
                        }
                    </Container.Row>

                    <TouchableOpacity activeOpacity={0.6} onPress={() => sendCode(code)} style={{width:'100%'}}>
                        <Button.ButtonLandingPage loading={isloading}>Envoyer</Button.ButtonLandingPage>
                    </TouchableOpacity>
                  </Container.Column>
          
                  <Text.Paragraphe style={{marginTop:10}} color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={21}>{`Expire dans ${timeLeft}s`}</Text.Paragraphe>
                  
          


                </Container.Column>
              </Container.ColumnCenterY>
              <TouchableOpacity activeOpacity={0.6} onPress={resendCode}>
                <Container.RowCenter gap={4}>
                  <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Tu n'as pas reçu de code ?</Text.Paragraphe>
                  <Text.SubTitle color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Renvoyer</Text.SubTitle>
                  {timeLeft > 0 && <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15} style={{width:40}}>({timeLeft}s)</Text.Paragraphe>}
                </Container.RowCenter>
              </TouchableOpacity>
          </Container.Column>
        
      </SafeAreaView>
    </Container.DismissKeyboard>
  )
}

export default SecuritySendCode

const styles = StyleSheet.create({
  linearGradient: {
      flex: 1,
  },
  buttonBack: {
    height: 40,
    width: 40,
    borderRadius: 7,
    overflow: 'hidden',
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(145,136,141,0.5)',
  },

  containerInput: {
    // borderColor:"#F6ECFF",
    // borderWidth: 1,
    height: 56,
    width: 56,
  },

  inputStyle: {
    fontSize: 15,
    textAlign: 'center',
    flexGrow: 1
  },
})


