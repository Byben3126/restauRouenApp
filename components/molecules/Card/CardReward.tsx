import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Button, Container, Text, Icon } from '@/components/atoms'
import Colors from '@/constants/Colors'
import * as Types from "@/types"

type CardRewardProps = {
  cbButton?: (reward:Types.RewardRead) => void
  textButton?: string
  reward: Types.RewardRead
}
const CardReward = ({reward, cbButton, textButton='Obtenir'}:CardRewardProps) => {
  return (
    <Container.ColumnCenterX style={styles.card} gap={15}>
        <Container.ColumnCenterX style={styles.iconContainer}>
          <Icon.RR name='gift' size={20} lineHeight={20} color={Colors.primary} />
        </Container.ColumnCenterX>
        <Container.ColumnCenterX gap={2}>
          <Text.SubTitle fontSize={16} lineHeight={16}>{reward.name}</Text.SubTitle>
          <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={12} lineHeight={12} color='#000000'>{reward.point_required} points</Text.Paragraphe>
        </Container.ColumnCenterX>
        
        <TouchableOpacity onPress={()=>cbButton && cbButton(reward)} style={{width: '100%'}}>
          <Button.ButtonRadius>{textButton}</Button.ButtonRadius>
        </TouchableOpacity>
        
    </Container.ColumnCenterX>
  )
}

export default CardReward

const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 24,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Ombre pour Android
        elevation: 4,
        flexGrow: 1,
        width: 0
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
})