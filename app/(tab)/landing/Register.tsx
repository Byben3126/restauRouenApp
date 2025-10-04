import { StyleSheet , View, TouchableOpacity, SafeAreaView, Image, KeyboardAvoidingView} from 'react-native'
import React, { ReactNode, useState, useCallback}  from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { BlurView } from 'expo-blur';

import { createAccount } from '@/api/minted/auth'
import { AxiosError } from 'axios';
import { useNotification } from '@/context/Notification';


type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  SecuritySendCode: { email: string };
};


type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

interface RegisterProps {
  navigation: RegisterScreenNavigationProp;
}

const Register: React.FC<RegisterProps> = ({navigation}) => {

  const [isloading, setIsLoading] = useState(false);
  const [isAcceptedRules, setIsAcceptedRules] = useState(true);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  //context
  const { newNotification } = useNotification();

  const validateEmail = useCallback((email:string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  },[]);

  const pressRegister = useCallback(async () => {
    setError("");

    if (isloading || !isAcceptedRules || !lastName.length ||!firstName.length || !email.length || !password.length) return
    setIsLoading(true)
    if (!validateEmail(email)) {
      setError("L'adresse e-mail invalide.");
      setIsLoading(false)
      return;
    }
  
    try {
      const {data} = await createAccount(lastName, firstName, email, password)
      console.log('reponse',data)
      if (data.id) {
        navigation.navigate('SecuritySendCode', {email})
      }
      setIsLoading(false)
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 409:
            newNotification({
              icon: {name: 'circleWarning'},
              title: 'Email déjà utilisé',
              subTitle: 'Veuillez utiliser un autre email.',
            })
            break;
        }
      }
      setIsLoading(false)
    }

  },[lastName , firstName, email, password, isAcceptedRules])
  
  const handlerSetEmail = (text:string) => {
    setEmail(text.trim().toLowerCase());
  }
  return (
    
      <Container.DismissKeyboard>
          <SafeAreaView style={{ flex: 1}}>

            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={'padding'} // Ajuste le comportement selon la plateforme
            >
              <Container.Column flexGrow={1} style={{padding:30}}>
                  <Container.ColumnCenterY flexGrow={1} gap={45}>
                    <Text.SubTitle fontSize={24} lineHeight={28} letterSpacing={0.6} style={{textAlign: 'center'}}>{'Inscrivez-vous et gagner des récompenses !'}</Text.SubTitle>
                    <Container.Column>
                      <Container.Column gap={25}>
                        <Container.Column gap={12}>
                          <Input.MainInput 
                            value={lastName} 
                            onChangeText={setLastName} 
                            inputStyle={styles.inputStyle} 
                            placeholder={'Entrez votre nom'} 
                            placeholderTextColor={"#B8B8BC"} 
                            style={styles.containerInput}
                            autoCorrect={false}
                            iconRight={<Icon.RR name={"user"} color={"#71717A"} size={18} lineHeight={18}/>}
                          />

                          <Input.MainInput 
                            value={firstName} 
                            onChangeText={setFirstName} 
                            inputStyle={styles.inputStyle} 
                            placeholder={'Entrez votre prénom'} 
                            placeholderTextColor={"#B8B8BC"} 
                            style={styles.containerInput}
                            autoCorrect={false}
                            iconRight={<Icon.RR name={"user"} color={"#71717A"} size={18} lineHeight={18}/>}
                          />

                          <Input.MainInput 
                            value={email} 
                            onChangeText={handlerSetEmail} 
                            inputStyle={styles.inputStyle} 
                            placeholder={'Entrez votre email'} 
                            placeholderTextColor={"#B8B8BC"} 
                            style={styles.containerInput}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                            iconRight={<Icon.RR name={"envelope"} color={"#71717A"} size={14} lineHeight={16}/>}
                          />
                          <Input.MainInput 
                            value={password} 
                            onChangeText={setPassword} 
                            inputStyle={styles.inputStyle} 
                            placeholder={'Entrez votre mot de passe'} 
                            placeholderTextColor={"#B8B8BC"} 
                            style={styles.containerInput} 
                            keyboardType='visible-password'
                            autoCapitalize="none"
                            autoCorrect={false}
                            spellCheck={false}
                            textContentType="password"
                            
                          
                          />

          
                        </Container.Column>
                        {/* <TouchableOpacity activeOpacity={0.6} onPress={()=>{setIsAcceptedRules((currentValue) => (!currentValue))}} style={{width:'100%'}}>
                          <Container.RowCenterY gap={7}>
                                <Container.ColumnCenter style={styles.checkbox}>
                                  {isAcceptedRules && <Icon.Minted name='checkBold' size={9} color='#111132'></Icon.Minted>}
                                </Container.ColumnCenter>
                                <Text.Paragraphe color='#111132' fontSize={14} letterSpacing={0.6} lineHeight={21}>J'accepte les thermes et conditions</Text.Paragraphe>
                          </Container.RowCenterY>
                        </TouchableOpacity> */}

                        <TouchableOpacity activeOpacity={0.6} onPress={pressRegister} style={{width:'100%'}}>
                            <Button.ButtonLandingPage loading={isloading}>Créer mon compte</Button.ButtonLandingPage>
                        </TouchableOpacity>
                      </Container.Column>
                      <Text.Paragraphe color='#FF6868' lineHeight={32} fontSize={14}>{ error }</Text.Paragraphe>
                
                    </Container.Column>
                  </Container.ColumnCenterY>

                  <TouchableOpacity activeOpacity={0.6} onPress={()=>navigation.replace('Login')}>
                    <Container.RowCenter gap={4}>
                      <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Tu as deja un compte?</Text.Paragraphe>
                      <Text.SubTitle color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Se connecter</Text.SubTitle>
                    </Container.RowCenter>
                  </TouchableOpacity>
              </Container.Column>
            </KeyboardAvoidingView>
          </SafeAreaView>

          
      </Container.DismissKeyboard>
    
  )
}

export default Register

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
  },

})