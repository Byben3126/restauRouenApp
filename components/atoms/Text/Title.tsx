import { StyleSheet, Text, View, TextStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

interface TitleProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    fontSize?: number;
    lineHeight?: number | Float;
    color?: string;
    letterSpacing?: Float | Float
    marginBottom?: number | Float
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  }

  const Title: React.FC<TitleProps> = ({ 
    children, 
    style, 
    fontSize = 16, 
    color = '#000', 
    letterSpacing = 0.6, 
    textAlign= 'auto',
    marginBottom = 0, 
    lineHeight = null}) => {
    return (
      <Text style={[styles.text, {fontSize, color, letterSpacing, marginBottom, lineHeight, textAlign}, style]}>
        {children}
      </Text>
    );
  }

export default Title

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Urbanist-Bold',
    },
})