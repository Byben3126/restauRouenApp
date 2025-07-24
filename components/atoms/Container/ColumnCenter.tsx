import { StyleSheet, Text, View, TextStyle, LayoutChangeEvent } from 'react-native'
import React, { ReactNode } from 'react'

interface ColumnCenterProps {
    children?: ReactNode;
    style?: TextStyle | TextStyle[];
    gap?: number;
    flexGrow?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

const ColumnCenter: React.FC<ColumnCenterProps> = ({ children = <></>, style, gap = 0, flexGrow = 0, onLayout}) => {
  return (
    <View style={[styles.view, { gap, flexGrow }, style]} onLayout={onLayout}>
      {children}
    </View>
  )
}

export default ColumnCenter

const styles = StyleSheet.create({
    view : {
        display : 'flex',
        flexDirection: 'column',
        alignItems : 'center',
        justifyContent : 'center',
    }
})
