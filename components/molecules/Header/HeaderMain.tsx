import { StyleSheet, View, Image, Text as TextRn, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import {Icon, Text, Container} from '@/components/atoms';
import { useSelector } from 'react-redux';
import * as Types from '@/types'
import { useRouter } from 'expo-router';
import { HomeScreenProps } from '@/app/dashboard/Home';

interface HeaderMainProps {
}

const HeaderMain = ({ navigation }: HomeScreenProps) => {

  const user = useSelector((state:Types.Store) => state.user.value);

  //context
  const router = useRouter();
  return (
    <SafeAreaView>
      <Container.View>
        <Container.RowCenterY style={styles.header}>
          <Container.RowCenterY gap={5}>
            <Text.SubTitle fontSize={24} lineHeight={24}>Hey {user?.identity?.first_name}</Text.SubTitle>
            <Image
              source={require('@/assets/images/emoji_hand.png')}
              style={styles.image}
            />
          </Container.RowCenterY>
          <TouchableOpacity onPress={() => router.navigate("/(tab)/dashboard_user/(tabs)/notifications")}>
            <Icon.Feather name={'bell'} size={23}/>
          </TouchableOpacity>
         
        </Container.RowCenterY>
      </Container.View>
    </SafeAreaView>
  )
}

export default HeaderMain

const styles = StyleSheet.create({
    header : {
        paddingVertical : 20,
        justifyContent: 'space-between'
    },

    iconCircle: {
      paddingHorizontal:5,
      lineHeight:16,
      height: '100%'
    },

    containerInput : {
      flexGrow:1,
    },

    image : {
      width: 25,
      height: 25,
      borderRadius: 99999
    }
})


