import { StyleSheet, ImageBackground } from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Icon , Text} from '@/components/atoms';
import { BlurView } from 'expo-blur';
interface ButtonArticleProps {
  children: ReactNode
  iconLeft?: ReactNode | boolean
  iconRight?: ReactNode | boolean
  backgroundColor?: string
  size?: number
}

const styleSize = [
  {
    height : 34,
    sizeIcon : 15,
    sizeText : 14,
    paddingHorizontal : 10,
    gap : 6
  },
  {
    height : 24,
    sizeIcon : 12,
    sizeText : 11,
    paddingHorizontal : 7,
    gap : 5
  },
  {
    height : 34,
    sizeIcon : 15,
    sizeText : 14,
    paddingHorizontal : 10,
    gap : 6
  }
]


const ButtonArticle: React.FC<ButtonArticleProps> = ({children, iconLeft, iconRight, size = 3,  backgroundColor = 'rgba(145,136,141,0.49)'}) => {
  return (
    <BlurView style={[styles.containerButton, {backgroundColor, paddingHorizontal : styleSize[size-1].paddingHorizontal}]} intensity={28}>
        <Container.RowCenterY gap={styleSize[size-1].gap}>
        
            {iconLeft && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                
                    iconLeft === true
                        ? (<Icon.Minted name={"tag"} color={"#fff"} size={13}/>)
                        : (iconLeft)
                    
                }</Container.RowCenter>)
            }
            
            
            <Text.SubTitle color='#FFF' fontSize={styleSize[size-1].sizeText} lineHeight={styleSize[size-1].height}>{children}</Text.SubTitle>

            {iconRight && (<Container.RowCenter style={[styles.containerIcon, {height: styleSize[size-1].height}]}>
                {
                    
                    iconRight === true
                        ? (<Icon.Minted name={"tag"} color={"#fff"} size={13}/>)
                        : (iconRight)
                
                }</Container.RowCenter>)
            }
        </Container.RowCenterY>
    </BlurView>
  )
}

export default ButtonArticle

const styles = StyleSheet.create({
  containerButton: {
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,

  },
  containerIcon : {
    height: 34,
    lineHeight: 34,
    textAlign: 'center'
  },


})