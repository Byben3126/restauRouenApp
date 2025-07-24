import { StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { Container, Text, Badge } from '@/components/atoms'
import Colors from '@/constants/Colors';
import * as Types from '@/types'

type CardActivityProps = {
  pointHistory: Types.PointHistoryRead
}
const CardActivity = ({pointHistory}:CardActivityProps) => {

    const formattedDate = useMemo(() => {
        if (!pointHistory.created_at) return null;

        const date = new Date(pointHistory.created_at);
        return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        }) + ' - ' + date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        });
    }, [pointHistory.created_at]);

    return (
        
        <Container.Column style={styles.activity} gap={10}>
            <Text.Paragraphe style={styles.activity_title} fontFamily='Urbanist-Medium' fontSize={16} lineHeight={18}>{pointHistory?.restaurant?.name}</Text.Paragraphe>
            <Container.RowCenterY style={styles.activity_content}>
                <Badge.BadgeMain size={2} 
                    backgroundColor={pointHistory.action == 'gain' ? Colors.green : Colors.red}
                    color='#fff'
                >
                    { pointHistory.action == 'gain' ? '+' : '-'}
                    {pointHistory.points}
                    point{pointHistory.points > 1 ? 's' : ''}
                </Badge.BadgeMain>
                <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={12}>{formattedDate}</Text.Paragraphe>
            </Container.RowCenterY>
        </Container.Column>
    )
}

export default CardActivity

const styles = StyleSheet.create({
    activity: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,

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
    activity_title: {
        marginBottom: 8,
    },
    activity_content: {
        justifyContent: 'space-between',
    },
})