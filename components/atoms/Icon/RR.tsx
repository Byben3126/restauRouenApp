import React from "react";
import {Text, StyleSheet, TextStyle} from "react-native"
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import glyphmaps from "./RRIcons/glyphmaps/RRIcons.json"

interface RRIconProps {
    name?: string,
    size?: number | Float
    color?: string
    lineHeight?: number | Float
    opacity?: number | Float
    style?: TextStyle | TextStyle[]
}

const RR: React.FC<RRIconProps> = ({name = 'circle', size = 12, color = "#000000", lineHeight = 18, opacity = 1, style = {}}) => {
    return <Text style={[styles.icon,{color, lineHeight, opacity, fontSize : size},style]}>{glyphmaps[name]}</Text>;

}

export default RR;

const styles = StyleSheet.create({
    icon: {
      fontFamily:'RRIcon'
    },
})
