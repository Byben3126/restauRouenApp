import { Float } from "react-native/Libraries/Types/CodegenTypes"
import { MarkerPressEvent, MarkerDeselectEvent } from 'react-native-maps';
import { ImageURISource } from 'react-native';

export interface Marker {
    id:string|number,
    coordinate: {
      latitude: Float,
      longitude: Float
    }
    title?:string
    description?:string
    pinColor?: string;
    image?: ImageURISource;
    onPress?: (event:MarkerPressEvent)=>void
    onDeselect?: (event:MarkerDeselectEvent)=>void
}