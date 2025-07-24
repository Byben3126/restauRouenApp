import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { Children, ReactNode }  from 'react'
import { Container, Text, Icon } from '@/components/atoms';


interface MyAccountMenuProps {
    children : ReactNode
}

interface MyAccountItemMenuProps {
    children : ReactNode
    icon ?: ReactNode
    iconRight?: ReactNode|Boolean
    color : string,
    subTitle?: string,
    press?: Function
    id?: String|Number
   
}

const Menu: React.FC<MyAccountMenuProps> = ({children}) => {
  return (
    <Container.Column style={styles.menu} gap={1}>
        {children}
    </Container.Column>
  )
}

const Item: React.FC<MyAccountItemMenuProps> = ({children, icon, color, subTitle = "", iconRight, press = undefined, id = undefined}) => {
    return (

        <TouchableOpacity activeOpacity={press ? 0.6 : 1.0} onPress={()=>{press ? press(id): null}}>
            <Container.RowCenterY style={[styles.item, {height : subTitle ? 55 : styles.item.height}]}>
                {icon && 
                    <Container.RowCenter style={styles.containerIcon}>
                        {icon}
                    </Container.RowCenter>
                }
                <Container.ColumnCenterY flexGrow={1} style={{height: '100%', paddingLeft: icon ? 0 : 17}} gap={4}>
                    <Text.Paragraphe color={color}>{children}</Text.Paragraphe>
                    {subTitle && <Text.Paragraphe color={'#766B93'}>{subTitle}</Text.Paragraphe>}
                </Container.ColumnCenterY>
                <Container.RowCenter style={styles.containerIcon}>

                    {iconRight !== false && !iconRight && <Icon.Ionicons name={"chevron-forward"} color={"#756B93"} size={17}/>}
                    {iconRight && <>{iconRight}</>}
                </Container.RowCenter>
            </Container.RowCenterY>
        </TouchableOpacity>
    )
  }


export default {Menu, Item}


const styles = StyleSheet.create({
    menu : {
        backgroundColor : '#F6ECFF',
        borderColor: '#F6ECFF',
        borderWidth : 1,
        borderRadius : 10,
        overflow: 'hidden'
    },

    item : {
        backgroundColor : '#fff',
        height : 45,
    },

    text : {
    },

    containerIcon : {
        height : 45,
        width : 45,
    }
})