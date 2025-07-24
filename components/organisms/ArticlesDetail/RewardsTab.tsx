import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import React, { useCallback, memo } from 'react'
import { Container, Text } from '@/components/atoms'
import { Card } from '@/components/molecules'
import * as Types from '@/types'
import { useLoader } from '@/context/Loader'
import { getTokenReward } from '@/api/minted/reward'
import { AxiosError } from 'axios'

type RewardsTabProps = {
  rewards: Types.RewardRead[] | null
  showQrCode: (title:string, qrCodeValue:string) => void
}


const RewardsTab = ({rewards, showQrCode}:RewardsTabProps) => {

  //context
  const { setLoader } = useLoader()

  const pressRewardHandler = useCallback(async (reward:Types.RewardRead)=>{
    setLoader(true);
    try {
      const {data} = await getTokenReward(reward.id)
      showQrCode(reward.name ,data)
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response, error.response?.status)
      }
    }
    
    setLoader(false);
  },[setLoader,showQrCode])
  
  const renderItem = useCallback(({item:reward}:{item:Types.RewardRead})=>(
    <Card.CardReward reward={reward} cbButton={pressRewardHandler}/>
  ),[])
  
  if (!rewards) {
    return <ActivityIndicator size={'small'}/>
  }
  if (!rewards.length) {
    return (
      <Container.ColumnCenter style={{paddingVertical:30}}>
        <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>Aucune récompense disponible</Text.Paragraphe>
      </Container.ColumnCenter>
    )
   
  }
  return (
    <FlatList
      data={rewards}
      renderItem={renderItem}
      keyExtractor={(reward) => String(reward.id)}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapperStyle}
      style={styles.flatList}
      ListFooterComponent={<View style={{ paddingBottom: 5 }}/>} 
      scrollEnabled={false}
    />  
  )
}

export default memo(RewardsTab)

const styles = StyleSheet.create({
  flatList: {
    flexGrow: 0,
    paddingTop: 4,
  },
  listContainer: {
    gap: 20,
    paddingHorizontal: 20
  },
  columnWrapperStyle: {
    gap: 20
  }
})


