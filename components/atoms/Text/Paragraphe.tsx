import { StyleSheet, Text, View, TextStyle } from 'react-native'
import React, { ReactNode } from 'react'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

interface ParagrapheProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[];
  fontSize?: number;
  letterSpacing?: number | Float
  color?: string
  lineHeight?: number | Float;
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
  fontFamily?: string;
}

const Paragraphe: React.FC<ParagrapheProps> = ({ 
  children, 
  style, 
  fontSize = 12, 
  letterSpacing = 1 , 
  color = '#000', 
  lineHeight = 12,  
  textAlign= 'auto',
  fontFamily= 'Urbanist-Regular'
}) => {
  return (
    <Text style={[styles.text, { fontSize, letterSpacing, color, lineHeight, textAlign, fontFamily}, style]}>
      {children}
    </Text>
  );
}

export default Paragraphe

const styles = StyleSheet.create({
  text : {
    
  }
})
