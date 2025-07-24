import { StyleSheet, View, SafeAreaView, TouchableOpacity, Animated} from 'react-native'
import React, {useRef, useState,useMemo, useEffect, useCallback} from 'react'
import { Container, Text, Icon, Button} from '@/components/atoms'
import Colors from '@/constants/Colors'
import ImageCarousel from '../ArticlesDetail/ImageCarousel'
import { ProgressBar } from '@/components/molecules/Card/CardRestaurant'
import {  Header} from '@/components/molecules'
import HistoryTab from '../ArticlesDetail/HistoryTab'
import InformationTab from '../ArticlesDetail/InformationTab'
import PromotionTab from '../ArticlesDetail/PromotionsTab'
import RewardsTab from '../ArticlesDetail/RewardsTab'
import { ScrollView } from 'react-native-gesture-handler'
import PagerView from 'react-native-pager-view'
import { getRewards } from '@/api/minted/reward'
import { get_restaurant_promotions } from '@/api/minted/promotion'
import { getCustomerProgress } from '@/api/minted/customer'
import { get_point_history } from '@/api/minted/pointHistory'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Types from '@/types'
import QRCode from 'react-native-qrcode-svg';
import QrCodeView from '@/components/organisms/Pages/QrCodeView'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

export type StackParamList = {
  Restaurant: {
    restaurantData: Types.RestaurantData;
    progressBarInfo?: Types.CustomerProgress;
  };
  QrCode: {
    restaurantData: Types.RestaurantData;
    progressBarInfo?: Types.CustomerProgress;
    title:string;
    qrCodeValue: string;
  };
};

type propsRestaurantStack = {
    restaurantData: Types.RestaurantData
    progressBarInfo?: Types.CustomerProgress
}


export type propsRestaurantScreen = NativeStackScreenProps<StackParamList, 'Restaurant'>;

type propsQrCodeScreen = NativeStackScreenProps<StackParamList, 'QrCode'>;

const Stack = createNativeStackNavigator<StackParamList>();


