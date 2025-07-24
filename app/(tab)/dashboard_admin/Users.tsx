import { StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native'
import React, { useState, useCallback, useEffect, useRef} from 'react'
import { Container, Text, Badge, Button } from '@/components/atoms';
import { Input, Card, Header } from '@/components/molecules';
import NewOffer from '@/components/organisms/Pages/NewOffer';
import GivePoint from '@/components/organisms/Pages/GivePoint';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { searchCustomers } from '@/api/minted/customer';
import { useFocusEffect } from '@react-navigation/native';
import * as Types from '@/types';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Users: undefined;
    NewOffer: { customer?: Types.Customer };
    GivePoint: { customer?: Types.Customer };
};

export interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Users'>;
  route: RouteProp<RootStackParamList, 'Users'>;
}

const buttons = [
  { id: "all", label: "Tous" },
  { id: "innactive-customers", label: "Clients inactifs" },
  { id: "top-customers", label: "Meilleurs clients" },
];



const UsersScreen = ({ navigation, route }: HomeScreenProps) => {

  const [query, setQuery] = useState<string>('');
  const [navSelected, setNavSelected] = useState<'all'|'innactive-customers'|'top-customers'>('all')
  const [customers, setCustomers] = useState<Types.CustomerCardAdmin[]>([]);
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  //ref
  const refTimeoutSearch = useRef<number | null>(null);
  const inputRef = useRef<TextInput>(null);


  const changeNav = (type:string) => {
      if (navSelected === type) return;
      setCustomers([])
      setPage(0)
      setNavSelected(type)
  }

  const loadMoreItems = async (p?:number, q?:string) => {
      if (q == undefined) q = query;
      if (p == undefined) p = page;

      if (p == -1) return;
      console.log('loadMoreItems', p, q)

      setIsLoading(true)
      const { data } = await searchCustomers(
        q, 
        p,
        {'all': 'default', 'innactive-customers': 'inactive', 'top-customers': 'top'}[navSelected] as 'default'|'inactive'|'top' | undefined
       )
      setCustomers(p > 0 ? [...customers, ...data] : data)
      setPage(data.length < 10 ? -1 : p + 1)
      console.log('loadMoreItems', data.length, data)
      setIsLoading(false)
  }

  const handlerChangeQuery = (text:string) => {
    setQuery(text)
    setIsLoading(true)
    setCustomers([])
    setPage(0)

    if (refTimeoutSearch.current) clearTimeout(refTimeoutSearch.current)

    refTimeoutSearch.current = window.setTimeout(async () => {
      loadMoreItems(0, text);
    }, text.length ? 1000 : 0)
  }

  useEffect(() => {
    loadMoreItems(0);
  }, [navSelected]);

  //useFocusEffect detecte si l'utilisateur revient sur l'écran Map
  useFocusEffect(
    useCallback(() => {
        const tabNavigator = navigation.getParent();
        let timeoutId: number|null = null;

        if (tabNavigator) {
          const tabNavigatorState = tabNavigator.getState();
          const tabNavigatorRoute = tabNavigatorState.routes[tabNavigatorState.index];
          const autoFocusInput = tabNavigatorRoute.params?.autoFocusInput;

          if (autoFocusInput && inputRef.current) {
            setQuery('')
            timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 500);
            tabNavigator.setParams({ autoFocusInput: undefined });
          }
        }
        
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [navigation])
  );

  return (
    <SafeAreaView style={{ flex: 1}}>
        <Container.Column flexGrow={1} style={styles.view}>
            <Container.View style={styles.header}>
                <Input.MainInput 
                    inputStyle={styles.inputStyle} 
                    placeholder={'Rechercher un client...'} 
                    placeholderTextColor={"#B8B8BC"} 
                    style={styles.containerInput}
                    onChangeText={handlerChangeQuery}
                    value={query}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    buttonClear={true}
                    iconLeft={true}
                    ref={inputRef}
                />
                <Text.SubTitle fontSize={24} lineHeight={24} marginBottom={10}>Mes clients</Text.SubTitle>
            </Container.View>

            <ScrollView 
                style={styles.navigation} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.navigationContent}
            >

               {buttons.map((button, index) => (
                    <TouchableOpacity onPress={()=>changeNav(button.id)}>
                        {navSelected == button.id ?
                            <Button.ButtonRadius size={2}>{button.label}</Button.ButtonRadius>
                        :
                            <Button.ButtonRadiusOutline size={2}>{button.label}</Button.ButtonRadiusOutline>
                    }
                    </TouchableOpacity>
                ))}
  
            </ScrollView>

            {
              isLoading && !customers.length ?
                  <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>
              : !customers.length ?
                  <Container.ColumnCenter flexGrow={1}>
                      <Container.View>
                          <Text.Paragraphe fontSize={16} lineHeight={20} textAlign='center'>Aucun client trouvé.</Text.Paragraphe>
                      </Container.View>
                  </Container.ColumnCenter>
                
              :   
                <FlatList
                  data={customers}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false} 
                  // style={{flex: 1}}
                  style={styles.flatList}
                  ItemSeparatorComponent={() => <Container.View style={{height: 15}} />}
                  onEndReached={()=> customers.length && loadMoreItems()}
                  renderItem={({ item:customer, index }) => (
                      <Container.View>
                          <Card.CardUser 
                              customer={customer}
                              newOfferCb={() => navigation.navigate('NewOffer', { customer: customer })}
                              givePointCb={() => navigation.navigate('GivePoint', { customer: customer })}
                          />
                      </Container.View>
        
                  )}
                  ListFooterComponent={() => (
                      <Container.ColumnCenter style={{height: page >= 0 ? 80 : 20}}>
                          {page >= 0 && <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>}
                      </Container.ColumnCenter>
                  )}
                  // refreshControl={}
                      // {{refreshing && <ActivityIndicator size={'small'} style={{paddingVertical:20}}/>}}
                      // <RefreshControl refreshing={refreshing} size={0} onRefresh={handleRefresh} />
                />
          }
        
          
        </Container.Column>
    </SafeAreaView>
  )
}

const UsersStack = () => {

    return (
        <Stack.Navigator
          initialRouteName="Users"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'white' },
          }}
          
        >
          <Stack.Screen name="Users" component={UsersScreen} />
  
          <Stack.Screen 
            name="NewOffer" 
            component={NewOffer} 
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

          <Stack.Screen 
            name="GivePoint" 
            component={GivePoint} 
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
  
        </Stack.Navigator>
    )
};

export default UsersStack

const styles = StyleSheet.create({
    view : {
        marginTop: 20,
    },

    header: {
        display: 'flex',
        gap: 15,
    },
    inputStyle: {

    },
    containerInput : {
        width: '100%',
        // paddingLeft:22,
        paddingRight:8,
        backgroundColor: '#fff',
        height: 50,
        borderColor:"#71717A",
        borderWidth: 1,
        borderRadius : 25,
    },
    navigation: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        flexGrow: 0,
    },
    navigationContent: { 
        paddingLeft: 20, 
        paddingRight: 20,
        gap: 10,
    },
    flatList: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: 20,
        marginTop: 20,
        paddingBottom: 20,
        height:0

    },
})