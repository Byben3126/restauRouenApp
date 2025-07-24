import { StyleSheet, View, TextStyle } from 'react-native'
import React, { ReactNode } from 'react'

interface ViewProps {
  children?: ReactNode;
  style?: TextStyle | TextStyle[];
  flexGrow?: number;
}

const ContainerView: React.FC<ViewProps> = ({ children, style , flexGrow = 0}) => {
  return (
    <View style={[styles.view, {flexGrow}, style]}>
      {children}
    </View>
  );
}

export default ContainerView

const styles = StyleSheet.create({
  view : {
    width: '100%',
    paddingHorizontal: 20
  }
})
