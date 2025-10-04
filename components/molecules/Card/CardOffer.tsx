import { StyleSheet, View, TouchableOpacity, ImageBackground, TextStyle } from 'react-native'
import React , {useMemo} from 'react'
import { Container, Text, Button, Icon } from '@/components/atoms'
import * as Types from '@/types'
import Svg, { Path, Circle, Rect } from 'react-native-svg'
import Colors from '@/constants/Colors'

type CardOfferProps = {
  promotion: Types.PromotionRead
  cbChoose?: (promotion:Types.PromotionRead) => void
}

const CardOffer = ({promotion, cbChoose}:CardOfferProps) => {
    const [imageError, setImageError] = React.useState<boolean>(false)

    const image = useMemo(()=>{
        let image = null
       
        if (promotion.restaurant?.images) {
            const images = JSON.parse(promotion.restaurant?.images)
            if (images && images.length) {
                image = process.env.EXPO_PUBLIC_API_URL + images[0]
            }
        } 

        return image
   
    },[promotion.restaurant])
    return (
        <TouchableOpacity onPress={() => cbChoose && cbChoose(promotion)}>
            <ImageBackground 
                style={styles.ticketBackground} 
                source={image && !imageError ? {uri: image} : require('@/assets/images/background_icon_app.png')} 
                resizeMode={image  && !imageError ? 'cover' : 'repeat'} 
                onError={() => setImageError(true)}
            >
                <Container.Column gap={70}>
                    <Text.SubTitle color='#fff' fontSize={18} lineHeight={30} style={styles.headerTitle}>
                        {promotion.restaurant?.name}
                    </Text.SubTitle>
                    <Ticket promotion={promotion}/>
                </Container.Column>
            </ImageBackground>
        </TouchableOpacity>
    )
}


export const Ticket = ({promotion,cbChoose}:CardOfferProps) => {

     const expire_format_date =  useMemo(() => {
        if (!promotion || !promotion.expires_at) {
            return "Aucune date d'expiration";
        }
        const now = new Date();
        const expiration = new Date(promotion.expires_at);
        const timeDiff = expiration.getTime() - now.getTime();

        if (timeDiff <= 0) {
            return "Expiré";
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)); // ✅ Calcul des minutes

        if (days > 3) {
            return `${days} jour${days > 1 ? "s" : ""}`;
        } else if (days > 0) {
            return `${days} jour${days > 1 ? "s" : ""}`;
        } else if (hours > 0) {
            return `${hours} heure${hours > 1 ? "s" : ""}`;
        } else {
            return `${minutes} minute${minutes > 1 ? "s" : ""}`; // ✅ Affichage des minutes
        }
    }, [promotion]);


    return (
        <TouchableOpacity onPress={() => cbChoose && cbChoose(promotion)} disabled={!cbChoose}>
            <Container.Column style={styles.ticket}>
                <Container.Column style={styles.ticketHeader}>
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={16} lineHeight={22}>
                    {promotion.name}
                    </Text.Paragraphe>
                </Container.Column>
                <View style={styles.containerLine}>
                    <View style={styles.line}/>
                    <SvgTicket/>
                </View> 
                <Container.RowCenterY style={styles.ticketFooter} gap={6}>
                    <Icon.RR color={Colors.primary} name='gift' size={13} />
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={11} lineHeight={16}>
                        Encore
                        <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={11} lineHeight={16} color={Colors.primary}>
                            {' '}
                            {expire_format_date}
                            {' '}
                        </Text.Paragraphe>
                        avant expiration
                    </Text.Paragraphe>
                </Container.RowCenterY>
            </Container.Column>
        </TouchableOpacity>
    )
}

const SvgTicket = () => (
    <View style={styles.svg}>
        <Svg width="100%" height="100%" viewBox="0 0 279 10" fill="none">
            <Path d="M279 0C276.239 2.41411e-07 274 2.23858 274 5C274 7.76142 276.239 10 279 10H0C2.76142 10 5 7.76142 5 5C5 2.23858 2.76142 0 0 0H279Z" fill="white"/>
        </Svg>
    </View>
)

export default CardOffer

const styles = StyleSheet.create({
    cardOffer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 24,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Ombre pour Android
        elevation: 4,
    },
    header: {
        width: '100%',
        backgroundColor: 'rgba(255, 110, 110, 0.2)',
        height: 37,
        borderRadius: 24,

    },
    headerTitle: {
        paddingHorizontal:3,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    ticketBackground:{
        borderRadius: 23,
        overflow: 'hidden',
        padding: 16,
    },
    ticket: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    ticketHeader:{
        backgroundColor: '#fff',
        paddingHorizontal: 18,
        paddingTop: 17,
        paddingBottom: 15,
        transform: [{ translateY: 0.2}],
    },
    ticketFooter:{
        backgroundColor: '#fff',
        paddingHorizontal: 18,
        paddingTop: 7,
        paddingBottom: 12,
        transform: [{ translateY: -0.2}],
    },
    containerLine: {
        position: 'relative'
    },
    line: {
        height: 0.5,
        width: '96%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateY: -0.25 }, {translateX: '-50%' }],
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1,
    },
    svg:{
        aspectRatio: 279 / 10,
        width: '100%',
        height: 'auto',
    }
})