import { StyleSheet, Keyboard, TouchableWithoutFeedback, TextStyle, View } from 'react-native'
import React, { ReactNode } from 'react'

interface DismissKeyboardProps {
    children: ReactNode;
    style?: TextStyle | TextStyle[];
}

const DismissKeyboard: React.FC<DismissKeyboardProps> = ({ children, style}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flexGrow:1}}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default DismissKeyboard

const styles = StyleSheet.create({

    
})