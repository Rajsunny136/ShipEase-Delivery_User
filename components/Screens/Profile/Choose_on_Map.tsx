import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import Geocoder from "react-native-geocoding";
import { TextInput, Button, RadioButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import config from "@/app/api-request/config";
import { createAddress } from "@/app/api-request/Adress_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { userCookie } from "@/app/api-request/config";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import Icon from "react-native-vector-icons/MaterialIcons";

type NewAddressScreenRouteProp = RouteProp<RootStackParamList, "Chooseonmap">;

type LiveScreenProps = {
    route: NewAddressScreenRouteProp;
    navigation: any;
};

const Chooseonmap: React.FC<LiveScreenProps> = ({ route, navigation }) => {
    const [region, setRegion] = useState({
        latitude: 17.385044,
        longitude: 78.486671,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [address, setAddress] = useState("");
    const [markerCoordinates, setMarkerCoordinates] = useState({
        latitude: 17.385044,
        longitude: 78.486671,
    });

    // Modal and input state
    const [modalVisible, setModalVisible] = useState(false);
    const [houseNumber, setHouseNumber] = useState("");
    const [apartment, setApartment] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [country, setCountry] = useState("");
    const [alternativePhoneNumber, setAlternativePhoneNumber] = useState("");
    const [type, setType] = useState<string>("Home");
    const [loading, setLoading] = useState(false);
    const [user_id, setuser_id] = useState<number | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const token = await AsyncStorage.getItem(userCookie);
                if (!token) {
                    throw new Error("Token not found in AsyncStorage");
                }

                const decodedToken: any = jwtDecode(token);
                const user_id = decodedToken.id;

                if (user_id) {
                    console.log(`user_id successfully decoded: ${user_id}`);
                    setuser_id(user_id);
                }
            } catch (error) {
                console.error("Failed to decode token or retrieve user_id:", error);
                Alert.alert("Error", "Failed to retrieve user information.");
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        Geocoder.init(config.GOOGLE_API_KEY);
        fetchAddress(markerCoordinates.latitude, markerCoordinates.longitude);
    }, [markerCoordinates]);

    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const result = await Geocoder.from(lat, lng);
            const addressComponent = result.results[0].formatted_address;
            setAddress(addressComponent);

            const addressDetails = result.results[0].address_components;
            // Parsing the address details
            setCity(
                addressDetails.find((comp) => comp.types.includes("locality"))
                    ?.long_name || ""
            );
            setState(
                addressDetails.find((comp) =>
                    comp.types.includes("administrative_area_level_1")
                )?.long_name || ""
            );
            setCountry(
                addressDetails.find((comp) => comp.types.includes("country"))
                    ?.long_name || ""
            );
            setZipcode(
                addressDetails.find((comp) => comp.types.includes("postal_code"))
                    ?.long_name || ""
            );
        } catch (error) {
            console.error(error);
        }
    };

    const onMapPress = (event: MapPressEvent) => {
        const coordinate = event.nativeEvent.coordinate;
        setMarkerCoordinates(coordinate);
        fetchAddress(coordinate.latitude, coordinate.longitude);
        setModalVisible(true); // Show the modal when a marker is set
    };

    const handleSave = async () => {
        if (!houseNumber || !type || !city || !state || !zipcode) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        if (user_id === null) {
            Alert.alert("Error", "User ID not available.");
            return;
        }

        setLoading(true);

        const data = {
            house_number: houseNumber,
            apartment: apartment,
            landmark: landmark,
            type: type,
            user_id: user_id,
            city: city,
            state: state,
            zipcode: zipcode,
            country: country,
            alternative_phone_number: alternativePhoneNumber,
        };

        try {
            const response = await createAddress(data);
            //   console.log("Response from createAddress:", response);

            // Extracting the address_id from the response
            if (response && response.address && response.address.address_id) {
                const address_id = response.address.address_id;
                console.log("address_id:", address_id);
                Alert.alert("Success", "Address created successfully.");

                // Clear input fields
                setHouseNumber("");
                setApartment("");
                setLandmark("");
                setCity("");
                setState("");
                setZipcode("");
                setCountry("");
                setAlternativePhoneNumber("");
                setType("Home");

                navigation.navigate("SavedAddressesScreen", { address_id });
            } else {
                Alert.alert("Error", "Failed to create address.");
            }
        } catch (error: any) {
            console.error("Error creating address:", error.message);
            Alert.alert("Error", `Failed to create address: ${error.message}`);
        } finally {
            setLoading(false);
        }
        setModalVisible(false);
    };

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            console.error("Permission to access location was denied");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setRegion({
            ...region,
            latitude,
            longitude,
        });
        setMarkerCoordinates({ latitude, longitude });
        fetchAddress(latitude, longitude);
    };

    return (
        <>
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={region}
                    region={region}
                    onPress={onMapPress} // Map remains interactive
                >
                    <Marker coordinate={markerCoordinates} />
                </MapView>
                <TouchableOpacity
                    style={styles.locationIcon}
                    onPress={getCurrentLocation}
                >
                    <MaterialIcons name="my-location" size={30} color="black" />
                </TouchableOpacity>
                <View style={styles.addressContainer}>
                    <Text style={styles.addressText}>
                        Latitude: {markerCoordinates.latitude}
                    </Text>
                    <Text style={styles.addressText}>
                        Longitude: {markerCoordinates.longitude}
                    </Text>
                    <Text style={styles.addressText}>Address: {address}</Text>
                </View>

                {/* Modal positioned at the bottom without blocking the map */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            <TextInput
                                label="House Number"
                                value={houseNumber}
                                onChangeText={setHouseNumber}
                                style={styles.input}
                            />
                            <TextInput
                                label="Apartment"
                                value={apartment}
                                onChangeText={setApartment}
                                style={styles.input}
                            />
                            <TextInput
                                label="Landmark"
                                value={landmark}
                                onChangeText={setLandmark}
                                style={styles.input}
                            />
                            <TextInput
                                label="City"
                                value={city}
                                onChangeText={setCity}
                                style={styles.input}
                            />
                            <TextInput
                                label="State"
                                value={state}
                                onChangeText={setState}
                                style={styles.input}
                            />
                            <TextInput
                                label="Zipcode"
                                value={zipcode}
                                onChangeText={setZipcode}
                                style={styles.input}
                            />
                            <TextInput
                                label="Country"
                                value={country}
                                onChangeText={setCountry}
                                style={styles.input}
                            />
                            <TextInput
                                label="Alternative Phone Number"
                                value={alternativePhoneNumber}
                                onChangeText={setAlternativePhoneNumber}
                                style={styles.input}
                            />
                            <Text>Type:</Text>
                            <RadioButton.Group onValueChange={setType} value={type}>
                                <View style={styles.radioGroup}>
                                    <RadioButton value="Home" />
                                    <Text>Home</Text>
                                </View>
                                <View style={styles.radioGroup}>
                                    <RadioButton value="Work" />
                                    <Text>Work</Text>
                                </View>
                                <View style={styles.radioGroup}>
                                    <RadioButton value="Other" />
                                    <Text>Other</Text>
                                </View>
                            </RadioButton.Group>
                            <Button
                                mode="contained"
                                onPress={handleSave}
                                loading={loading}
                                style={styles.saveButton}
                            >
                                Save Address
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </>
    );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: width * 0.03, // Responsive padding
        backgroundColor: "#37474F",
    },
    headerTitle: {
        fontSize: width * 0.05, // 5% of screen width
        fontWeight: "bold",
        color: "#d5d8dc",
        marginLeft: width * 0.03, // Responsive margin
    },
    container: {
        flex: 1,
        position: "relative",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    locationIcon: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#fff",
        borderRadius: 30,
        padding: 10,
        elevation: 5,
    },
    addressContainer: {
        position: "absolute",
        bottom: 80,
        margin: 10,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        elevation: 3,
        width:"95%",
        overflow: "hidden"

    },
    addressText: {
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        // backgroundColor: "rgba(0, 0, 0, 0.5)",

        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    input: {
        marginBottom: 15,
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: "#37474F",
    },
    cancelButton: {
        marginTop: 10,
    },
    radioGroup: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
});

export default Chooseonmap;
