import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { createReceiverDetails } from '@/app/api-request/sender_details_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie } from "@/app/api-request/config";
import { RootStackParamList } from '@/app/index';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { jwtDecode } from 'jwt-decode';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper'; // Import TextInput from react-native-paper

type ReceiverDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ReceiverDetailsScreen'>;
type PickupDropScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PickupDropScreen'>;

const ReceiverDetailsScreen = () => {
    const route = useRoute<ReceiverDetailsScreenRouteProp>();
    const navigation = useNavigation<PickupDropScreenNavigationProp>();
    const { location } = route.params;
    const name = route?.params?.name || "Unknown";
    const address = route?.params?.address || "Fetching current location...";
    const phone = route?.params?.phone || "Unknown";
    console.log("Params data",address);

    console.log("Location", location);
    const [receiverName, setReceiverName] = useState('');
    const [receiverMobile, setReceiverMobile] = useState('');
    const [locationType, setLocationType] = useState('Home');
    const [user_id, setUserId] = useState<string | null>(null);
    const [distance, setDistance] = useState<number | null>(null); // State to store distance


    // Fetch the user_id from AsyncStorage on component mount
    useEffect(() => {
        const initialize = async () => {
            try {
                const token = await AsyncStorage.getItem(userCookie);
                if (!token) {
                    throw new Error('Token not found in AsyncStorage');
                }

                const decodedToken: any = jwtDecode(token);
                const user_id = decodedToken.id;

                if (user_id) {
                    setUserId(user_id);
                    console.log(`user_id successfully retrieved: ${user_id}`);
                }
            } catch (error) {
                console.error('Failed to retrieve user_id:', error);
                Alert.alert('Error', 'Failed to retrieve user information.');
            }
        };

        initialize();
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    // Calculate distance when component mounts
    useEffect(() => {
        if (location && address) {
            const { latitude: lat1, longitude: lon1 } = location;

            // Ensure that address has latitude and longitude, not just a string
            if (typeof address === 'object' && 'latitude' in address && 'longitude' in address) {
                const { latitude: lat2, longitude: lon2 } = address;

                const calculatedDistance = calculateDistance(lat1, lon1, lat2, lon2);
                setDistance(calculatedDistance);
                console.log(`Distance between location and address: ${calculatedDistance.toFixed(2)} km`);
            } else {
                console.error('Address does not contain latitude and longitude');
                Alert.alert('Error', 'Address data is missing latitude and longitude.');
            }
        }
    }, [location, address]);

    // Handle form submission and post data to the backend
    const handleConfirm = async () => {
        if (!receiverName || !receiverMobile) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        const postData = {
            receiver_name: receiverName,
            receiver_phone_number: receiverMobile,
            user_id: user_id,
            address: location.name,
            address_type: locationType,
        };
        console.log("senderdata", postData);

        try {
            const response = await createReceiverDetails(postData); // Call the API
            console.log('Response from createSenderDetails:', response);

            // Assuming your API returns the data like this
            const receiver_name = response.data.receiver_name;
           const receiver_address = response.data.address;
            const receiver_phone = response.data.receiver_phone_number;
            console.log(`Receiver details submitted successfully: ${receiver_name}, ${location}, ${receiver_phone}`);
            console.log("location",location)
            if (response.error) {
                Alert.alert('Error', response.error);
            } else {
                navigation.navigate(
                    "VehicleSelectionScreen",
                    {name,address,phone,
                      receiver_name: receiver_name,
                      receiver_address: receiver_address,
                      receiver_phone: receiver_phone,
                      location
                    } as never
                  );}
        } catch (error) {
            console.error('Error submitting sender details:', error);
            Alert.alert('Error', 'Failed to submit details. Please try again.');
        }
    };

    const handleChangeLocation = () => {
        navigation.navigate('SelectDropOnMapScreen' as never);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Marker coordinate={location} />
            </MapView>

            <View style={styles.detailsContainer}>
                <View style={styles.locationRow}>
                    <Icon name="location-on" size={24} color="green" />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationTitle}>{location.name || 'Selected Location'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleChangeLocation}>
                        <Text style={styles.changeButton}>Change</Text>
                    </TouchableOpacity>
                </View>

                {/* Input for Receiver's Name */}
                <TextInput
                    label="Receiver's Name"
                    mode="outlined"
                    value={receiverName}
                    onChangeText={setReceiverName}
                    style={styles.input}
                />

                {/* Input for Receiver's Mobile Number */}
                <TextInput
                    label="Receiver's Mobile Number"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={receiverMobile}
                    onChangeText={setReceiverMobile}
                    style={styles.input}
                />

                <Text style={styles.saveAsText}>Save as (optional):</Text>
                <View style={styles.locationTypeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Home' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Home')}
                    >
                        <Icon name="home" size={24} color={locationType === 'Home' ? '#fff' : '#000'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Home' && styles.selectedText,
                            ]}
                        >
                            Home
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Shop' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Shop')}
                    >
                        <Icon name="store" size={24} color={locationType === 'Shop' ? '#fff' : '#000'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Shop' && styles.selectedText,
                            ]}
                        >
                            Shop
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Other' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Other')}
                    >
                        <Icon name="favorite" size={24} color={locationType === 'Other' ? '#fff' : '#000'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Other' && styles.selectedText,
                            ]}
                        >
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm And Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Add your styles here
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        height: '40%',
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '60%',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    locationTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    locationTitle: {
        fontSize: 15,
        fontWeight: '400',
    },
    locationSubtitle: {
        color: '#888',
    },
    changeButton: {
        color: '#2196F3',
        fontWeight: '600',
    },
    input: {
        marginVertical: 8,
    },
    saveAsText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    locationTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 16,
    },
    locationTypeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        width: '30%',
        justifyContent: 'center',
    },
    locationTypeText: {
        marginLeft: 8,
    },
    selectedButton: {
        backgroundColor: '#2196F3',
    },
    selectedText: {
        color: '#fff',
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ReceiverDetailsScreen;
