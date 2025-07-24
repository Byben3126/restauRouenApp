import { StyleSheet , TouchableOpacity, SafeAreaView, Keyboard} from 'react-native'
import React, { useState, useCallback }  from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { BlurView } from 'expo-blur';
import { useRouter , useLocalSearchParams} from 'expo-router';
import { useNotification } from '@/context/Notification';

//api
import { sendNewPassword } from '@/api/minted/auth'

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  SecuritySendCode: { email: string };
  NewPassword: { token: string };
};


type NewPasswordProps = {

};
const NewPassword: React.FC<NewPasswordProps> = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams();

  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('');

  const { newNotification } = useNotification()

  const pressNewPassword = useCallback(async () => {
    Keyboard.dismiss()
    if (!password.length || isLoading) return
    setIsLoading(true)

    try {
      const {data} = await sendNewPassword(token, password)
      newNotification({
          title: 'Mot passe modifié',
          subTitle: 'Veuillez vous connecter',
      })
      setIsLoading(false)
      router.push('/landing')
    } catch (error) {
       newNotification({
          title: 'Lien invalide ou expiré',
          subTitle: 'Veuillez regenerer un lien',
          icon: {name: 'circleWarning'},
      })
      setIsLoading(false)
    }
  }, [isLoading, password, router]);

  return (
    <Container.DismissKeyboard>
      <SafeAreaView style={{ flex: 1, backgroundColor:'white'}}>
        <Container.Column flexGrow={1} style={{padding:30}}>
            <Container.ColumnCenterY flexGrow={1} gap={45}>
              {/* <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/landing')}>
                  <BlurView style={styles.buttonBack} intensity={10}>
                      <Icon.Minted name="chevron-left-bold" color='#fff' size={12}/>
                  </BlurView>
              </TouchableOpacity> */}
              <Container.Column gap={7}>
                <Text.SubTitle fontSize={33} lineHeight={33} textAlign='center' letterSpacing={0.6}>Nouveau mot de passe</Text.SubTitle>
                <Text.Paragraphe color='#111132' fontSize={16} letterSpacing={0.6} lineHeight={21} style={{textAlign: 'center'}}>{'Vous êtes sur le point de\nréinitialiser votre mot de passe.'}</Text.Paragraphe>
              </Container.Column>
              <Container.Column>
                <Container.Column gap={25}>
                  <Container.Column gap={12} style={{alignItems: 'flex-end'}}>
                    <Input.MainInput 
                      inputStyle={styles.inputStyle} 
                      placeholder={'Nouveau mot de passe'} 
                      placeholderTextColor={"#B8B8BC"} 
                      style={styles.containerInput}
                      onChangeText={setPassword}
                      value={password}
                      keyboardType='visible-password'
                      autoCorrect={false}
                      spellCheck={false}
                    />
                  </Container.Column>

                  <TouchableOpacity activeOpacity={0.6} onPress={pressNewPassword} style={{width:'100%'}}>
                      <Button.ButtonLandingPage loading={isLoading}>Confirmer</Button.ButtonLandingPage>
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

export default NewPassword

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