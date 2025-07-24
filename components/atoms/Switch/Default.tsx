import { Switch, View, StyleSheet, TextStyle } from "react-native";
import React, { useState }  from 'react'

interface DefaultSwitchProps {
  value?: Boolean;
  disabled?: boolean;
  toggled?: boolean;
  style?: TextStyle | TextStyle[];
  onValueChange: Function
}

const DefaultSwitch: React.FC<DefaultSwitchProps> = ({onValueChange, value = false, disabled = false, toggled = true, style}) => {
  const [toggledTest,setToggleTest] = useState(false)
  return (
    <View

      style={style}
      // style={[
      //   styles.container,
      //   {
      //     backgroundColor: toggled
      //       ? "rgb(0,0,0)"
      //       : "rgba(255,255,255,0)",
      //   },
      // ]}
    >
      <Switch
        value={value}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#F6ECFF"
        trackColor={{
          false: "#fbfbfb",
          true: '#160837',
        }}
        style={{
          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        }}
        onValueChange={onValueChange}
        // disabled={disabled}
      />
    </View>
  );
}

export default DefaultSwitch

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    width: 40,
    height: 23,
    overflow: "hidden",
    borderRadius: 50,
    borderColor: 'red',
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
