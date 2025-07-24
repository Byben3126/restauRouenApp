import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export interface Delivery {
    address_line1: string
    postal_code: string
    city: string
    name: string
    country_code: string
    latitude: Float
    longitude: Float
    carriers: Array<number>
    id?: number|string
}