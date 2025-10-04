import { StyleSheet, Animated} from 'react-native'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Container, Text } from '@/components/atoms';
import Colors from '@/constants/Colors';
import CircularProgress from './CircularProgress';
import PagerView, { PagerViewOnPageScrollEvent } from 'react-native-pager-view';
import * as Types from '@/types'


type ProgressBarProps = {
  customers: Types.CustomerWithPregress[];
}

const ProgressBar = ({customers}:ProgressBarProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const markerWidths = useRef([new Animated.Value(8), new Animated.Value(8), new Animated.Value(8)]).current;

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
 
    <Container.ColumnCenterX style={styles.containerProgressBar}>
      <CircularProgress
        size={238}
        strokeWidth={25}
        color={Colors.primary}
        backgroundColor="#F3F3F3"
        value={customers.length ? 
            customers[carouselIndex]?.progress?.closest_reward ? 
              customers[carouselIndex]?.points / customers[carouselIndex]?.progress?.closest_reward.point_required * 100
            : 100 
          : 5
        }
        // text='ok'
        text={`${customers[carouselIndex]?.points || 0}\nPoint${customers[carouselIndex]?.points > 1 ? 's' : ''}`}
     />


      {(!customers || customers.length === 0) && (
        <Container.ColumnCenter gap={10} style={styles.pagerView}>
          <>
          <Text.SubTitle fontSize={16} lineHeight={16}>Aucun point pour le moment</Text.SubTitle>
          <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={12} lineHeight={16}>
            {'Vous n\'avez pas encore de points, visitez un restaurant pour commencer à accumuler des points.'}
          </Text.Paragraphe>
          </>
        </Container.ColumnCenter>
      )}

      {customers?.length && 
        <PagerView 
          style={styles.pagerView} 
          initialPage={carouselIndex}
          onPageScroll={onCarouselScroll}
          
        >
    
        
        
          {customers.map((customer,index) => (
           
              <Container.ColumnCenter gap={10} style={{paddingHorizontal:10}}>
         
                <Text.SubTitle fontSize={16} lineHeight={16}>#{index+1} {customer.restaurant?.name}</Text.SubTitle>
                
                {
                  customer.progress.closest_reward ? (
                    <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={12} lineHeight={16}>
                      {`Vous êtes à ${customer.progress.closest_reward.point_required - customer.points} points de votre prochaine récompense : ${customer.progress.closest_reward.name}`}
                    </Text.Paragraphe>
                  ) : (
                    
                    customer.points == 0 ? (
                      <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={12} lineHeight={16}>
                        {'Vous avez 0 points, vous ne pouvez pas obtenir de récompense pour le moment'}
                      </Text.Paragraphe>
                    ) : (
                      <Text.Paragraphe fontFamily='Urbanist-Medium' textAlign='center' fontSize={12} lineHeight={16}>
                        {'Vous avez accumulé assez de points pour vous \n offrir n\'importe quel article du restaurant.'}
                      </Text.Paragraphe>
                    )
                  )
                }
  
              </Container.ColumnCenter>
            
          ))}
      

        </PagerView>
      }

      <Container.RowCenter style={styles.markers}>
          {customers.map((customer,index) => (
              <Animated.View
                key={customer.id}
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

    </Container.ColumnCenterX>   
  )
}


export default ProgressBar

const styles = StyleSheet.create({

  containerProgressBar: {
    marginVertical: 20,
    position: 'relative'
  },

  pagerView: {
    width: '100%',
    height : 150,
  },

  markers: {
    position: 'absolute',
    transform: [{ translateY: '-100%' }],
    width: '100%',
    bottom: 0,
    gap: 4,
  },

  marker: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey,
  },
})