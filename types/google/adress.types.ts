import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type AutocompleteResult = {
  description: string;
  matched_substrings: { length: number; offset: number }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: { length: number; offset: number }[];
    secondary_text: string;
  };
  terms: { offset: number; value: string }[];
  types: string[];
};


type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};
  
type Geometry = {
  location: {
    lat: number;
    lng: number;
  };
  viewport: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
};
  
export type PlaceDetails = {
  address_components: AddressComponent[];
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  place_id: string;
  reference: string;
  types: string[];
  url: string;
  utc_offset: number;
  vicinity: string;
};

export type InfoCoordsResult = {
  plus_code:{
    "compound_code": string,
    "global_code": string,
  },
  results: {
    address_components: {
        long_name: string,
        short_name:string,
        types: string[]
    }[],
    formatted_address: string,
    geometry: Geometry,
    navigation_points: {
      location:{
        latitude: Float,
        longitude: Float
      }
    }[],
    place_id: string,
    types: string[]
  }[]

}