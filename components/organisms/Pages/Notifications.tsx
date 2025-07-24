import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import {useState, useEffect} from 'react'
import { Container, Text, Button, Icon } from '@/components/atoms';
import { Input } from '@/components/molecules';
import Colors from '@/constants/Colors';
import { get_notifications} from '@/api/minted/notification';
import { useNotification } from '@/context/Notification';
import * as Types from '@/types';

const data = new Array(10).fill(null).map((_, index) => ({
  id: index.toString(),
  title: `Item ${index + 1}`,
}))

const Notifications = () => {
  const [notifications, setNotifications] = useState<Types.NotificationRead[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(0);
  
  //context
  const {clickNotification} = useNotification();

  const fetchNotifications = async () => {
    if (page == -1) return;
    setIsLoading(true)

    const {data} =  await get_notifications(page)
    console.log(data)
    setNotifications((lastValue)=> [...lastValue, ...data])
    setPage(data.length < 10 ? -1 : page + 1)
    setIsLoading(false)
  }
  const handlerClickNotification = (notification:Types.NotificationRead) => {
      clickNotification({
        id: notification.id,
        additionalData: JSON.parse(notification.data)
      });
  }


  const renderItem = ({item}: {item: Types.NotificationRead}) => (
    <TouchableOpacity onPress={() => handlerClickNotification(item)}>
      <Notification notification={item}/>
    </TouchableOpacity>
  )

  useEffect(() => {
      fetchNotifications();
  }, []);

  return (
    <Container.Column flexGrow={1}>
      <Container.View>
        <Text.SubTitle fontSize={24} lineHeight={24} marginBottom={15}>
            Notifications
          </Text.SubTitle>
      </Container.View>
      <Container.Column flexGrow={1}>

      {
        isLoading && !notifications.length ?
            <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>
        : !notifications.length ?
            <Container.ColumnCenter flexGrow={1}>
                <Container.View>
                    <Text.Paragraphe fontSize={16} lineHeight={20} textAlign='center'>Aucune notification pour le moment.</Text.Paragraphe>
                </Container.View>
            </Container.ColumnCenter>
          
          :  
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.id ? String(item.id) : `notification-${index}`}
              numColumns={1}
              contentContainerStyle={styles.listContainer}
              // columnWrapperStyle={styles.columnWrapperStyle}
              style={styles.flatList}
              scrollEnabled={true}
              onEndReached={fetchNotifications}
              ListFooterComponent={() => (
                  <Container.ColumnCenter style={{height: page >= 0 ? 80 : 20}}>
                      {page >= 0 && <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>}
                  </Container.ColumnCenter>
              )}
            /> 
      }
      </Container.Column>
    </Container.Column>
  )
}
interface NotificationProps {
  notification: Types.NotificationRead;
}
const Notification = ({notification}:NotificationProps) => {
    return (
      <Container.Row style={styles.notifcation} flexGrow={1}>
        <Container.View flexGrow={1}>
          <Container.Row gap={20} flexGrow={1}>
            <Container.Column gap={10} flexGrow={1} style={{width:0}}>
                <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14} color='rgb(113,113,122)'>12/12/2025 I 00:00</Text.Paragraphe>
                <Text.SubTitle fontSize={16} lineHeight={22}>{notification.heading}</Text.SubTitle>
                <Text.Paragraphe fontFamily='Urbanist-Medium' fontSize={14} lineHeight={14}>{notification.content}</Text.Paragraphe>
            </Container.Column>
            <Container.ColumnCenter>
              <Container.View>
                {!notification.is_read && <Icon.FontAwesome name="circle" color={Colors.green} size={8}/>}
              </Container.View>
            </Container.ColumnCenter>
          </Container.Row>
        </Container.View>
     
      </Container.Row>
     
    )
}
  

export default Notifications

const styles = StyleSheet.create({
  notifcation: {
    flexGrow:1,
    backgroundColor:"#F7F7F9",
    paddingVertical: 20,
  },
  flatList: {
    flexGrow:1,
    height:0
  },
  listContainer: {
    gap: 6,
  },

 
})