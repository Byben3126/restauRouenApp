import { StyleSheet, Text, View, TextStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

interface SubTitleProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    fontSize?: number;
    lineHeight?: number | Float;
    color?: string;
    letterSpacing?: Float | Float
    marginBottom?: number | Float
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  }

  const SubTitle: React.FC<SubTitleProps> = ({ children, style, fontSize = 14, color = '#000', letterSpacing = 0.6, marginBottom = 0, lineHeight = 14, textAlign = 'start'}) => {
    return (
      <Text style={[styles.text, {fontSize, color, letterSpacing, marginBottom, lineHeight, textAlign}, style]}>
        {children}
      </Text>
    );
  }

export default SubTitle

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Urbanist-SemiBold',
    },
})