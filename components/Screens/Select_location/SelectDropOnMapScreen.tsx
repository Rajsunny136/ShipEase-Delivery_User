import config from '@/app/api-request/config';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/index';

type SelectedLocation = {
  latitude: number;
  longitude: number;
};

const SelectDropOnMapScreen = () => {
//   const navigation = useNavigation();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SelectDropOnMapScreen'>>(); // Type the navigation

  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState('Fetching location...');
  const [locationTitle, setLocationTitle] = useState('Location Title');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.GOOGLE_API_KEY}`);
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        setAddress(json.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${config.GOOGLE_API_KEY}`);
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        let foundTitle = 'Unknown Location';
        json.results.forEach((place: { name: string; types: string[] }) => {
          if (place.types.includes("sublocality") && foundTitle === 'Unknown Location') {
            foundTitle = place.name; // Prefer sublocality
          } else if (place.types.includes("administrative_area_level_2") && foundTitle === 'Unknown Location') {
            foundTitle = place.name; // Next, prefer administrative_area_level_2
          } else if (place.types.includes("locality") && foundTitle === 'Unknown Location') {
            foundTitle = place.name; // Lastly, prefer locality
          }
        });
        setLocationTitle(foundTitle);
      } else {
        setLocationTitle('Unknown Location');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get the current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set the initial region and selected location
      const initialRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(initialRegion);
      setSelectedLocation({ latitude, longitude });
      fetchAddress(latitude, longitude);
      fetchNearbyPlaces(latitude, longitude);
    };

    getLocation();
  }, []);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    setSelectedLocation({ latitude: newRegion.latitude, longitude: newRegion.longitude });
    fetchAddress(newRegion.latitude, newRegion.longitude);
    fetchNearbyPlaces(newRegion.latitude, newRegion.longitude); // Fetch nearby places on region change
  };

  const handleConfirmLocation = () => {
    console.log('Confirmed Location address:', address);
    navigation.navigate('ReceiverDetailsScreen', {
        location: {
            name: address,
            latitude: selectedLocation?.latitude || 0, // Default to 0 if null
            longitude: selectedLocation?.longitude || 0, // Default to 0 if null
        },
    }as never);
};



  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation} // Ensure selectedLocation is not null
              pinColor="red"
            />
          )}
        </MapView>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Your goods will be picked from here</Text>
        <Text style={styles.locationTitle}>{locationTitle}</Text>
        <Text style={styles.address}>{address}</Text>
        <Button title="Confirm Pickup Location" onPress={handleConfirmLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  locationTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: 'gray',
  },
  address: {
    marginBottom: 10,
  },
});

export default SelectDropOnMapScreen;
