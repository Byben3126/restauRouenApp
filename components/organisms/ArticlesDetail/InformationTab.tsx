import { StyleSheet, FlatList, View } from 'react-native'
import React from 'react'
import { Container, Text } from '@/components/atoms'
import { Card } from '@/components/molecules'


const data = new Array(10).fill(null).map((_, index) => ({
  id: index.toString(),
  title: `Item ${index + 1}`,
}))

const InformationTab = () => {

  return (
    <Container.View>
     <Container.Column style={styles.card} gap={8}>
        <Text.Title fontSize={16} lineHeight={20}>Restaurant informations</Text.Title>
        <Container.Column gap={5}>
          <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Phone number : 0783823958</Text.Paragraphe>
          <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Email : thegreenpisto@gmail.com</Text.Paragraphe>
          <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={17}>Website link : www.thegreenpisto.com</Text.Paragraphe>
        </Container.Column>
      </Container.Column>
    </Container.View>
  )
}

export default InformationTab

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4F4F5',
    borderRadius: 16,
    padding: 16
  },
})