import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Container, Text, Button } from '@/components/atoms';
import { Input } from '@/components/molecules';
import { useSelector } from 'react-redux';
import * as Types from '@/types'
import { useLoader } from '@/context/Loader';
import { useNotification } from '@/context/Notification';
import { useDispatch } from 'react-redux';
import { update_user } from '@/store/slices/user';
import { updateUser } from '@/api/minted/user';

import { Icon } from '@/components/atoms';

const Profil = () => {
  

  const [email, setEmail] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [loadingSave, setLoadingSave] = useState<boolean>(false)

  //context
  const user = useSelector((state:Types.Store) => state.user.value);
  const { setLoader } = useLoader()
  const { newNotification } = useNotification()
  const dispatch = useDispatch();

  //methods
  const handlerSave = async () => {
    setLoadingSave(true)
    try {
      const {data} = await updateUser({
        identity: {
          first_name: firstName,
          last_name: lastName,
        }
      })
      console.log('data', data)
      dispatch(update_user(data))
      newNotification({
        title: 'Enregistrement réussi',
        // subTitle: "Vos informations ont été mises à jour",
        icon: {
          name: 'check-badge',
        },
      })   
    } catch (error) {
      newNotification({
        title: 'Enregistrement impossible',
        subTitle: "Veuillez contacter le support",
      })
    }
    setLoadingSave(false)
  }

  useEffect(() => {
    setEmail(user.identity.email)
    setFirstName(user.identity.first_name)
    setLastName(user.identity.last_name)
  },[user])

  return (
    <Container.View flexGrow={1}>
      <Container.ColumnCenter style={{height:'100%'}} gap={30}>
        <Text.SubTitle fontSize={24} lineHeight={24}>
          Modifier mes informations
        </Text.SubTitle>
        <Image
            source={require('@/assets/images/picture_user_default.png')}
            style={styles.imageUser}
            resizeMode='cover'
        />
        <Container.Column style={{width: '100%'}} gap={15}>

          <Container.ColumnCenterY gap={8}>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Nom</Text.Paragraphe>
            <Input.MainInput 
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder={'Entrez votre nom'} 
              placeholderTextColor={"#B8B8BC"} 
              autoCorrect={false}
              iconRight={<Icon.RR name={"user"} color={"#71717A"} size={18} lineHeight={18}/>}
              readOnly={loadingSave}
            />
          </Container.ColumnCenterY>

          <Container.ColumnCenterY gap={8}>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Prénom</Text.Paragraphe>
            <Input.MainInput 
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder={'Entrez votre nom'} 
              placeholderTextColor={"#B8B8BC"} 
              autoCorrect={false}
              iconRight={<Icon.RR name={"user"} color={"#71717A"} size={18} lineHeight={18}/>}
              readOnly={loadingSave}
            />
          </Container.ColumnCenterY>

          {/* <Container.ColumnCenterY gap={8}>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Your email</Text.Paragraphe>
            <Input.MainInput 
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={'Entrez votre email'} 
              placeholderTextColor={"#B8B8BC"} 
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              iconRight={<Icon.RR name={"envelope"} color={"#71717A"} size={14} lineHeight={16}/>}
              readOnly={loadingSave}
            />
          </Container.ColumnCenterY> */}

        

          {/* <Container.ColumnCenterY gap={8}>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Your phone number</Text.Paragraphe>
            <Input.MainInput style={styles.input}/>
          </Container.ColumnCenterY> */}

        </Container.Column>
        <TouchableOpacity onPress={handlerSave} activeOpacity={0.6} style={{width: '100%'}}>
          <Button.ButtonLandingPage loading={loadingSave}>Souvegarder</Button.ButtonLandingPage>
        </TouchableOpacity>
      </Container.ColumnCenter>
    </Container.View>
  )
}

export default Profil

const styles = StyleSheet.create({
  imageUser: {
    height: 120,
    width: 120,
    borderRadius: 120/2,
  },
  input: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 10,
  }
})