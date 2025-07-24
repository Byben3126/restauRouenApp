import { StyleSheet, View } from 'react-native';
import { useEffect, useRef, useState, memo, useMemo } from 'react';
import { AppleMaps, Coordinates, } from 'expo-maps';
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { simpleMapStyle } from '@/constants/Map';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import * as Types from '@/types';
import { Region } from 'react-native-maps';
import { AppleMapsMarker } from 'expo-maps/build/apple/AppleMaps.types';

interface MapProps {
    latitude?: Float;
    longitude?: Float;
    lock?: boolean;
    markers?: Types.Marker[];
    marker?: Types.Marker | null;
    changeRegion?: (newRegion: any) => void;
}

const markersApple = [
  {
    coordinates: { latitude: 49.259133, longitude: -123.10079 },
    title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.268034, longitude: -123.154819 },
    title: "49th Parallel Café & Lucky's Doughnuts - 4th Ave",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.286036, longitude: -123.12303 },
    title: "49th Parallel Café & Lucky's Doughnuts - Thurlow",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: { latitude: 49.311879, longitude: -123.079241 },
    title: "49th Parallel Café & Lucky's Doughnuts - Lonsdale",
    tintColor: "brown",
    systemImage: "cup.and.saucer.fill",
  },
  {
    coordinates: {
      latitude: 49.27235336018808,
      longitude: -123.13455838338278,
    },
    title: "A La Mode Pie Café - Granville Island",
    tintColor: "orange",
    systemImage: "fork.knife",
  },
];

const Map = ({ latitude, longitude, changeRegion, lock = false, marker = null, markers = [] }: MapProps) => {
    const defaultRegion = {
        latitude: 49.4538207,
        longitude: 1.104587,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };
    const [region, setRegion] = useState<typeof defaultRegion>(defaultRegion);

    const mapRef = useRef(null);
    const currentRegion = useRef(region);

    const goToCoordinate = (latitude: number, longitude: number, duration: number = 1000) => {
        return
        const newRegion = {
            latitude,
            longitude,
            latitudeDelta: Math.min(0.01, currentRegion.current.latitudeDelta),
            longitudeDelta: Math.min(0.01, currentRegion.current.longitudeDelta),
        };
        console.log('goToCoordinate', newRegion);

        mapRef.current?.animateCamera({
            center: { latitude, longitude },
            zoom: 15,
        }, { duration });
    };

    const handleRegionChangeComplete = (newRegion: any) => {
        console.log('handleRegionChangeComplete');
        if (changeRegion) {
            changeRegion(newRegion);
        }
        currentRegion.current = newRegion;
    };

    const handleCameraMove = (event: {
        coordinates: Coordinates;
        zoom: number;
        tilt: number;
        bearing: number;
    }) => {
        if (event.coordinates.latitude && event.coordinates.longitude) {
            const newRegion:Region = {
                latitude: event.coordinates.latitude,
                longitude: event.coordinates.longitude,
                latitudeDelta: event.zoom,
                longitudeDelta: event.zoom
            }
            if (changeRegion) {
                changeRegion(newRegion);
            }
            currentRegion.current = newRegion;
        }
    }

    useEffect(() => {
        console.log('useEffect', latitude, longitude);
        if (latitude && longitude) {
            goToCoordinate(latitude, longitude);
        }
    }, [latitude, longitude]);


    return (
        <View style={styles.view}>
            <AppleMaps.View
                ref={mapRef}
                style={styles.map}
                uiSettings={{
                    myLocationButtonEnabled: false,
                    compassEnabled: false,
                    scaleBarEnabled: true,
                    togglePitchEnabled: false
                }}
                properties={{
                    isTrafficEnabled: false,
                    mapType: AppleMapsMapType.STANDARD,
                    selectionEnabled: true,
                }}
                onCameraMove={handleCameraMove}
                markers={markers.map(m => ({
                    coordinates: { 
                        latitude: m.coordinate.latitude, longitude: m.coordinate.longitude 
                    },
                    id: m.id.toString(),
                    title: "49th Parallel Café & Lucky's Doughnuts - Main Street",
                    tintColor: "brown",
                    systemImage: "cup.and.saucer.fill",
                }))}
                
            />
            
        </View>
    );
};

export default memo(Map);

const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});