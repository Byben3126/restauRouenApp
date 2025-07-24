import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import React, {useCallback} from 'react'
import { Container, Text } from '@/components/atoms'
import { Card } from '@/components/molecules'
import * as Types from '@/types'

type HistoryTabProps = {
  pointHistory: Types.PointHistoryRead[] | null
}


const HistoryTab = ({pointHistory}:HistoryTabProps) => {

  const renderItem = useCallback(({item:pointHistory}:{item:Types.PointHistoryRead})=>(
    <Card.CardActivity pointHistory={pointHistory}/>
  ),[])
  
  if (!pointHistory) {
    return <ActivityIndicator size={'small'}/>
  }
  if (!pointHistory.length) {
    return (
      <Container.ColumnCenter style={{paddingVertical:30}}>
        <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>
          Aucun historique disponible
          </Text.Paragraphe>
      </Container.ColumnCenter>
    )
    
  }
      
  return (
    <FlatList
      data={pointHistory}
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

export default HistoryTab

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