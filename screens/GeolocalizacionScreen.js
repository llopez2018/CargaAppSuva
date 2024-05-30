import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

function GeolocalizacionScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={region => setRegion(region)}
            >
                {location && (
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }}
                        title={"Tu Ubicación"}
                    />
                )}
            </MapView>
            <Button title="Actualizar Ubicación" onPress={() => navigation.push('Geolocalizacion')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default GeolocalizacionScreen;
