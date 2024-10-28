import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/app";
import { fetchVehiclePrices } from "@/app/api-request/sender_details_api";
import Ionicons from "react-native-vector-icons/Ionicons";

type VehicleSelectionScreenRouteProp = RouteProp<
  RootStackParamList,
  "VehicleSelectionScreen"
>;

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "VehicleSelectionScreen"
>;

interface Vehicle {
  id: number;
  vehicleName: string;
  capacity: string;
  baseFare: number;
  ratePerKm: number;
  distance: number;
  totalPrice: string;
  estimatedTime: string;
  image: string;
}

const VehicleSelectionScreen: React.FC = () => {
  const route = useRoute<VehicleSelectionScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const {
    receiver_name,
    receiver_address,
    receiver_phone,
    name,
    location,
    address,
    phone,
  } = route.params;

  const [distance, setDistance] = useState<number | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // State for selected vehicle


  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Calculate distance and fetch vehicle prices
  useEffect(() => {
    if (
      location &&
      typeof location === "object" &&
      address &&
      typeof address === "object"
    ) {
      const { latitude: lat1, longitude: lon1 } = location;
      const { latitude: lat2, longitude: lon2 } = address;

      const calculatedDistance = calculateDistance(lat1, lon1, lat2, lon2);
      setDistance(calculatedDistance);

      console.log(
        `Distance between sender and receiver: ${calculatedDistance.toFixed(
          2
        )} km`
      );

      // Fetch vehicle prices based on the calculated distance
      const fetchPrices = async () => {
        try {
          const vehicleData = await fetchVehiclePrices(calculatedDistance);

          if (Array.isArray(vehicleData)) {
            setVehicles(vehicleData);
          } else {
            console.warn("Vehicle data is not an array:", vehicleData);
            setVehicles([]);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching vehicle prices", error);
          Alert.alert("Error", "Failed to fetch vehicle prices. Please try again.");
          setLoading(false);
        }
      };

      fetchPrices();
    } else {
      Alert.alert("Error", "Location or address data is missing.");
    }
  }, [location, address]);

  const handleConfirm = () => {
    if (selectedVehicle) {
      // Navigate to BookingSummaryScreen with vehicle ID and total price
      navigation.navigate(
        "BookingSummaryScreen",
        {  vehicleId: selectedVehicle.id,
          totalPrice: selectedVehicle.totalPrice,
          vehicleName: selectedVehicle.vehicleName, // Pass vehicle name
          vehicleImage: selectedVehicle.image, // Pass vehicle image URL
          receiver_name, // passing additional params
          receiver_address,
          receiver_phone,
          name,
          location,
          address,
          phone,
        } as never
      );

    } else {
      Alert.alert("Error", "Please select a vehicle before proceeding.");
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
    {/* Sender and Receiver Details */}
    <View style={styles.cardWrapper}>
      {/* Sender Details */}
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="ellipse" size={12} color="green" />
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.nameText}>
            {name} · {phone}
          </Text>
          <Text style={styles.addressText}>
            {address?.name || "Not Available"}
          </Text>
        </View>
      </View>

      {/* Receiver Details */}
      <View style={styles.cardContainer}>
        <View style={styles.iconContainer}>
          <View style={styles.dottedLine} />
          <Ionicons name="location-sharp" size={12} color="red" />
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.nameText}>
            {receiver_name} · {receiver_phone}
          </Text>
          <Text style={styles.addressText}>{receiver_address}</Text>
        </View>
      </View>

      {/* Add/Edit Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={16} color="rgb(122, 115, 150)" />
          <Text style={styles.actionText}>EDIT LOCATIONS</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Vehicle Selection */}
    {vehicles.length > 0 ? (
      vehicles.map((vehicle, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.vehicleCard,
            selectedVehicle?.id === vehicle.id && styles.selectedVehicleCard, // Highlight selected vehicle
          ]}
          onPress={() => handleVehicleSelect(vehicle)}
        >
          <View style={styles.vehicleRow}>
            {vehicle.image && vehicle.image ? (
              <Image
                source={{ uri: vehicle.image }}
                style={styles.vehicleImage}
                resizeMode="contain"
              />
            ) : (
              <Text>No Image Available</Text>
            )}

            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleName}>{vehicle.vehicleName}</Text>
              <Text style={styles.vehicleInfo}>
                {vehicle.capacity} • {vehicle.estimatedTime}
              </Text>
            </View>
            <Text style={styles.vehiclePrice}>₹{vehicle.totalPrice}</Text>
          </View>
        </TouchableOpacity>
      ))
    ) : (
      <Text>No vehicles available</Text>
    )}

    <TouchableOpacity onPress={handleConfirm} style={styles.proceedButton}>
      <Text style={styles.proceedButtonText}>Proceed</Text>
    </TouchableOpacity>
  </ScrollView>
);
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 13,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleImage: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  vehicleInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  vehiclePrice: {
    fontSize: 17,
    fontWeight: "500",
    color: "#000",
    marginTop: 8,
  },
  proceedButton: {
    backgroundColor: "#A487E7",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 116,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  dottedLine: {
    height: 20,
    borderLeftWidth: 1,
    borderLeftColor: "gray",
    borderStyle: "dotted",
    marginVertical: 5,
  },
  detailContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 14,
    color: "#666",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft:5,
    color: "#A487E7",
  },
  selectedVehicleCard: {
    borderColor: "blue", // Change border color of the selected card
    backgroundColor: "#e7defc", // Add background color to the selected card
  },
});

export default VehicleSelectionScreen;
