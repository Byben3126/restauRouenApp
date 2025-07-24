import { StyleSheet, ActivityIndicator, TextStyle } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import { BlurView } from 'expo-blur';

interface ButtonSimpleProps {
  children : ReactNode;
  iconLeft?: boolean | ReactNode;
  iconRight?: boolean | ReactNode;
  backgroundColor?: string;
  size?: number;
  loading?: boolean;
  style?: TextStyle
}

const styleSize = [
  {
    height : 34,
    sizeIcon : 15,
    sizeText : 12,
    paddingHorizontal : 14,
    gap : 4,
    borderRadius: 5
  },
  {
    height : 51,
    sizeIcon : 13,
    sizeText : 14,
    paddingHorizontal : 7,
    gap : 8,
    borderRadius: 10,


  },
  {
    height : 55,
    sizeIcon : 15,
    sizeText : 15,
    paddingHorizontal : 75,
    gap : 6,
    borderRadius: 40,
  },
  {
    height : 70,
    sizeIcon : 15,
    sizeText : 16,
    paddingHorizontal : 100,
    gap : 6,
    borderRadius: 40,
  }
]


const ButtonSimple: React.FC<ButtonSimpleProps> = ({loading = false, children, iconLeft, iconRight, size = 1,  backgroundColor = '#160837', style={}}) => {
  return (
      <Container.RowCenterY gap={styleSize[size-1].gap} style={[styles.containerButton, {backgroundColor, paddingHorizontal : styleSize[size-1].paddingHorizontal, borderRadius : styleSize[size-1].borderRadius, height: styleSize[size-1].height}, style]} >


          {loading ? (
            <ActivityIndicator size={'small'}/>
          ):(<>
            {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                
                    iconLeft === true
                        ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                        : (iconLeft)
                    
                }</Container.RowCenter>)
            }
            
            
            <Text.Paragraphe color='#FFF' fontSize={styleSize[size-1].sizeText} lineHeight={styleSize[size-1].height}>{children}</Text.Paragraphe>

            {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                    
                    iconRight === true
                        ? (<Icon.MaterialCommunityIcons name={"tag-outline"} color={"#fff"} size={styleSize[size-1].sizeIcon}/>)
                        : (iconRight)
                
                }</Container.RowCenter>)
            }
          </>)}
      </Container.RowCenterY>

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
  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center'
  },

})