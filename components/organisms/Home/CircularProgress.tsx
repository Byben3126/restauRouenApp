import React, {memo, useCallback, useEffect, useRef} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { Container, Text } from '@/components/atoms';
import InsetShadow from 'react-native-inset-shadow'

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated';
import AngularGradient from './AngularGradiant'

interface CircularProgressProps {
  size: number; // Taille du cercle
  strokeWidth: number; // Largeur du trait
  value: number; // Progression en pourcentage (0 à 100)
  color: string; // Couleur de la progression
  backgroundColor: string; // Couleur de fond
  text: string; // Texte à afficher au centre
}
//circle start
const CIRCLE_START_STROKE = 2;

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  value,
  color,
  backgroundColor,
  text,
}) => {
  console.log('CircularProgress rendered',value,text);

  const radius = useRef((size - strokeWidth) / 2).current; // Rayon du cercle
  const circumference = useRef(2 * Math.PI * radius).current; // Circonférence du cercle

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  const progress = useSharedValue(value);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference //circumference - (progress.value / 100) * circumference,
  }));

  useEffect(() => {
    console.log('CircularProgress value changed:', value);
      progress.value = withTiming(value, { 
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      });
      // progress.value = withTiming(value, { duration: 2000 });
    }
  , [value]);

  return (
    <>
      <View style={[styles.container, { width: size, height: size}]}>
        <Svg 
          width={size + CIRCLE_START_STROKE * 3} 
          height={size}
          
        >
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              
              stroke={backgroundColor}
              strokeWidth={strokeWidth}
              fill="none"
            />

            <AnimatedCircle
               key="animated-circle" 
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
              
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                animatedProps={animatedProps}
                fill={'none'}
                strokeLinecap="round"
              />
        </Svg>
        <Svg 
          width={size + CIRCLE_START_STROKE * 3} 
          height={size}
          style={styles.circleStart}
        >
            <Circle
              cx={size - (strokeWidth / 2)}
              cy={size/2}
              r={strokeWidth / 2 + CIRCLE_START_STROKE*2}
              fill={"#FFF"}
              stroke={color}
              strokeWidth={CIRCLE_START_STROKE}
            />
        </Svg>
       

        <View style={[styles.containerCounter, { width: size, height: size}]}>
          <Container.ColumnCenter style={styles.counter}>
            <InsetShadow containerStyle={styles.insetShadow} shadowRadius={20} elevation={0.1} shadowOpacity={0.2}>
              <Text.Title style={styles.text} fontSize={21} textAlign='center'>{text}</Text.Title>
            </InsetShadow>
          </Container.ColumnCenter> 
        </View>



        <Container.ColumnCenter style={styles.angularGradient}>
          <AngularGradient size={size} colors={['#F8FAFC00', '#F8FAFC6A']} />
        </Container.ColumnCenter>

      </View>
    </>
  );
};


export default CircularProgress;

const styles = StyleSheet.create({
  container: {

  },
  circleStart: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },

  angularGradient:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
    transform: [
      {scaleY:-1}
    ]
  },
  
  containerCounter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  counter: {
    height: 145,
    width: 145,
    borderRadius: 9999,
    backgroundColor: '#FFF',

    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Ombre pour Android
    elevation: 4,

  },

  insetShadow: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});