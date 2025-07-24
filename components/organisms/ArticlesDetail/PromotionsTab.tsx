import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import React, {useCallback} from 'react'
import { Container, Text } from '@/components/atoms'
import { Card } from '@/components/molecules';
import * as Types from '@/types'
import { useLoader } from '@/context/Loader'
import { getTokenPromotion } from '@/api/minted/promotion';
import { useNotification } from '@/context/Notification';
import { Ticket } from '@/components/molecules/Card/CardOffer';
type PromotionTabProps = {
  promotions: Types.PromotionRead[] | null
  showQrCode: (title:string, qrCodeValue:string) => void
}


const PromotionsTab = ({promotions, showQrCode}:PromotionTabProps) => {

    //context
    const { setLoader } = useLoader()
    const { newNotification } = useNotification()
    const pressPromotionHandler = useCallback(async (promotion:Types.PromotionRead)=>{
      setLoader(true);
      try {
        const {data} = await getTokenPromotion(promotion.id)
        showQrCode(promotion.name ,data)
      } catch (error) {
        newNotification({
          title: 'Promotion indisponible',
          subTitle: "",
        })   
      }
      
      setLoader(false);
    },[setLoader,showQrCode])

    const renderItem = useCallback(({item:promotion}:{item:Types.PromotionRead})=>(
      <View style={styles.ticket}>
        <Ticket promotion={promotion} cbChoose={pressPromotionHandler}/>
      </View>
    ),[])
    
    if (!promotions) {
      return <ActivityIndicator size={'small'}/>
    }

    if (!promotions.length) {
      return (
        <Container.ColumnCenter style={{paddingVertical:30}}>
          <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Aucune promotion disponible</Text.Paragraphe>
        </Container.ColumnCenter>
      )
    }

  return (
   
      <FlatList
        data={promotions}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        // columnWrapperStyle={styles.columnWrapperStyle}
        style={styles.flatList}
        ListFooterComponent={<View style={{ paddingBottom: 5 }}/>} 
        scrollEnabled={false}
      /> 

  )
}

export default PromotionsTab

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
    paddingTop: 4,
  },
  listContainer: {
    gap: 20,
    paddingHorizontal: 20,
    // backgroundColor:'red'
  },
  columnWrapperStyle: {
    gap: 20
  },
  ticket:{
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
})