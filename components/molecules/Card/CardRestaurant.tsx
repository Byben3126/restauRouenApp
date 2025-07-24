import { StyleSheet, Image, View, TouchableOpacity, GestureResponderEvent, Animated } from 'react-native'
import React, {useMemo, useEffect, useRef} from 'react'
import { Container, Text, Icon, Button } from '@/components/atoms'
import Colors from '@/constants/Colors'
import { RestaurantData } from '@/types'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import { getCustomerProgress } from '@/api/minted/customer'
import * as Types from '@/types'

type CardRestaurantProps = {
    restaurantData: RestaurantData
    customerProgress?: Types.CustomerProgress
    cbViewMore?: (restaurantData: RestaurantData, progressBarInfo?:Types.CustomerProgress|null) => void
}

const CardRestaurant = ({restaurantData, customerProgress, cbViewMore}:CardRestaurantProps) => {

    const [widthContentCard, setWidthContentCard] = React.useState<number>(0)
    const [progressBarInfo, setProgressBarInfo] = React.useState<Types.CustomerProgress|null>(null)
    
    const images = useMemo(()=> {
        if (restaurantData?.images) {
            return JSON.parse(restaurantData.images)
        }
        return []
    },[restaurantData])

    const handlerViewMore = (event: GestureResponderEvent) => {
        if (cbViewMore) cbViewMore(restaurantData, progressBarInfo)
    }

    const fetchRestaurantDetails = async () => {
       console.log('fetchRestaurantDetails')
       const {data} = await getCustomerProgress(restaurantData.id)
       setProgressBarInfo(data)
    }
    useEffect(() => {
        if (customerProgress) {
            console.log('customerProgress', customerProgress)
            setProgressBarInfo(customerProgress)
        }else if (restaurantData?.id) {
            fetchRestaurantDetails()
        }
    }, [restaurantData?.id, customerProgress])

    return (
        <Container.Column style={styles.cardRestaurant} gap={10}>
            {images.length && <Image
                source={{ uri: process.env.EXPO_PUBLIC_API_URL + images[0]}}
                style={styles.image}
                resizeMode='cover'
            />}
            <Text.Title fontSize={16}>{restaurantData?.name}</Text.Title>
            <Container.RowCenterY gap={5}>
                {Array.from({ length: 5 }, (_, i) => (
                    <Icon.RR key={i} name={"star"} size={14} color={Colors.secondary}/>
                ))}
            </Container.RowCenterY>
            <Container.Column gap={2}>
                <Container.RowCenterY gap={8}>
                    <Icon.RR name={"ping"} size={14}/>
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>
                        {restaurantData?.city}
                        {', '}
                        {restaurantData?.country}
                    </Text.Paragraphe>
                </Container.RowCenterY>
                <Container.RowCenterY gap={8}>
                    <Icon.RR name={"gift2"} size={13}/>
                    <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Récompenses disponibles : {progressBarInfo?.reward_available_count}</Text.Paragraphe>
                </Container.RowCenterY>
            </Container.Column>
            <Container.Column gap={8} onLayout={(event) => setWidthContentCard(event.nativeEvent.layout.width)}>
                <Text.Title fontSize={16}>Ma progression</Text.Title>
                { progressBarInfo ? 
                    <ProgressBar
                        progress={progressBarInfo.points}
                        totalPoints={progressBarInfo.closest_reward?.point_required}
                    />
                :
                    <ContentLoader 
                        speed={2}
                        width={widthContentCard}
                        height={21}
                        viewBox={`0 0 ${widthContentCard} ${21}`}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >   
                        <Rect x="0" y="0" rx="4.5" ry="4.5" width={widthContentCard} height="9"/> 
                        <Rect height="7" width="50" y="12" x="0"  rx="3" ry="3"  /> 
                        <Rect height="7" width="50" y="12" x={widthContentCard - 50} rx="3" ry="3"/> 
                    </ContentLoader>
                }

            </Container.Column>
            {cbViewMore && <TouchableOpacity onPress={handlerViewMore}>
                <Button.ButtonLandingPage>Voir en plus</Button.ButtonLandingPage>
            </TouchableOpacity>}
        </Container.Column>
    )
}

export default CardRestaurant

type ProgressBarProps = {
    progress?: number
    totalPoints?: number
}

export const ProgressBar = ({ progress = 0, totalPoints }: ProgressBarProps) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetWidth = (progress / (totalPoints||progress)) * 100;

    Animated.timing(animatedWidth, {
      toValue: targetWidth,
      duration: 500, // Durée de l'animation en millisecondes
      useNativeDriver: false, // `width` ne peut pas utiliser `useNativeDriver`
    }).start();
  }, [progress, totalPoints]);

  return (
    <Container.Column gap={4}>
      <View style={styles.containerProgress}>
        <Animated.View
          style={[styles.progress, { width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          }) }]}
        />
      </View>
      <Container.RowCenterY gap={4} style={{ justifyContent: 'space-between' }}>
        <Text.Paragraphe fontFamily="Urbanist-Medium" fontSize={8} lineHeight={8}>
          {progress} point{progress > 1 ? 's' : ''}
        </Text.Paragraphe>
        <Text.Paragraphe fontFamily="Urbanist-Medium" fontSize={8} lineHeight={8}>
          {totalPoints || progress} point{(totalPoints || progress) > 1 ? 's' : ''}
        </Text.Paragraphe>
      </Container.RowCenterY>
    </Container.Column>
  );
};


const styles = StyleSheet.create({
    cardRestaurant: {
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
    },
    image: {
        width: '100%',
        height: 'auto',
        aspectRatio: 279/122,
        borderRadius: 10
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
})