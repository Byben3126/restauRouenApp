import { StyleSheet, Text, View, TextStyle, LayoutChangeEvent } from 'react-native'
import React, { ReactNode } from 'react'

interface ColumnCenterYProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    gap?: number;
    flexGrow?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

const ColumnCenterY: React.FC<ColumnCenterYProps> = ({ children, style, gap = 0, flexGrow = 0, onLayout}) => {
  return (
    <View style={[styles.view, { gap, flexGrow }, style]} onLayout={onLayout}>
      {children}
    </View>
  )
}

export default ColumnCenterY

const styles = StyleSheet.create({
    view : {
        display : 'flex',
        flexDirection: 'column',
        justifyContent : 'center',
    }
})