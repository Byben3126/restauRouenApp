import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Container, Icon, Text } from '@/components/atoms'

interface HeaderStackLeftProps {

}

const HeaderStackLeft = ({ navigation } : HeaderStackLeftProps) => {
  return (
    
    <Container.View>
        <TouchableOpacity activeOpacity={0.6} onPressOut={() => navigation.goBack()}>
            <Container.RowCenterY gap={6}>
                <Icon.RR name='arrow_left' style={styles.iconArrow}></Icon.RR>
                <Text.SubTitle fontSize={15} lineHeight={16} style={styles.textBack}>Retour</Text.SubTitle>
            </Container.RowCenterY>
        </TouchableOpacity>
    </Container.View>

  )
}


export default {
    Left: HeaderStackLeft
}

const styles = StyleSheet.create({
    iconArrow: {
       
    },
    textBack: {
        textDecorationLine: 'underline',
        transform: [{translateY:1}]
    }
})