import { StyleSheet, TextStyle } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import Colors from '@/constants/Colors';

interface ButtonRadiusProps {
  children : ReactNode;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
  backgroundColor?: string;
  size?: number;
  styleContainer?: TextStyle
  styleSizeCustom ?: TextStyle
}

const styleSize = [
  {
    height : 46,
    sizeIcon : 15,
    sizeText : 16,
    paddingHorizontal : 16,
    lineHeight : 18,
    gap : 8
  },
  {
    height : 34,
    sizeIcon : 12,
    sizeText : 12,
    paddingHorizontal : 14,
    lineHeight : 18,
    gap : 8
  },
]


const ButtonRadius: React.FC<ButtonRadiusProps> = ({
  children, 
  iconLeft, 
  iconRight, 
  size = 1,  
  backgroundColor = Colors.primary, 
  styleContainer={},
  styleSizeCustom={}
}) => {

  const style = {...styleSize[size-1], ...styleSizeCustom}

  return (
      <Container.RowCenter gap={style.gap} style={[styles.containerButton, {backgroundColor, paddingHorizontal : style.paddingHorizontal}, {height: style.height}, styleContainer]} >
      
          {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: style.height}]}>
              {
              
                  iconLeft === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={style.sizeIcon}/>)
                      : (iconLeft)
                  
              }</Container.RowCenter>)
          }
          
          
          <Text.Paragraphe color='#FFF' fontFamily='Urbanist-Medium' fontSize={style.sizeText} lineHeight={style.lineHeight} textAlign='center'>{children}</Text.Paragraphe>

          {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: style.height}]}>
              {
                  
                  iconRight === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={style.sizeIcon}/>)
                      : (iconRight)
              
              }</Container.RowCenter>)
          }
      </Container.RowCenter>

  )
}

export default ButtonRadius

const styles = StyleSheet.create({
  containerButton: {
    overflow: 'hidden',
    borderColor: '#160837',
    paddingHorizontal: 10,
    borderRadius: 999999,
  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center'
  },

})