import { StyleSheet, ImageBackground, ActivityIndicator, TextStyle} from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import Colors from '@/constants/Colors';

interface ButtonSimpleProps {
  children : ReactNode;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
  backgroundColor?: string;
  size?: number;
  loading?: boolean;
  style?: TextStyle
  disabled?: boolean;
}

const styleSize = [
  {
    height : 56,
    sizeIcon : 15,
    sizeText : 16, 
    paddingHorizontal : 14,
    gap : 4,
    borderRadius: 30
  },
]


const ButtonSimple = ({loading = false, disabled = false, children, iconLeft, iconRight, size = 1,  backgroundColor = Colors.primary, style = {}} : ButtonSimpleProps) => {
  return (
      <Container.RowCenter
        gap={styleSize[size-1].gap} 
        style={[
          styles.containerButton, 
          { 
            backgroundColor, 
            paddingHorizontal : styleSize[size-1].paddingHorizontal, 
            borderRadius : styleSize[size-1].borderRadius, 
            height: styleSize[size-1].height,
            opacity: disabled ? 0.5 : 1
          },
          style,
        ]} 
        >

          {loading ? (
            <ActivityIndicator size={'small'}/>
          ):(
          <>
            {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height, left: 0}]}>
                {
                
                    iconLeft === true
                        ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                        : (iconLeft)
                    
                }</Container.RowCenter>)
            }
            
            
            <Text.Paragraphe color='#FFF' fontSize={styleSize[size-1].sizeText} lineHeight={styleSize[size-1].height}>{children}</Text.Paragraphe>

            {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height, right:0}]}>
                {
                    
                    iconRight === true
                        ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                        : (iconRight)
                
                }</Container.RowCenter>)
            }
          </>)}
      </Container.RowCenter>

  )
}

export default ButtonSimple

const styles = StyleSheet.create({
  containerButton: {
    overflow: 'hidden',
    borderColor: '#160837',
    paddingHorizontal: 10,
    borderRadius: 999999,
    justifyContent: 'center',
    width: '100%'
  },
  containerIcon : {
    height: 56,
    width: 56,
    lineHeight: 56,
    textAlign: 'center',
    position: 'absolute',
  },

})