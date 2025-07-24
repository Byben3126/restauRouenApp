import { View, StyleSheet, TextStyle, Image, ImageBackground } from "react-native";
import React, { useState, useCallback }  from 'react'
import { Container, Icon } from '@/components/atoms';
import PagerView from 'react-native-pager-view';

interface DefaultCarouselProps {
  urls : Array<string>
}


const DefaultCarousel: React.FC<DefaultCarouselProps> = ({urls}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const onPageSelected = useCallback((e) => {
    console.log('e.nativeEvent.position',e.nativeEvent.position)
    setCurrentPage(e.nativeEvent.position);
  }, []);

  return (
    <Container.Column flexGrow={1} style={styles.view}>
      <PagerView style={styles.pagerView} initialPage={0} onPageSelected={onPageSelected}>
        {urls.map((url, index) => (
          <View key={index} style={styles.page}>
            <ImageBackground source={{uri: url}} resizeMode="cover" style={styles.imageBackground} blurRadius={40}>
              <Image source={{uri: url}} style={styles.image} />
            </ImageBackground>
          </View>
        ))}

      
      </PagerView>
      <Container.RowCenter style={styles.listCirles} gap={6}>

      {urls.map((url, index) => (
          (currentPage == index && <Icon.Minted name="circle" size={8} color="#fff"/>) || <Icon.Minted name="circle" size={8} color="#fff" opacity={0.6}/>
      ))}
        
      </Container.RowCenter>
    </Container.Column>
    
  );
}

export default DefaultCarousel

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    position: 'relative',
  },
  pagerView: {
    flexGrow: 1
    // height: 10, // Ajuste la hauteur selon tes besoins
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageBackground: {
    width: '100%',
    height: '100%',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  listCirles: {
    position: 'absolute',
    bottom: 40,
    zIndex: 99,
    width: '100%',
  }
});
