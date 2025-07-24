import { StyleSheet, View, Image, SafeAreaView, Animated, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import { Container, Text, Button, Icon} from '@/components/atoms';
import Colors from '@/constants/Colors';
import { useRouter } from "expo-router";

const Client = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
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
    router.replace('/dashboard_user');
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
          <Text.SubTitle style={styles.subTittle}>{'Dîne, gagne et profite des récompenses !'}</Text.SubTitle>
          <Text.Paragraphe style={styles.paragraphe}>{'Cumule des points dans tes restaurants préférés et débloque de délicieuses récompenses à chaque visite 😁'}</Text.Paragraphe>
        </Container.ColumnCenter>
        <Container.ColumnCenter style={styles.page}>
          <Image style={[styles.image, {aspectRatio: 261.93/288.1, width: '60%'}]} source={require('@/assets/images/walkthrough_client_2.png')}/>
          <Text.SubTitle style={styles.subTittle}>{'Gagne des points \nfacilement !'}</Text.SubTitle>
          <Container.View>
            <Text.Paragraphe style={styles.paragraphe}>{'Scanne simplement ton QR code lors du paiement, et le restaurant ajoutera les points automatiquement à ton profil.'}</Text.Paragraphe>
          </Container.View>
         
        </Container.ColumnCenter>
        <Container.ColumnCenter style={styles.page}>
          <Image style={[styles.image, {aspectRatio: 261.38/201.33, width: '64%'}]} source={require('@/assets/images/walkthrough_client_3.png')}/>
          <Text.SubTitle style={styles.subTittle}>{'Offres exclusives pour\n les clients fidèles !'}</Text.SubTitle>
          <Container.View>
            <Text.Paragraphe style={styles.paragraphe}>{'Profitez de récompenses personnalisées et d’avantages réservés à nos habitués les plus fidèles 😍.'}</Text.Paragraphe>
          </Container.View>
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

export default Client

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