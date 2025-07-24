import { StyleSheet, TextInput, TextStyle, TextInputProps, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import React, { ReactNode, forwardRef, useCallback, useState } from 'react';
import { Container, Icon } from '@/components/atoms';

interface MaintInputProps extends TextInputProps {
  style?: TextStyle | TextStyle[];
  iconLeft?: ReactNode | boolean;
  iconRight?: ReactNode | boolean;
  inputStyle?: TextStyle | TextStyle[];
  buttonClear?: Boolean
  isLoading?: Boolean
}


// Utilisation de forwardRef pour permettre au parent de passer une ref
const MaintInput = forwardRef<TextInput, MaintInputProps>(({
  style,
  inputStyle,
  iconLeft = false,
  iconRight = false,
  buttonClear = false,
  isLoading = false,
  ...props
}, ref) => {

  const [showPassword, setShowPassword] = useState(false)

  const clearInput = useCallback(()=>{
    if (props.onChangeText) props.onChangeText('')
  },[props])

  const renderIconRight = useCallback(()=>{
    if (isLoading) {
      return (<Container.RowCenter style={styles.containerActivityIndicator}>
         <ActivityIndicator size={'small'}/>
      </Container.RowCenter>)
    }else if (buttonClear && props.value) {
      return (
        <Pressable
          style={({ pressed }) => [
            styles.iconClear,
            pressed && styles.iconClearPressed, // Appliquer un style lorsque le bouton est pressé
          ]}
          onPress={clearInput}
        >
           <Icon.Ionicons name={"close-outline"} color={"#CEcbd590"} size={25} lineHeight={12}/>
        </Pressable>
        )
    }else if (iconRight) {
        if (React.isValidElement(iconRight)) {
          return <Container.RowCenter style={styles.containerIcon}>{iconRight}</Container.RowCenter>
        }
        // return (<Container.RowCenter style={styles.containerIcon}>
        //   <Icon.Minted name={"filter"} color={"#111132"} size={12} lineHeight={12}/>
        // </Container.RowCenter>)
    }else if (props.textContentType === 'password') {
      return (
        <TouchableOpacity activeOpacity={0.6} onPress={()=>setShowPassword((oldValue) => !oldValue)}>
          <Container.RowCenter style={[styles.containerIcon, styles.containerIconEye]}>
            <Icon.FontAwesome name={showPassword ? "eye-slash" : 'eye'} color={"#71717A"} size={18}/> 
          </Container.RowCenter>
        </TouchableOpacity>
      )
    }

    return null
  },[iconRight, showPassword, props])

  return (
    <Container.RowCenterY style={[styles.containerInput, style ?? StyleSheet.create({})]}>
      {iconLeft && (
        <Container.RowCenter style={styles.containerIcon}>
          {iconLeft === true ? (
            <Icon.RR name={"search-left"} color={"#111132"} size={17} lineHeight={17}/>
          ) : (
            iconLeft
          )}
        </Container.RowCenter>
      )}
      <TextInput
        ref={ref}
        style={[styles.input, inputStyle]}
        secureTextEntry={props.textContentType == 'password' && !showPassword}
        {...props}
      />
      {renderIconRight()}
    </Container.RowCenterY>
  );
});

export default MaintInput;

const styles = StyleSheet.create({
  containerInput: {
    backgroundColor: '#fff',
    height: 56,
    borderColor:"#71717A",
    borderWidth: 1,
    borderRadius : 24,
  },
  input: {
    flexGrow: 1,
    width: 0,
    fontSize: 14,
    fontFamily: '55Roman',
    height: '100%',
    color: '#71717A',
    letterSpacing: 0.6,
  },
  containerIcon: {
    height: 44,
    width: 44,
    lineHeight: 44,
    textAlign: 'center',
  },

  containerIconEye: {
    paddingRight: 0
  },
  iconClear: {
    marginRight: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  iconClearPressed: {
    backgroundColor: "#CEcbd530",
  },
  containerActivityIndicator: {
    height: 44*0.9,
    width: 44*0.9,
    transform: [{scale:0.9}]
  }
});