import { StyleSheet, Dimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { simpleMapStyle } from '@/constants/Map';
import { Text } from '@/components/atoms';
import * as Types from '@/types';
import { getCenter } from 'geolib'; // Import de geolib


interface DefaultMapsProps {
  markers: Types.Marker[];
}

const DefaultMaps: React.FC<DefaultMapsProps> = ({ markers = []}) => {
  const [region, setRegion] = useState({
    latitude: 48.109423,
    longitude: -1.669494, // Coordonnées approximatives initiales
    latitudeDelta: 0.0022,
    // longitudeDelta: 0.0021,
  });

  useEffect(() => {
    if (markers.length > 0) {

      const coordinates = markers.map((marker) => ({
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
      }));

      let minLat = Number.MAX_VALUE;
      let maxLat = Number.MIN_VALUE;
      let minLng = Number.MAX_VALUE;
      let maxLng = Number.MIN_VALUE;
    
      // Trouver les limites
      coordinates.forEach(({ latitude, longitude }) => {
        minLat = Math.min(minLat, latitude);
        maxLat = Math.max(maxLat, latitude);
        minLng = Math.min(minLng, longitude);
        maxLng = Math.max(maxLng, longitude);
      });

      const longitudeDelta = (maxLng - minLng) * (1 + 1);
      const latitudeDelta = (maxLat - minLat) * (1 + 1); // Ajouter un padding
    
  
      // Calculer le centroïde
      const center = getCenter(coordinates);
      console.log("center",center,{minLat,maxLat,minLng,maxLng},{longitudeDelta, latitudeDelta})
      if (center) {
        setRegion((prevRegion) => ({
          ...prevRegion,
          longitude: center.longitude,
          latitude: center.latitude,
          longitudeDelta: Math.max(0.0022, longitudeDelta),
          latitudeDelta: Math.max(0.0022, latitudeDelta),
        }));
      }
    }
  }, [markers]);

  return (
    <View style={styles.view}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={simpleMapStyle}
        region={region} // Utilisation de la région pour centrer la carte
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={marker.onPress}
            onDeselect={marker.onDeselect}
            pinColor={marker.pinColor}
            // image={require('./../../../assets/images/marker_map.png')}
            // anchor={{ x: 0.5, y: 0.5 }}
          />
        ))}
      </MapView>
    </View>
  );
};

export default DefaultMaps;

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
