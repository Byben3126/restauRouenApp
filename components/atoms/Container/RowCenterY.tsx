import { StyleSheet, Text, View, TextStyle, LayoutChangeEvent } from 'react-native'
import React, { ReactNode } from 'react'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';


interface RowCenterYProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
    gap?: number | Float;
    flexGrow?: number;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

const RowCenterY: React.FC<RowCenterYProps> = ({ children, style, gap = 0, flexGrow = 0, onLayout}) => {
  return (
    <View 
      style={[styles.view, { gap, flexGrow }, style]}
      onLayout={onLayout}
    >
      {children}
    </View>
  )
}

export default RowCenterY

const styles = StyleSheet.create({
    view : {
        display : 'flex',
        flexDirection: 'row',
        alignItems : 'center',
    }
})