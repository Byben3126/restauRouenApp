import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container } from '@/components/atoms'

const IconLocation = () => {
  return (
    <Container.ColumnCenter style={styles.iconLocation}>
        <Container.ColumnCenter style={styles.circle}>
            <View style={styles.contentCircle}/>
        </Container.ColumnCenter>
        <View style={styles.bar}/>
        <View style={styles.shadow}/>
    </Container.ColumnCenter>
  )
}

export default IconLocation

const styles = StyleSheet.create({
    iconLocation: {
       
    },
    circle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        backgroundColor: '#000'
    },

    contentCircle: {
        height: 8,
        width: 8,
        borderRadius: 2,
        backgroundColor: '#FFF'
    },

    bar: {
        height: 12,
        width: 2,
        backgroundColor: '#000'
    },

    shadow: {
        marginTop: 3,
        width: 8,
        height: 8,
        transform: [{ scaleY: 0.5 }] ,
        borderRadius: 6,
        backgroundColor: '#000'
    }
})