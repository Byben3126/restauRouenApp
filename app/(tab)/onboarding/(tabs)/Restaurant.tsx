import { StyleSheet, View, Image, SafeAreaView, Animated, TouchableOpacity} from 'react-native'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import { Container, Text, Button, Icon} from '@/components/atoms';
import Colors from '@/constants/Colors';
import { useRouter } from "expo-router";

const Restaurant = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);

  //ref
  const markerWidths = useRef([new Animated.Value(8), new Animated.Value(8), new Animated.Value(8)]).current;
  const pagerRef = useRef<PagerView>(null);
  
  //context
  const router = useRouter();

  const onCarouselScroll = useCallback((event:PagerViewOnPageScrollEvent) => {
    if (typeof event.nativeEvent?.position !== "number") {
      return;
    }
    const newIndex = Math.round(
      event.nativeEvent.position + event.nativeEvent.offset,
    );
    if (newIndex !== carouselIndex) {
      setCarouselIndex(newIndex);
    }
  }, [carouselIndex, setCarouselIndex]);

  const nextSlide = () => {
    if (carouselIndex === 2) {
      finish()
      return;
    }
    setCarouselIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % 3
      pagerRef?.current?.setPage(newIndex);
      return newIndex;
    });
  };

  const finish =() => {
    router.replace("/landing_admin");
  }
  
  useEffect(() => {
    // Réinitialise toutes les largeurs à 8
    markerWidths.forEach((width, index) => {
      Animated.timing(width, {
        toValue: index === carouselIndex ? 26 : 8, // Largeur 26 pour l'index actif, 8 pour les autres
        duration: 300, // Durée de la transition
        useNativeDriver: false,
      }).start();
    });
  }, [carouselIndex, markerWidths]);
  
  return (
    <SafeAreaView style={styles.walkthrough}>
      <PagerView 
        ref={pagerRef}
        style={styles.pagerView} 
        initialPage={carouselIndex}
        onPageScroll={onCarouselScroll}
      >
        <Container.ColumnCenter style={styles.page}>
          <Image style={[styles.image, {aspectRatio: 194.87/244.49, width: '54%'}]} source={require('@/assets/images/walkthrough_client_1.png')}/>
          <Text.SubTitle style={styles.subTittle}>{'Boost Customers Loyalty \n with every visit'}</Text.SubTitle>
          <Text.Paragraphe style={styles.paragraphe}>{'Create meaningful relationships with\n your customers by offering rewards\n they’ll love. It\'s quick, easy, and \n effective'}</Text.Paragraphe>
        </Container.ColumnCenter>
        <Container.ColumnCenter style={styles.page}>
          <Image style={[styles.image, {aspectRatio: 261.93/288.1, width: '60%'}]} source={require('@/assets/images/walkthrough_client_2.png')}/>
          <Text.SubTitle style={styles.subTittle}>{'How it Works'}</Text.SubTitle>
          <Text.Paragraphe style={styles.paragraphe}>{'Scan a customer’s QR code, add points\n for their visit or purchase, and let them\n unlock rewards while you\n grow your loyal audience'}</Text.Paragraphe>
        </Container.ColumnCenter>
        <Container.ColumnCenter style={styles.page}>
          <Image style={[styles.image, {aspectRatio: 261.38/201.33, width: '64%'}]} source={require('@/assets/images/walkthrough_client_3.png')}/>
          <Text.SubTitle style={styles.subTittle}>{'Insights and Engagement\n at Your Fingertips'}</Text.SubTitle>
          <Text.Paragraphe style={styles.paragraphe}>{'Track customer activity, reward\n redemptions, and enjoy tools designed\n to bring customers back for more.'}</Text.Paragraphe>
        </Container.ColumnCenter>
      </PagerView>
    
      <Container.RowCenter style={styles.containerNavigation}>
        <Container.RowCenter style={styles.navigation}>
          <TouchableOpacity activeOpacity={0.6} onPress={finish}>
            <Text.SubTitle color={Colors.primary} fontSize={16} lineHeight={16}>Ignorer</Text.SubTitle>
          </TouchableOpacity>
     
          <TouchableOpacity activeOpacity={0.6} onPress={nextSlide}>
            <Button.ButtonRadius iconRight={<Icon.RR name={"next"} color={"#fff"} size={10}/>}>Suivant</Button.ButtonRadius>
          </TouchableOpacity>
       
           
        </Container.RowCenter>
        <Container.RowCenter style={styles.markers}>
          {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.marker,
                  {
                    width: markerWidths[index], // Largeur animée
                    backgroundColor:
                      index === carouselIndex ? Colors.primary : Colors.grey, // Couleur dynamique
                  },
                ]}
              />
            ))}
        </Container.RowCenter>
       </Container.RowCenter>
     
    </SafeAreaView>
  )
}

export default Restaurant

const styles = StyleSheet.create({
  walkthrough: {
    flex: 1,
  },
  pagerView: {
    flexGrow: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    gap: 30,
  },
  image: {
    width: '54%',
    height: 'auto',
    marginBottom: 20,
   
  },
  subTittle: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 32,
  },
  paragraphe: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  containerNavigation: {
    position: 'relative',
    width: '100%',
  },
  markers: {
    position: 'absolute',
    transform: [{ translateY: '-100%' }],
    width: '100%',
    aspectRatio: 12/3,
    top: 0,
    gap: 4,
  },
  marker: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },

  navigation: {
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
})