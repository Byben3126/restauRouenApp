import { StyleSheet, ImageBackground, TextStyle } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import Colors from '@/constants/Colors';
import { isNumeric } from '@/utils/number';

interface ButtonRadiusOutlineProps {
  children : ReactNode;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
  backgroundColor?: string;
  size?: number;
  styleSizeCustom ?: TextStyle;
  styleContainer ?: TextStyle;
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


const ButtonRadiusOutline: React.FC<ButtonRadiusOutlineProps> = ({
  children, 
  iconLeft, 
  iconRight, 
  size = 1,  
  backgroundColor = 'transparent',
  styleSizeCustom = {},
  styleContainer = {}
}) => {
  
  const style = {
    ...styleSize[size-1], 
    ...styleSizeCustom
  }

  return (
      <Container.RowCenterY gap={style.gap} style={[styles.containerButton, {backgroundColor, paddingHorizontal : style.paddingHorizontal}, {height: style.height}, styleContainer]} >
      
          {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: style.height}]}>
              {
              
                  iconLeft === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#000"} size={style.sizeIcon}/>)
                      : (iconLeft)
                  
              }</Container.RowCenter>)
          }
          
          
          <Text.Paragraphe color={Colors.primary} fontFamily='Urbanist-Medium' fontSize={style.sizeText} lineHeight={style.lineHeight}  textAlign='center'>{children}</Text.Paragraphe>

          {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: style.height}]}>
              {
                  
                  iconRight === true
                      ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#000"} size={style.sizeIcon}/>)
                      : (iconRight)
              
              }</Container.RowCenter>)
          }
      </Container.RowCenterY>

  )
}

export default ButtonRadiusOutline

const styles = StyleSheet.create({
  containerButton: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    borderRadius: 999999,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center'
  },

})