import { StyleSheet, Text, View } from 'react-native'
import {useEffect, useState} from 'react'
import { useLocalSearchParams } from 'expo-router';
import { Restaurant } from '@/components/organisms/Pages';
import { useLoader } from '@/context/Loader'
import * as Types from '@/types';
import { getRestaurant } from '@/api/minted/restaurant';

export default function RestaurantScreen() {

    const [restaurantData, setRestaurantData] = useState<Types.RestaurantData | null>(null);
    const [progressBarInfo, setProgressBarInfo] = useState<Types.CustomerProgress | undefined>(undefined);


    // Context
    const params = useLocalSearchParams<{
        id: string;
        restaurantData?: string;
        progressBarInfo?: string;
    }>();

    const { setLoader } = useLoader();
    
    const fetchRestaurant = async (id: string) => {
        setLoader(true);
        try {
            const {data} = await getRestaurant(id);
            setRestaurantData(data);
        } catch (error) {
            console.error("Error fetching restaurant data:", error);
        }
        setLoader(false);
    }
  
    useEffect(()=> {
        setRestaurantData(params.restaurantData ? JSON.parse(params.restaurantData) : null);
        setProgressBarInfo(params.progressBarInfo ? JSON.parse(params.progressBarInfo) : null);
        
        if (params.id && !params.restaurantData) fetchRestaurant(params.id);
    }, [params.restaurantData, params.progressBarInfo]);

    if (!restaurantData) return null
    return (
        <Restaurant restaurantData={restaurantData} progressBarInfo={progressBarInfo}/>
    );
}

const styles = StyleSheet.create({})