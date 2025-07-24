import { StyleSheet, Image, TouchableOpacity} from 'react-native'
import React, { ReactNode }  from 'react'
import { Text, Container, Button, Icon } from '@/components/atoms'
import { GestureResponderEvent } from 'react-native'

interface NoPurchaseProps {
  title:string,
  subTitle:string,
  buttonTitle?:string,
  buttonIcon?: ReactNode,
  cbButton?: (event: GestureResponderEvent) => void
}

const NoPurchase: React.FC<NoPurchaseProps> = ({title, subTitle, buttonTitle, cbButton, buttonIcon = <Icon.Minted name="search-right" color='#fff'/> }) => {
 

  return (
    <Container.ColumnCenter gap={60} flexGrow={1}>
        <Image style={styles.image} source={require('@/assets/images/no_purchase.png')}/>
        <Container.ColumnCenterX gap={15}>
          <Text.SubTitle fontSize={19}>{title}</Text.SubTitle>
          <Text.Paragraphe textAlign='center' color='#160837' lineHeight={16}>{subTitle}</Text.Paragraphe>
        </Container.ColumnCenterX>
        {buttonTitle && <TouchableOpacity activeOpacity={0.6} onPress={cbButton}>
          <Button.ButtonSimple style={{paddingHorizontal: 45}}size={3} iconRight={buttonIcon}>{buttonTitle}</Button.ButtonSimple>
        </TouchableOpacity>}
    </Container.ColumnCenter>
  )
}

export default NoPurchase

const styles = StyleSheet.create({
  image: {
    width: '75%',
    height: 'auto',
    aspectRatio: 289/237
  }
})


