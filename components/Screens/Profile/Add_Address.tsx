import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TextInput, RadioButton, Text } from "react-native-paper";
import { createAddress } from "../../../app/api-request/Adress_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { userCookie } from "@/app/api-request/config";
import { useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the navigation and route types
export type RootStackParamList = {
  NewAddress: undefined;
  SavedAddressesScreen: { address_id: any };
  ChooseOnMap: undefined;
};

export type NewAddressNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewAddress"
>;
export type SavedAddressesScreenRouteProp = RouteProp<
  RootStackParamList,
  "SavedAddressesScreen"
>;



const NewAddress = () => {
  const navigation = useNavigation<NewAddressNavigationProp>();
  const [houseNumber, setHouseNumber] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [type, setType] = useState<"Home" | "Work" | "Other">("Work");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("India");
  const [alternativePhoneNumber, setAlternativePhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [user_id, setUserId] = useState<number | null>(null);

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
          setUserId(user_id);
        }
      } catch (error) {
        console.error("Failed to decode token or retrieve user_id:", error);
        Alert.alert("Error", "Failed to retrieve user information.");
      }
    };

    initialize();
  }, []);

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
      console.log("Response from createAddress:", response);
      if (response && response.address) {
        Alert.alert("Success", "Address created successfully.");
        navigation.navigate("SavedAddressesScreen", {
          address_id: response.address.address_id,
        });
      } else {
        Alert.alert("Error", "Failed to create address.");
      }
    } catch (error: any) {
      console.error("Error creating address:", error.message);
      Alert.alert("Error", `Failed to create address: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TextInput
        label="House Number"
        value={houseNumber}
        onChangeText={setHouseNumber}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Apartment"
        value={apartment}
        onChangeText={setApartment}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Landmark"
        value={landmark}
        onChangeText={setLandmark}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="State"
        value={state}
        onChangeText={setState}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Zipcode"
        value={zipcode}
        onChangeText={setZipcode}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Alternative Phone Number"
        value={alternativePhoneNumber}
        onChangeText={setAlternativePhoneNumber}
        style={styles.input}
        mode="outlined"
      />
      <View style={styles.radioContainer}>
        <Text style={styles.label}>Address Type</Text>
        <RadioButton.Group
          onValueChange={(value) => setType(value as "Home" | "Work" | "Other")}
          value={type}
        >
          <View style={styles.radioOption}>
            <RadioButton value="Home" />
            <Text>Home</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Work" />
            <Text>Work</Text>
          </View>
          <View style={styles.radioOption}>
            <RadioButton value="Other" />
            <Text>Other</Text>
          </View>
        </RadioButton.Group>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.touchableButton, loading && styles.loadingButton]}
          disabled={loading} // Disable the button while loading
        >
          <Text style={styles.touchableButtonText}>
            {loading ? "Saving..." : "Save Address"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Chooseonmap" as never)}
          style={styles.touchableButton}
        >
          <Text style={styles.touchableButtonText}>Choose on Map</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const { width } = Dimensions.get("window");
// Define responsive styles
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Avoid overlap with buttons
  },
  input: {
    marginBottom: 16,
  },
  radioContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  touchableButton: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A487E7",
    borderRadius: 4,
    marginHorizontal: 4, // Space between buttons
    backgroundColor: "#fff",
  },
  touchableButtonText: {
    color: "#A487E7",
    fontWeight: "bold",
    fontSize: width < 400 ? 14 : 16, // Responsive font size
  },
  loadingButton: {
    backgroundColor: "#f0f0f0",
  },
});

export default NewAddress;
