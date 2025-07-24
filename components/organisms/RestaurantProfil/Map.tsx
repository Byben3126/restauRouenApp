import { StyleSheet, View } from 'react-native';
import React, { useEffect , useRef, useState} from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { simpleMapStyle } from '@/constants/Map';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';


interface MapProps {
    latitude?: Float;
    longitude?: Float;
    lock?: boolean;
    changeCoordinate?: (newRegion:{latitude:Float, longitude:Float})=>void
}

const Map = ({ latitude, longitude, changeCoordinate, lock=false}:MapProps) => {

    const defaultRegion = {
        latitude: 49.4538207,
        longitude: 1.104587,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }
    const [region, setRegion] = useState<typeof defaultRegion>(defaultRegion)

    const mapRef = useRef<MapView>(null);
    const currentRegion = useRef(region);
    const mapIsDown = useRef<boolean>(false);
    const mapIsLoaded = useRef<boolean>(false);

    const goToCoordinate = (latitude: number, longitude: number, duration:number=1000) => {
        const newRegion = {
            latitude,
            longitude,
            latitudeDelta: Math.min(0.01, currentRegion.current.latitudeDelta),
            longitudeDelta: Math.min(0.01, currentRegion.current.longitudeDelta),
        };
        console.log("goToCoordinate", newRegion)

        if (mapIsLoaded.current) {
          mapRef.current?.animateToRegion(newRegion, duration);
        }else{
          setRegion(newRegion)
        }
    };

    const handlePanDrag = (event: any) => {
      mapIsDown.current = true;
    };

    const handleRegionChangeComplete = (newRegion: typeof defaultRegion) => {
      console.log('handleRegionChangeComplete')
      if (changeCoordinate && mapIsDown.current) {
        changeCoordinate(newRegion)
        mapIsDown.current = false
      }
      currentRegion.current = newRegion
    };

    const handleMapOnReady = () => {
      console.log('handleMapOnReady')
      if (latitude && longitude) {
        goToCoordinate(latitude, longitude, 0)
      }
    }
    const handleMapLoaded = () => {
      mapIsLoaded.current = true
    }

    useEffect(() => {
      console.log('useEffect', latitude, longitude)
      if (latitude && longitude) {
          mapRef.current?.forceUpdate()
          goToCoordinate(latitude, longitude)
      }
    },[latitude, longitude])
    useEffect(() => {
      console.log('Map mounted')
      return ()=>{
        console.log('Map unmounted')
      }
    })
    return (
      <View style={styles.view}>
        <MapView
          key={'mapLocalisation'}
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={simpleMapStyle}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          onMapReady={handleMapOnReady}
          onMapLoaded={handleMapLoaded}
          onPanDrag={handlePanDrag}
          scrollEnabled={!lock} // Désactive le défilement
          zoomEnabled={!lock}   // Désactive le zoom
          rotateEnabled={!lock} // Désactive la rotation
          // pointerEvents={lock ? "none" : undefined}   // cause des soucis et Désactive les interactions sur d'autre instance
          showsUserLocation={!lock}
        >
        </MapView>
      </View>
    );
};

export default Map;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: '100%',
    flexGrow:1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
