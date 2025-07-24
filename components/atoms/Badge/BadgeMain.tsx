import { StyleSheet, TextStyle } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '../../atoms'
import { BlurView } from 'expo-blur';
interface BadgeMainProps {
  children: ReactNode
  iconLeft?: ReactNode | boolean
  iconRight?: ReactNode | boolean
  backgroundColor?: string
  color?: string
  size?: number
  style?: TextStyle | TextStyle[];
}

const styleSize = [
  {
    height : 20,
    sizeIcon : 15,
    sizeText : 10,
    paddingHorizontal : 8,
    gap : 6
  },
  {
    height : 24,
    sizeIcon : 15,
    sizeText : 10.5,
    paddingHorizontal : 10,
    gap : 8
  }
]


const BadgeMain: React.FC<BadgeMainProps> = ({children, iconLeft, iconRight, size = 1,  backgroundColor = '#F9CF65', color= "#000", style={}}) => {
  return (
    <Container.Row style={[styles.containerButton, {backgroundColor, paddingHorizontal : styleSize[size-1].paddingHorizontal}, style]}>
        <Container.RowCenterY gap={styleSize[size-1].gap}>
        
            {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                
                    iconLeft === true
                        ? (<Icon.Minted name={"tag"} color={"#fff"} size={13}/>)
                        : (iconLeft)
                    
                }</Container.RowCenter>)
            }
            
            <Text.Paragraphe color={color} fontFamily='Urbanist-Medium' fontSize={styleSize[size-1].sizeText} lineHeight={styleSize[size-1].height}>{children}</Text.Paragraphe>

            {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                    
                    iconRight === true
                        ? (<Icon.Minted name={"tag"} color={"#fff"} size={13}/>)
                        : (iconRight)
                
                }</Container.RowCenter>)
            }
        </Container.RowCenterY>
    </Container.Row>
  )
}

export default BadgeMain

const styles = StyleSheet.create({
  containerButton: {
    borderRadius: 20,
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center',
  },


})