
import { StyleSheet, Image, TextStyle, TouchableOpacity, GestureResponderEvent} from 'react-native'
import React, { ReactNode }  from 'react'
import { Container, Text, Icon } from '@/components/atoms'
import { BlurView } from 'expo-blur'
import { Float } from 'react-native/Libraries/Types/CodegenTypes'
interface ToastProps {
    style?: TextStyle 
    title?: string|number
    subTitle?: string|number
    urlImage?: string
    icon?: {
        name?:string,
        color?:string,
        size?:number|Float
        lineHeight?:number|Float
        style?: TextStyle,
    }
    remove: (event: GestureResponderEvent) => void
}

const Toast: React.FC<ToastProps> = ({style= {}, title, subTitle, urlImage, icon, remove = ()=>{}}) => {
  return (

    <BlurView style={[styles.blurView,style]} intensity={68}>
        <Container.RowCenterY style={styles.toast} gap={14}>
            {urlImage ? 
                <Image style={styles.image} src={urlImage}/>
                :
                <Container.ColumnCenter style={styles.icon}>
                    <Icon.RR 
                        name={icon?.name ?? 'bell'} 
                        color='#ffffffaa' 
                        size={icon?.size ?? 20} 
                        lineHeight={icon?.lineHeight ?? 20}
                        style={icon?.style ?? {}}
                    />
                </Container.ColumnCenter>
            }
            <Container.Column flexGrow={1} gap={5}>
                {title && <Text.SubTitle color='#fff'>{title}</Text.SubTitle>}
                {subTitle && <Text.Paragraphe color='#ffffff85'>{subTitle}</Text.Paragraphe>}
            </Container.Column>
            <TouchableOpacity onPress={remove} activeOpacity={0.1} style={styles.closeTouchable}>
                <Container.ColumnCenter style={styles.containerClose}>
                    <Container.ColumnCenter style={styles.close}>
                        <Icon.RR name='plus' color='#ffffff7f'/>
                    </Container.ColumnCenter>
                </Container.ColumnCenter>
            </TouchableOpacity>
        </Container.RowCenterY> 
    </BlurView>
      
  )
}

export default Toast

const styles = StyleSheet.create({

    blurView: {
        width: '100%',
        borderRadius: 20,
        height: 70,
        overflow: 'hidden',
    },

    toast: {
        padding:8,
        backgroundColor: 'rgba(17, 23, 41, 0.6)',
    },

    image: {
        height: '100%',
        aspectRatio: '1/1',
        borderRadius: 16,
    },

    icon: {
        height: '100%',
        aspectRatio: '1/1',
        borderRadius: 16,
        backgroundColor: "#FFFFFF3F"
    },
    
    closeTouchable: {
        height: '100%',
       
    },
    containerClose: {
        height: '100%',
        aspectRatio: '1/1',
    },

    close: {
        backgroundColor: '#ffffff09',
        height: 30,
        width: 30,
        borderRadius: 15,
        transform: [{rotate:'45deg'}],
      
    }
})



