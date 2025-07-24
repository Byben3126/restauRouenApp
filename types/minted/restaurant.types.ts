import { Float } from "react-native/Libraries/Types/CodegenTypes"

export interface RestaurantData {
    id: number
    name: string
    latitude: Float
    longitude: Float
    country: string
    city: string
    googleMyBuisnessLink?: string
    images: string
}

