import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, NavigationProp, RouteProp } from '@react-navigation/native';
import { createSenderDetails } from '@/app/api-request/sender_details_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie } from "@/app/api-request/config";
import { RootStackParamList } from '@/app/index';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { jwtDecode } from 'jwt-decode';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper';


type SenderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'SenderDetailsScreen'>;
type PickupDropScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PickupDropScreen'>;

const SenderDetailsScreen = () => {
    const route = useRoute<SenderDetailsScreenRouteProp>();
    const navigation = useNavigation<PickupDropScreenNavigationProp>();
    const { location } = route.params;

    const [senderName, setSenderName] = useState('');
    const [senderMobile, setSenderMobile] = useState('');
    const [locationType, setLocationType] = useState('Home');
    const [user_id, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleConfirm = async () => {
        if (!senderName || !senderMobile) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }
    
        setLoading(true);
    
        const postData = {
            sender_name: senderName,
            mobile_number: senderMobile,
            user_id: user_id,
            address: location.name,
            address_type: locationType,
        };
    
        console.log("Sender data:", postData);
    
        try {
            const response = await createSenderDetails(postData);
    
            if (response.error) {
                // Handle API error
                console.error('API Error:', response.error);
                Alert.alert('Error', response.error);
            } else if (response.data) {
                // Ensure response.data exists
                const { sender_name, address, mobile_number } = response.data;
                console.log(`Sender details submitted successfully: ${sender_name}, ${address}, ${mobile_number}`);
                setLoading(false);
                navigation.navigate('PickupDropScreen', { name: sender_name, address: location, phone: mobile_number });
            } else {
                // Handle unexpected empty response
                console.error('Unexpected empty response:', response);
                Alert.alert('Error', 'Unexpected error occurred. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting sender details:', error);
            Alert.alert('Error', 'Failed to submit details. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    
    const handleChangeLocation = () => {
        navigation.navigate('SelectPickupLocation' as never);
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

                {/* Input for Sender's Name */}
                <TextInput
                    label="Sender's Name"
                    mode="outlined"
                    value={senderName}
                    onChangeText={setSenderName}
                    style={styles.input}
                />

                {/* Input for Sender's Mobile Number */}
                <TextInput
                    label="Sender's Mobile Number"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={senderMobile}
                    onChangeText={setSenderMobile}
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

export default SenderDetailsScreen;
