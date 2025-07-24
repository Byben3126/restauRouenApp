import { StyleSheet, TouchableOpacity, SafeAreaView, Image, TextInput} from 'react-native'
import React, { useRef, useCallback}  from 'react'
import { Container, Button, Text, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { useNotification } from '@/context/Notification';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './index';
import { useRouter } from "expo-router";

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'RestaurantRegister'>;

const RestaurantRegister = ({navigation}:RegisterProps) => {
  
  const buisnessName = useRef<string | null>(null);
  const googleMyBuisnessLink = useRef<string | null>(null);

  //context
  const router = useRouter();
  const { newNotification } = useNotification()

  const handleGoToLocation = useCallback(() => {
    if (buisnessName.current) {
      navigation.navigate('RestaurantLocation', {
        restaurantData: {
          buisnnessName: buisnessName.current,
          googleMyBuisnessLink: googleMyBuisnessLink.current,
        },
      })
      return
    }

    newNotification({
      title: 'Champ manquant',
      subTitle: "Nom de l'enseigne invalid",
    })

  }, [buisnessName]);

  return (
    <Container.DismissKeyboard>
        <SafeAreaView style={{ flex: 1}}>
            <Container.Column flexGrow={1} style={{padding:30}}>
                <Container.ColumnCenterY flexGrow={1} gap={45}>
                  <Text.SubTitle fontSize={24} lineHeight={28} letterSpacing={0.6} style={{textAlign: 'center'}}>{'Créez votre espace et commencez à fidéliser!'}</Text.SubTitle>
                  <Container.Column>
                    <Container.Column gap={25}>
                      <Container.Column gap={12}>
                        <Input.MainInput 
                          inputStyle={styles.inputStyle} 
                          placeholder={"Nom de l'enseigne"} 
                          placeholderTextColor={"#B8B8BC"} 
                          style={styles.containerInput}
                          autoCorrect={false}
                          onChangeText={(text) => buisnessName.current = text}
                        />

                        <Input.MainInput 
                          inputStyle={styles.inputStyle} 
                          placeholder={'Lien Goole My Buisness (optionnel)'} 
                          placeholderTextColor={"#B8B8BC"} 
                          style={styles.containerInput}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          spellCheck={false}
                          onChangeText={(text) => googleMyBuisnessLink.current = text}
                        />
                      </Container.Column>

                      <TouchableOpacity activeOpacity={0.6} onPress={handleGoToLocation}>
                          <Button.ButtonLandingPage loading={false} iconRight={<Icon.RR name='arrow_right' color='#fff' size={12}/>}>
                            Localiser mon enseigne
                          </Button.ButtonLandingPage>
                      </TouchableOpacity>
                    </Container.Column>

                  </Container.Column>
                </Container.ColumnCenterY>

                <TouchableOpacity activeOpacity={0.6} onPress={()=>router.push("/")}>
                  <Container.RowCenter gap={4}>
                    <Text.Paragraphe color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Continuer plus tard ? </Text.Paragraphe>
                    <Text.SubTitle color='#111132' fontSize={15} letterSpacing={0.6} lineHeight={15}>Espace client</Text.SubTitle>
                  </Container.RowCenter>
                </TouchableOpacity>
            </Container.Column>
      
        </SafeAreaView>
    </Container.DismissKeyboard>
  )
}

export default RestaurantRegister

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

  iconButton: {
    
  }

})