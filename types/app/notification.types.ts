import { TextStyle } from "react-native"
import { Float } from "react-native/Libraries/Types/CodegenTypes"

export interface Notification {
    title?: string|number
    subTitle?: string|number
    urlImage?: string
    icon?: {
        name?:string,
        color?:string,
        size?:number|Float
        lineHeight?:number|Float
        style?: TextStyle,
    },
    id?: number,
    additionalData?: any
}