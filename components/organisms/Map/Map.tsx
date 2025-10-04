import { StyleSheet, View, Image, Keyboard } from 'react-native';
import { useEffect , useRef, useState, memo, useCallback} from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, MapMarker } from 'react-native-maps';
import { simpleMapStyle } from '@/constants/Map';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import  * as Types from '@/types'
import { Region } from 'react-native-maps';
import { Container, Text } from '@/components/atoms';
import Colors from '@/constants/Colors';



interface MapProps {
    latitude?: Float;
    longitude?: Float;
    lock?: boolean;
    markers?: Types.Marker[];
    marker?: Types.Marker|null;
    changeRegion?: (newRegion:Region)=>void
}



const Map = ({ latitude, longitude, changeRegion, lock=false, marker = null, markers = []}:MapProps) => {
    console.log('Map')
    const defaultRegion = {
        latitude: 49.4538207,
        longitude: 1.104587,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    }
    const [region, setRegion] = useState<typeof defaultRegion>(defaultRegion)
    const [showDetail, setShowDetail] = useState<boolean>(false)

    const mapRef = useRef<MapView>(null);
    const currentRegion = useRef(region);
    const mapIsDown = useRef<boolean>(false);
    const mapIsLoaded = useRef<boolean>(false);
    const pinImage = require('@/assets/images/restaurant_marker-min.png')
   

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
      // mapRef.current?.forceUpdate()
      mapIsDown.current = true;
    };

    const handleRegionChangeComplete = (newRegion: Region) => {
      console.log('handleRegionChangeComplete')
      if (changeRegion && mapIsDown.current) {
        changeRegion(newRegion)
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
      console.log("handleMapLoaded")
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
      setShowDetail(markers.length < 5 || (currentRegion.current || region).longitudeDelta < 0.0020981580018997192)
    },[region, currentRegion.current, markers])


  
  return (
    <View style={styles.view}>
      <MapView
        key={'map'}
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={simpleMapStyle}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMapReady={handleMapOnReady}
        onMapLoaded={handleMapLoaded}
        onPanDrag={handlePanDrag}
        onTouchStart={() => { Keyboard.dismiss();}}
        scrollEnabled={true} // Désactive le défilement
        zoomEnabled={true}   // Désactive le zoom
        rotateEnabled={true} // Désactive la rotation
        pointerEvents={'auto'} 
        showsUserLocation={true}
      
        // loadingEnabled = {true}
        // loadingIndicatorColor="#666666"
        // loadingBackgroundColor="#eeeeee"
        // moveOnMarkerPress = {false}
        // showsCompass={true}
        // showsPointsOfInterest = {false}
        
      >
        
        { marker && <Marker
            key={marker.id.toString()} 
            identifier={marker.id.toString()}
            coordinate={marker.coordinate}
            tracksViewChanges= {false}
            onPress={marker.onPress}
            onDeselect={marker.onDeselect}
            pinColor={marker.pinColor}
            >
             
            {marker.image && <Image source={marker.image} style={{width:34, height: 'auto',aspectRatio:88/112}}/>}
          </Marker>
          
        }

        {markers.map((m) => {
          return (<Marker
            key={m.id.toString()} 
            identifier={m.id.toString()}
            coordinate={m.coordinate}
            tracksViewChanges= {false}
            onPress={m.onPress}
            onDeselect={m.onDeselect}
            pinColor={m.pinColor}
            zIndex={1000}
            anchor={{ x: 0.1, y: 1 }} // Ajuste l'ancre du marker pour qu'il soit centré sur le point
            
          >
            <Container.RowCenterY gap={8} >
              <Image source={pinImage} style={{width:34, height: 'auto',aspectRatio:88/112}}/>
              
              <Text.SubTitle 
                fontSize={14}
                lineHeight={18}
                color={Colors.primary} style={{
                width:120,
                textShadowColor: '#fff',
                textShadowOffset: {width: 0, height:0},
                textShadowRadius: 1
              }}>{showDetail && m.title}</Text.SubTitle>
            </Container.RowCenterY>
            
          </Marker>
        )})}
      </MapView>
    </View>
  );
};


export default memo(Map);

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
