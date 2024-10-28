import React, { useRef, useState } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'; // For current location
import Icon from 'react-native-vector-icons/MaterialIcons'; // Use icons
import config from '@/app/api-request/config';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/index';
import axios from 'axios';

// Define a type for pickup location
type PickupLocation = {
    name: string;
    latitude: number;
    longitude: number;
} | null;

const SelectPickupLocation = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SelectPickupOnMapScreen'>>(); // Type the navigation
    const googlePlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null); // Ref for GooglePlacesAutocomplete

    const [pickupLocation, setPickupLocation] = useState<PickupLocation>(null);

    // Function to get current location
    const getCurrentLocation = async () => {
        try {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location access is required.");
                return;
            }
    
            // Get current coordinates (latitude & longitude)
            const { coords } = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = coords;
    
            // Make a request to Google Geocoding API with the current coordinates
            const googleGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.GOOGLE_API_KEY}`;
    
            const response = await axios.get(googleGeocodingUrl);
            const results = response.data.results;
    
            if (results && results.length > 0) {
                const detailedAddress = results[0].formatted_address;  // Get the detailed address
    
                // Programmatically update the input field in GooglePlacesAutocomplete
                googlePlacesRef.current?.setAddressText(detailedAddress);
    
                const currentLocation = {
                    name: detailedAddress,
                    latitude,
                    longitude,
                };
    
                setPickupLocation(currentLocation);  // Store current location with detailed address
    
                // Navigate to the next screen with the current location data
                navigation.navigate('SenderDetailsScreen', { location: currentLocation});
            } else {
                Alert.alert("Error", "Failed to fetch a detailed address.");
            }
        } catch (error) {
            console.error("Error fetching current location:", error);
            Alert.alert("Error", "Failed to get current location.");
        }
    };
    const handlePlaceSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (details && details.geometry) {
            const { lat, lng } = details.geometry.location;
            const selectedLocation = {
                name: data.description,
                latitude: lat,
                longitude: lng,
            };
            setPickupLocation(selectedLocation);
            // Navigate to next screen with selected location data
            navigation.navigate('SenderDetailsScreen', { location: selectedLocation });
        } else {
            Alert.alert('Error', 'Unable to fetch location details');
        }
    };

    return (
        <View style={styles.container}>
            {/* Google Places Autocomplete */}
            <GooglePlacesAutocomplete
                ref={googlePlacesRef} // Assign ref
                placeholder="Enter pickup location"
                fetchDetails={true}
                onPress={handlePlaceSelect}
                query={{
                    key: config.GOOGLE_API_KEY, // Use the imported API key here
                    language: 'en',
                }}
                styles={{
                    textInput: styles.textInput,
                    container: styles.autocompleteContainer,
                }}
            />
            {/* Group of Buttons at the Bottom */}
            <View style={styles.buttonGroup}>
                {/* Button for Current Location */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#4CAF50' }]} // Green button
                    onPress={getCurrentLocation}
                >
                    <Icon name="my-location" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Current Location</Text>
                </TouchableOpacity>

                {/* Button for Locate on Map */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#2196F3' }]} // Blue button
                    onPress={() => navigation.navigate('SelectPickupOnMapScreen' as never)}>
                    <Icon name="location-on" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Locate on Map</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
// Add your styles here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    autocompleteContainer: {
        flex: 1,
        width: '100%',
        zIndex: 1, // Make sure autocomplete appears on top of everything
    },
    textInput: {
        fontSize: 16,
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
    },
    buttonGroup: {
        flexDirection: 'row', // Align buttons side by side
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        marginLeft: 8, // Space between icon and text
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SelectPickupLocation;
