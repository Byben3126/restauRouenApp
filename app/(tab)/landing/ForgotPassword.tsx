import { StyleSheet , TouchableOpacity, SafeAreaView, Keyboard} from 'react-native'
import React, { useState, useCallback }  from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { BlurView } from 'expo-blur';
import { AxiosError } from 'axios';
import { useNotification } from '@/context/Notification';
//api
import { sendPasswordResetEmail } from '@/api/minted/auth'

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };
  NewPassword: undefined;
};

interface ForgotPasswordProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
  route: RouteProp<RootStackParamList, 'ForgotPassword'>;
}
const ForgotPassword: React.FC<ForgotPasswordProps> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState(route.params?.email ?? '');
  const { newNotification } = useNotification()

  const pressForgotPassword = useCallback(async () => {
    Keyboard.dismiss()
    if (!email.length || isLoading) return
    setIsLoading(true)

    try {
      const {data} = await sendPasswordResetEmail(email)

      newNotification({
        title: 'Demande envoyé',
        subTitle: 'Vérifiez votre boîte mail',
        icon: {
          name: 'check-badge'
        }
      })
      navigation.navigate('Welcome')
      setIsLoading(false)
    } catch (error) {
        setIsLoading(false)
        if (error instanceof AxiosError ) {
            // console.log("buyArticle", error.response?.data)
            if (error.response?.status == 429) {
                newNotification({
                  title: 'Réinitialisation déjà demandée',
                  subTitle: 'Veuillez réessayer plus tard',
                  icon: {
                    name: 'clock'
                  }
                })
                return
            }
        }

        newNotification({
          title: 'Une erreur est survenue',
          subTitle: 'Veuillez réessayer plus tard',
          icon: {
            name: 'circleWarning'
          }
        })   
    }
  }, [email, isLoading]);

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
                <Container.Column gap={7}>
                  <Text.SubTitle fontSize={24} lineHeight={24} letterSpacing={0.6} style={{textAlign: 'center'}}>Mot de passe oublié</Text.SubTitle>
                  {/* <Text.Paragraphe color='#111132' fontSize={16} letterSpacing={0.6} lineHeight={21}>{'Vérifiez votre e-mail afin de \nréinitialiser votre mot de passe.'}</Text.Paragraphe> */}
                </Container.Column>
                <Container.Column>
                  <Container.Column gap={25}>
                    <Container.Column gap={12} style={{alignItems: 'flex-end'}}>
                      <Input.MainInput 
                        inputStyle={styles.inputStyle} 
                        placeholder={'Email du compte'} 
                        placeholderTextColor={"#B8B8BC"} 
                        style={styles.containerInput}
                        onChangeText={setEmail}
                        value={email}
                        keyboardType='email-address'
                        autoCorrect={false}
                        spellCheck={false}
                      />
                    </Container.Column>

                    <TouchableOpacity activeOpacity={0.6} onPress={pressForgotPassword} style={{width:'100%'}}>
                        <Button.ButtonLandingPage loading={isLoading}>Envoyé</Button.ButtonLandingPage>
                    </TouchableOpacity>
                  </Container.Column>
             
                </Container.Column>
              </Container.ColumnCenterY>
              {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.replace('Register')}>
                <Container.RowCenter gap={4}>
                  <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Tu n'as pas de compte?</Text.Paragraphe>
                  <Text.SubTitle color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>S'inscrire</Text.SubTitle>
                </Container.RowCenter>
              </TouchableOpacity> */}
          </Container.Column>
        </SafeAreaView>
    </Container.DismissKeyboard>
  )
}

export default ForgotPassword

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