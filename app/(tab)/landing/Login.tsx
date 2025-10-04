import { StyleSheet , View, TouchableOpacity, SafeAreaView, Image, Keyboard} from 'react-native'
import React, { ReactNode, useState, useCallback }  from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@/context/Auth';
import axios, { AxiosError } from 'axios';
import { useNotification } from '@/context/Notification';
//api
import { login as loginApi} from '@/api/minted/auth'
type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
};


type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginProps {
  navigation: LoginScreenNavigationProp;
}
const Login: React.FC<LoginProps> = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth()
  const { newNotification } = useNotification()

  const handlerSetEmail = (text:string) => {
    setEmail(text.trim().toLowerCase());
  }

  const pressLogin = useCallback(async () => {
    Keyboard.dismiss()
    if (!email.length || !password.length || isLoading) return
      setIsLoading(true)
    try {
      const {data} = await loginApi(email, password)
      console.log('data login' , data)
      if (data.access_token && data.refresh_token && data.user) {
        login(data.user, data.access_token, data.refresh_token)
      }
      setIsLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.status == 401) {
          newNotification({
            title: 'Identifiant incorrect',
            subTitle: 'Mot de passe et/ou Email',
            icon: {
              name: 'key'
            }
          })
        }
        console.log("error login", error.response)
      }

      setIsLoading(false)
    }
  }, [email, password, isLoading]);

  return (
    <Container.DismissKeyboard>
        <SafeAreaView style={{ flex: 1}}>
          <Container.Column flexGrow={1} style={{padding:30}}>
              <Container.ColumnCenterY flexGrow={1} gap={45}>
                <Text.SubTitle fontSize={24} lineHeight={24} letterSpacing={0.6} style={{textAlign: 'center'}}>Se connecter</Text.SubTitle>
                <Container.Column>
                  <Container.Column gap={30}>
                    <Container.Column gap={12} style={{alignItems: 'flex-end'}}>
                      <Input.MainInput 
                        inputStyle={styles.inputStyle} 
                        placeholder={'Entrez votre email'} 
                        placeholderTextColor={"#B8B8BC"} 
                        style={styles.containerInput}
                        onChangeText={handlerSetEmail}
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                        iconRight={<Icon.RR name={"envelope"} color={"#71717A"} size={14} lineHeight={16}/>}
                      />
                  
                      <Input.MainInput 
                        inputStyle={styles.inputStyle} 
                        placeholder={'Entrez votre mot de passe'} 
                        placeholderTextColor={"#B8B8BC"} 
                        style={styles.containerInput}
                        onChangeText={setPassword}
                        value={password}
                        keyboardType='visible-password'
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                        textContentType="password"
                      />
                      <TouchableOpacity activeOpacity={0.6} style={{opacity:1}} onPress={()=>navigation.replace('ForgotPassword', { email: email})}>
                        <Text.Paragraphe fontSize={15} letterSpacing={0} lineHeight={21}>Mot de passe oublié ?</Text.Paragraphe>
                      </TouchableOpacity>
                    </Container.Column>

                    <TouchableOpacity activeOpacity={0.6} onPress={pressLogin} style={{width:'100%'}}>
                        <Button.ButtonLandingPage loading={isLoading}>Se connecter</Button.ButtonLandingPage>
                    </TouchableOpacity>
                  </Container.Column>
                  {/* <Container.RowCenterY gap={8} style={{marginVertical:25}}>
                    <View style={styles.line}></View>
                    <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={21}>ou connecte toi avec</Text.Paragraphe>
                    <View style={styles.line}></View>
                  </Container.RowCenterY>
                  <Container.RowCenterY gap={8}>
                    <Container.RowCenter gap={11} style={styles.buttonNetwork} flexGrow={1}>
                      <Image style={styles.imageNetwork} source={require('@/assets/images/ico-google-2x.png')}/>
                      <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={17}>Google</Text.Paragraphe>
                    </Container.RowCenter>

                    <Container.RowCenter gap={11} style={styles.buttonNetwork} flexGrow={1}>
                      <Image style={styles.imageNetwork} source={require('@/assets/images/ico-facebook-2x.png')}/>
                      <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={17}>Facebook</Text.Paragraphe>
                    </Container.RowCenter>
              
                  </Container.RowCenterY> */}
                </Container.Column>
              </Container.ColumnCenterY>
              <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.replace('Register')}>
                <Container.RowCenter gap={4}>
                  <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Tu n'as pas de compte?</Text.Paragraphe>
                  <Text.SubTitle color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>S'inscrire</Text.SubTitle>
                </Container.RowCenter>
              </TouchableOpacity>
          </Container.Column>
        </SafeAreaView>
    </Container.DismissKeyboard>
  )
}

export default Login

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
    width: '100%',
    paddingLeft:22,
    paddingRight:8,
  },

  inputStyle: {
    fontSize: 15,
  },

  checkbox: {
    height: 19,
    width: 19,
    borderRadius: 3,
    backgroundColor: "#fff",
    borderColor:"#F6ECFF",
    borderWidth: 1,
  },
  line : {
    backgroundColor: "#160837",
    height: 1,
    flexGrow: 1
  },
  buttonNetwork: {
    height: 47,
    borderRadius: 10,
    borderColor:"#F6ECFF",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  imageNetwork: {
    height: 22,
    width: 22
  }
})