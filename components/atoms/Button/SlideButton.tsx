import { StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState }  from 'react'
import { Container, Icon } from '..'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics';

interface SlideButtonProps {
  text: string
  isLoading?: Boolean
  completedCb?: Function
  textLanding?: String
}


const BUTTON_HEIGHT = 60

const SlideButton: React.FC<SlideButtonProps> = ({text = '', isLoading = false, completedCb = ()=>{}, textLanding=''}) => {
  const [swipeWidth, setSwipeWidth] = useState(0)
  const X = useSharedValue(0)
  const [toggled, setToggled] = useState(false)

  const handlerComplete = (isToggled:boolean) => {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    )
    completedCb({
      resetPosition
    })

   
  }

  const triggerVibration = () => {
    Haptics.selectionAsync()
  };

  const resetPosition = () => {
    X.value = withSpring(0, {
      damping: 20,  
      stiffness: 100,
      mass: 0.8,
    });
  }

  // Configuration du geste
  const gesture = Gesture.Pan()
  .onStart(() => {
    // X.value = withSpring(0, {
    //   damping: 20,    // Valeur plus élevée pour réduire l'oscillation
    //   stiffness: 100, // Moins rigide pour un effet de ralentissement
    //   mass: 0.8,      // Ajuste la "masse" pour contrôler la vitesse initiale
    // });
  })
  .onUpdate((e) => {
    const oldValue = X.value
    const newValue = e.translationX;
    if (newValue >= 0) {
      if (newValue <= swipeWidth-BUTTON_HEIGHT) {
        X.value = newValue;
        if (newValue < 1 && oldValue >= 1) {
          runOnJS(triggerVibration)();
        }
      }else{
        X.value = swipeWidth-BUTTON_HEIGHT;
        if (oldValue < swipeWidth-BUTTON_HEIGHT) {
          runOnJS(triggerVibration)();
        }
      }
    }
  })
  .onEnd(() => {
    if (X.value < swipeWidth / 2) {
      X.value = withSpring(0, {
        damping: 20,  
        stiffness: 100,
        mass: 0.8,
      });
    } else {

      X.value = withSpring(swipeWidth-BUTTON_HEIGHT, {
        damping: 20,  
        stiffness: 100,
        mass: 0.8,
      });
      runOnJS(handlerComplete)(true);
    }
    
  });

  const AnimatedStyles = {
    swipeStyles : useAnimatedStyle(()=> ({
        transform : [{
          translateX: X.value
        }]
    })),
    swipeText : useAnimatedStyle(()=> {
      if (isLoading && textLanding) {
        return { opacity: 1 }; // Force l'opacité à 1 si les conditions sont remplies
      }
      return {
        opacity: interpolate(X.value, [0, 150], [1, 0], Extrapolation.CLAMP)
      }
      
    })
  }

  return (
    <Container.RowCenterY style={styles.button}>

        <Container.RowCenterY 
          style={styles.containerSwipe}
          onLayout={(event) => {
            setSwipeWidth(event.nativeEvent.layout.width); 
          }}
        >
          <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.buttonSwipe, AnimatedStyles.swipeStyles]}>

              {isLoading ? (
                <ActivityIndicator size={'small'}/>
              ):(<>
                <Icon.Minted name="chevronRight" color='#160837' opacity={0.45} size={14}/>
                <Icon.Minted name="chevronRight" color='#160837' size={14}/>
              </>)}
              </Animated.View>
          </GestureDetector>
        
          <Animated.Text style={[styles.text, AnimatedStyles.swipeText]}>
            {isLoading && textLanding ? textLanding : text}
          </Animated.Text>
        </Container.RowCenterY>
    </Container.RowCenterY>
  )
}

export default SlideButton

const styles = StyleSheet.create({
  text : {
    color:'#fff',
    fontSize: 16,
    lineHeight:17,
    fontFamily : '55Roman',
    textAlign: 'center',
    width: '100%'
  },
  button: {
    backgroundColor: '#160837',
    borderRadius: BUTTON_HEIGHT,
    // width: 170,
    padding: 4,
    width: '100%'
  },

  containerSwipe: {
    position: 'relative',
    height: BUTTON_HEIGHT,
    width: '100%'
  },
  
  buttonSwipe: {
    position:'absolute',
    zIndex: 10,
    height: BUTTON_HEIGHT,
    width: BUTTON_HEIGHT,
    left: 0,
    borderRadius: 99,
    backgroundColor: "#fff",
    display : 'flex',
    flexDirection: 'row',
    alignItems : 'center',
    justifyContent: 'center',
    gap: 0.7,
    flexWrap: 'nowrap'
  }
})