const RestaurantScreen = ({ navigation, route }:propsRestaurantScreen) => {

    const [activeIndex, setActiveIndex] = useState(0)
    const [height, setHeight] = useState<number>(0);
    const [maxHeight, setMaxHeight] = useState<number>(0);
    const [heights, setHeights] = useState<number[]>([]);
    const [rewards, setRewards] = useState<Types.RewardRead[] | null>(null);
    const [promotions, setPromotions] = useState<Types.PromotionRead[] | null>(null);
    const [pointHistory, setPointHistory] = useState<Types.PointHistoryRead[] | null>(null);
    const [progressBarInfo, setProgressBarInfo] = React.useState<Types.CustomerProgress|null>(null)




    //memo
    const imagesUri = useMemo(()=>{
        const imagesPath:string[] = JSON.parse(route.params.restaurantData.images)
        return imagesPath.map(path => ({
            uri: process.env.EXPO_PUBLIC_API_URL + path
        }))
    },[route.params.restaurantData.images])

    //ref
    const pagerRef = useRef<PagerView>(null);



    const handleTabPress = (index: number) => {
      pagerRef.current?.setPage(index)
      setActiveIndex(index)
    }

    const fetchRewards = async () => {
        const {data} = await getRewards(route.params.restaurantData.id)
        setRewards(data)
    }

    const fetchPromotions = async () => {
        const {data} = await get_restaurant_promotions(route.params.restaurantData.id)
        setPromotions(data)
    }

    const fetchPointHistory = async () => {
        const {data} = await get_point_history(route.params.restaurantData.id)
        setPointHistory(data)
    }

    const fetchProgressBarInfo= async () => {
        const {data} = await getCustomerProgress(route.params.restaurantData.id)
        setProgressBarInfo(data)
    }

    const showQrCode = useCallback((title:string, qrCodeValue:string) => {
        navigation.navigate('QrCode', {
            ...route.params,
            title,
            qrCodeValue: qrCodeValue,
        })
    },[])

    const screens = [
        { name: 'Récompenses', component: <RewardsTab rewards={rewards} showQrCode={showQrCode}/>},
        { name: 'Offres', component: <PromotionTab promotions={promotions} showQrCode={showQrCode}/>},
        { name: 'Historique', component: <HistoryTab pointHistory={pointHistory}/>},
        // { name: 'Information', component: <InformationTab/>},
    ]

    useEffect(()=>{
        fetchRewards()
        fetchPromotions()
        fetchPointHistory()

        if (route.params.progressBarInfo) {
            setProgressBarInfo(route.params.progressBarInfo)
        }else{
            fetchProgressBarInfo()
        }
    },[])
    
    return (
          
        <ScrollView 
            style={styles.scrollView}
            stickyHeaderIndices={[3]} 
            onScrollBeginDrag={()=>{
                console.log('onScrollBeginDrag')
                setHeight(heights[activeIndex]);
            }}
            onMomentumScrollEnd={()=>{
                console.log('onMomentumScrollEnd')
                setHeight(maxHeight);
            }}
        >
            <SafeAreaView/>
            <Container.Column gap={10}>
                <Container.View>
                    <Text.SubTitle style={styles.restaurantName} fontSize={20} lineHeight={20}>{route.params.restaurantData.name}</Text.SubTitle>
                    {/* <Container.RowCenterY gap={5}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Icon.RR key={i} name={"star"} size={14} color={Colors.secondary}/>
                        ))}
                    </Container.RowCenterY> */}
                </Container.View>
                <ImageCarousel
                    images={imagesUri}
                    paddingHorizontal={20}
                    borderRadius={20}
                    gap={10}
                    imageHeight={160}
                />
            </Container.Column>
        
            <Container.View style={{marginVertical:25}}>
                <Container.Column gap={10}>
                    <Text.SubTitle fontSize={20} lineHeight={20}>Tu as {progressBarInfo?.points} points</Text.SubTitle>
                    <ProgressBar
                        progress={progressBarInfo?.points}
                        totalPoints={progressBarInfo?.closest_reward?.point_required}
                    />
                </Container.Column>
            </Container.View>
        
                    
            <View>
                <Container.Row gap={7} style={styles.containerTab}>
                {screens.map((tab, index) => (
                    <TouchableOpacity key={tab.name} onPressOut={() => handleTabPress(index)}>

                        {activeIndex === index &&
                            <Button.ButtonRadius size={2} key={tab.name} styleSizeCustom={{paddingHorizontal: 10}}> {tab.name} </Button.ButtonRadius>
                        ||
                            <Button.ButtonRadiusOutline size={2} key={tab.name} styleSizeCustom={{paddingHorizontal: 10}}> {tab.name} </Button.ButtonRadiusOutline>
                        }
                    </TouchableOpacity>
                ))}
                </Container.Row>
        
            </View>

    
            <AnimatedPagerView
                style={{flex: 1, height: height + 50}}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={(e) => {
                    const position = e.nativeEvent.position;
                    setActiveIndex(position);
                }}
                orientation="horizontal"

            >
                {screens.map((screen, index) => (
                    <View style={{height:999999999}}>
                        <View 
                            key={index}
                            style={{flex: 0}}

                            onLayout={(e) => {
                                const layoutHeight = e.nativeEvent.layout.height;
                                console.log('onLayout',screen.name, layoutHeight)
                                setMaxHeight((value) => Math.max(layoutHeight, value))

                                setHeights((prev) => {
                                const updated = [...prev];
                                updated[index] = layoutHeight;
                                return updated;
                                });
                            
                                if (index === activeIndex) {
                                setHeight(layoutHeight);
                                }
                            }}
                        >
                            {screen.component}
                        </View>
                    </View>
                ))}
            </AnimatedPagerView>
    
        </ScrollView>

    )
}

const QrCodeScreen = ({ navigation, route }:propsQrCodeScreen) => {
    return (
        <QrCodeView
            title={route.params.title}
            qrCodeValue={route.params.qrCodeValue}
            cbButton={() => navigation.goBack()}
        />

    )
}

const RestaurantStack = ({ restaurantData, progressBarInfo }:propsRestaurantStack) => (

    <Stack.Navigator
        initialRouteName="Restaurant"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'white' },
        
        }}
        
    >
        <Stack.Screen name="Restaurant" 
            component={RestaurantScreen}
            initialParams={{ restaurantData, progressBarInfo }}
        />

        <Stack.Screen 
            name="QrCode" 
            component={QrCodeScreen} 
            options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: false,
            headerTitle: '',
            sheetAllowedDetents: [0.99],
            presentation: 'modal',
        
            headerLeft: () => (
                <Header.HeaderStack.Left navigation={navigation}/>
            ),
            })}
        />
        {/* <Stack.Screen name="QrCode" component={QrCodeScreen} /> */}
    </Stack.Navigator>
)

export default RestaurantStack

const styles = StyleSheet.create({

    restaurantName: {
        marginTop: 0,
        marginBottom: 7
    },

    scrollView: {
        flexGrow: 1,
        gap: 99,
        backgroundColor:'white', 
        height:900,
        display: 'flex',
        flexDirection: 'column'
    },

    containerTab: { 
        flexGrow:0,
        display:'flex',
        flexDirection: 'row',
        // justifyContent: 'space-around', 
        paddingHorizontal: 20, 
        marginBottom: 5,
        backgroundColor: "#fff",
        paddingVertical: 15,
        gap: 7,
   
    }
})





