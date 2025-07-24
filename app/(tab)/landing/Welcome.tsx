import { StyleSheet , Image, TouchableOpacity, SafeAreaView} from 'react-native'
import React, { ReactNode, useEffect }  from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Container, Button, Text } from '@/components/atoms';
import { loginAccountVinted } from '@/api/vinted/auth';

type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
};


type WelcomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Welcome'
>;
  
interface WelcomeProps {
    navigation: WelcomeScreenNavigationProp;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {

   

  return (
        
      
    <SafeAreaView style={{ flex: 1}}>
        <Container.View flexGrow={1}>
            
            <Container.ColumnCenterX flexGrow={1}>
                <Container.ColumnCenter flexGrow={1} gap={45}>
                    <Container.ColumnCenterX gap={5}>
                        <Container.RowCenterY gap={8}>
                            <Text.SubTitle fontSize={33} lineHeight={33} letterSpacing={0.6}>Hey</Text.SubTitle>
                            <Image style={styles.imageHand} source={require('@/assets/images/emoji_hand.png')}/>
                        </Container.RowCenterY>
                        <Text.SubTitle fontSize={33} lineHeight={33} letterSpacing={0.6}>Bienvenue à toi!</Text.SubTitle>
                    </Container.ColumnCenterX>
                    <Text.Paragraphe color='#111132' fontSize={16} letterSpacing={0.6} lineHeight={21} textAlign="center">{'Sois le premier sur les offres Vinted \n grâce à notre outils performant'}</Text.Paragraphe>
                </Container.ColumnCenter>
                <Container.ColumnCenterX style={styles.containerButtons} gap={10}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Register')} style={{width:'100%'}}>
                        <Button.ButtonLandingPage>Je m'inscris</Button.ButtonLandingPage>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Login')} style={{width:'100%'}}>
                        <Button.ButtonLandingPageOutline>J'ai deja un compte</Button.ButtonLandingPageOutline>
                    </TouchableOpacity>
                </Container.ColumnCenterX>
            </Container.ColumnCenterX>
        </Container.View>
    </SafeAreaView>
       
       
  )
}

export default Welcome

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
    },
    containerButtons : {
        width: '100%'
    },
    imageHand: {
        height: 37,
        width: 37
    }
})