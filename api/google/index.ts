
import axios from 'axios';
import { AutocompleteResult, PlaceDetails, InfoCoordsResult } from '@/types/google'
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

const GOOGLE_MAPS_APIKEY = 'AIzaSyA0wwD_66S71eKc5MIhDQ_haUrcLSwMkFQ'

//donne info sur une adress précisse
export async function getInfoAdress(adress: string) {
    let config = {
        method: 'GET',
        url:  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(adress)}&key=${GOOGLE_MAPS_APIKEY}`,
    };
    console.table(config)
    try {
        const response =  await axios.request(config)
        console.log("response",response)
        if (response.status == 200 && response.data) {
            return response.data
        }
        throw new Error("Impossible de récuperer les d'adresses");
    } catch (error) {
        throw error
    }
}

//donne info sur une une lat et long
export async function getInfoCoords(coords:{latitude:Float,longitude:Float}): Promise<InfoCoordsResult> {
    let config = {
        method: 'GET',
        url:  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_MAPS_APIKEY}`,
    };
    console.table(config)
    try {
        const response =  await axios.request(config)
        console.log("response",response)
        if (response.status == 200 && response.data) {
            return response.data
        }
        throw new Error("Impossible de récuperer les d'adresses");
    } catch (error) {
        throw error
    }
}

export async function getInfoPlaceId(placeId: string): Promise<PlaceDetails> {
    let config = {
        method: 'GET',
        url:  `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_APIKEY}`,
    };
  
    try {
        const response =  await axios.request(config)
        console.log("response",response)
        if (response.status == 200 && response.data && response.data.result) {
            return response.data.result
        }
        throw new Error("Impossible de récuperer les d'adresses");
    } catch (error) {
        throw error
    }
}

export async function autocompleteAdress(adress: string): Promise<{predictions: AutocompleteResult[]}> {
    let config = {
        method: 'GET',
        url:  `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(adress)}&components=country:fr&key=${GOOGLE_MAPS_APIKEY}`,
    };
    console.table(config)
    try {
        const response =  await axios.request(config)
        console.log("response",response)
        if (response.status == 200 && response.data) {
            return response.data
        }
        throw new Error("Impossible de récuperer les d'adresses");
    } catch (error) {
        throw error
    }
}