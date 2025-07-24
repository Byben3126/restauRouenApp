import { StyleSheet, Text, View, TextStyle, LayoutChangeEvent } from 'react-native'
import React, { ReactNode } from 'react'

interface RowProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    gap?: number;
    flexGrow?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

const Row: React.FC<RowProps> = ({ children, style, gap = 0, flexGrow = 0, onLayout}) => {
  return (
    <View style={[styles.view, { gap, flexGrow }, style]} onLayout={onLayout}>
      {children}
    </View>
  )
}

export default Row

const styles = StyleSheet.create({
    view : {
        display : 'flex',
        flexDirection: 'row',
    }
})