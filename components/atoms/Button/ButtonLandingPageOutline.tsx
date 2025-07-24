import { StyleSheet, ImageBackground } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';
interface ButtonSimpleProps {
  children : ReactNode;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
  backgroundColor?: string;
  size?: number;
}

const styleSize = [
  {
    height : 56,
    sizeIcon : 15,
    sizeText : 16,
    paddingHorizontal : 14,
    gap : 4,
    borderRadius: 30,
    borderWidth: 1.5
  },
]


const ButtonSimple: React.FC<ButtonSimpleProps> = ({children, iconLeft, iconRight, size = 1,  backgroundColor = '#fff'}) => {
  return (
      <Container.RowCenterY gap={styleSize[size-1].gap} style={[styles.containerButton, {backgroundColor, paddingHorizontal : styleSize[size-1].paddingHorizontal, borderRadius : styleSize[size-1].borderRadius, borderWidth : styleSize[size-1].borderWidth}]} >
      
          {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
              {
              
                  iconLeft === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                      : (iconLeft)
                  
              }</Container.RowCenter>)
          }
          
          
          <Text.Paragraphe color={Colors.primary} fontFamily='Urbanist-Medium' fontSize={styleSize[size-1].sizeText} lineHeight={styleSize[size-1].height}>{children}</Text.Paragraphe>

          {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
              {
                  
                  iconRight === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                      : (iconRight)
              
              }</Container.RowCenter>)
          }
      </Container.RowCenterY>

  )
}

export default ButtonSimple

const styles = StyleSheet.create({
  containerButton: {
    overflow: 'hidden',
    borderColor:  Colors.primary, //'#EAEAEAD0',//#160837',
    paddingHorizontal: 10,
    borderRadius: 999999,
    justifyContent: 'center',
    width: '100%'
  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center'
  },

})