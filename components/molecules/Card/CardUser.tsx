import { StyleSheet, Image, View, TouchableOpacity, GestureResponderEvent } from 'react-native'
import React, {memo} from 'react'
import { Container, Text, Icon, Button, Badge } from '@/components/atoms'
import Colors from '@/constants/Colors'
import { ProgressBar } from './CardRestaurant'
import * as Types from '@/types'

interface CardUserProps {
    customer: Types.CustomerCardAdmin 
    newOfferCb?: (event: GestureResponderEvent) => void
    givePointCb?: (event: GestureResponderEvent) => void
}

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Aucune'; // Si la date est invalide ou absente

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' - ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Invalid date:', dateString);
    return 'Aucune';
  }
};

const CardUser = ({newOfferCb, givePointCb, customer}: CardUserProps) => {
  return (
    <Container.Column style={styles.card} gap={10}>
        <Text.Title fontSize={16}>{customer?.user?.identity?.first_name}</Text.Title>
        <Container.RowCenterY gap={5}>
            {/* <Badge.BadgeMain size={2} iconLeft={<Icon.RR name='gift'/>}>3 gifts</Badge.BadgeMain> */}
            {customer.isInactive && <Badge.BadgeMain size={2} backgroundColor={Colors.red} color='#FFF'>Innactive</Badge.BadgeMain>}
            {!customer.isInactive && <Badge.BadgeMain size={2} backgroundColor={Colors.green} color='#FFF'>Active</Badge.BadgeMain>}
        </Container.RowCenterY>
        <Container.Column gap={5}>
            <Container.RowCenterY gap={8}>
                <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Last Visite: {formatDate(customer.last_visit_date)}</Text.Paragraphe>
            </Container.RowCenterY>
            {customer.last_points_gained?.created_at && <Container.RowCenterY gap={8}>
                <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Last points awarded: {formatDate(customer.last_points_gained?.created_at)}</Text.Paragraphe>
            </Container.RowCenterY>}
        </Container.Column>
        <Container.Column gap={4}>
            <Text.Title fontSize={16} lineHeight={27}>Goal progress</Text.Title>
            <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>{customer?.user?.identity?.first_name} a reçu au total {customer.total_points_gained} point{customer.total_points_gained ? 's' : ''}</Text.Paragraphe>
            <ProgressBar
                progress={customer.points}
                totalPoints={customer?.progress?.closest_reward?.point_required}
            />
        </Container.Column>
        <Container.Row gap={10}>
            {newOfferCb && 
                <TouchableOpacity onPress={newOfferCb} style={styles.containerButton}>
                    <Button.ButtonRadiusOutline styleContainer={styles.button} styleSizeCustom={styles.styleSizeCustomButton}>Send Offer</Button.ButtonRadiusOutline>
                </TouchableOpacity>
            }

            {givePointCb && 
                <TouchableOpacity onPress={givePointCb} style={styles.containerButton}>
                    <Button.ButtonRadius styleContainer={styles.button} styleSizeCustom={styles.styleSizeCustomButton}>Give points</Button.ButtonRadius>
                </TouchableOpacity>
            }
        </Container.Row>
       
    </Container.Column>
  )
}

export default memo(CardUser)


const styles = StyleSheet.create({
    card: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Ombre pour Android
        elevation: 4,
    },
    containerProgress: {
        height: 9,
        backgroundColor: 'rgba(0, 181, 95, 0.4)',
        borderRadius: 9,
    },
    progress: {
        height: "100%",
        backgroundColor: Colors.green,
        borderRadius: 9,
    },
    containerButton: {
        flexGrow: 1, 
    },
    button : {
        
        justifyContent: 'center'
    },

    styleSizeCustomButton: {
        sizeText: 14
    }
})