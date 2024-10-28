import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";
import config from "@/app/api-request/config";
import { RootStackParamList } from "@/app";
import { StackNavigationProp } from "@react-navigation/stack";

type LocationType = {
  latitude: number;
  longitude: number;
  name?: string;
};
type totalPrice = { totalPrice: any};
type status = {
  bookingId: string;
  driverId: number;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  drivername: string;
  phone: string;
};

type RideStartScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RideStartScreen"
>;
type RideStartScreenRouteProp = RouteProp<RootStackParamList, "RideStartScreen">;

const GOOGLE_MAPS_API_KEY = config.GOOGLE_API_KEY;

const RideStartScreen = () => {
  const route = useRoute<RideStartScreenRouteProp>();
  const navigation = useNavigation<RideStartScreenNavigationProp>();
  const { location,totalPrice,status } = route.params; // Drop-off location from params
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);

  const getDirections = async (startLoc: LocationType, destinationLoc: LocationType) => {
    const start = `${startLoc.latitude},${startLoc.longitude}`;
    const destination = `${destinationLoc.latitude},${destinationLoc.longitude}`;
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes?.length > 0 && response.data.routes[0].overview_polyline) {
        const points = decodePolyline(response.data.routes[0].overview_polyline.points);
        setRouteCoordinates(points);
      } else {
        console.error("No routes found or overview_polyline missing");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const decodePolyline = (t: string) => {
    let points: Array<{ latitude: number; longitude: number }> = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  useEffect(() => {
    const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setUserLocation(newLocation);
          const newCoords = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          getDirections(newCoords, {
            latitude: location.latitude,
            longitude: location.longitude,
          });
        }
      );

      return () => subscription.remove(); // Clean up
    };

    startLocationTracking();
  }, []);

  const handleDropLocationReached = () => {
    Alert.alert("Drop Location Reached", "You have reached the drop location.");
    navigation.navigate("PaymentScreen", {
        totalPrice,
        status,
    });
  };

  if (!userLocation) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          }}
          title="Your Location"
        />

        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />

        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000"
          strokeWidth={3}
        />
      </MapView>

      <TouchableOpacity style={styles.buttonEnd} onPress={handleDropLocationReached}>
        <Text style={styles.buttonText}>End Ride</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonEnd: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#A487E7",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18 },
});

export default RideStartScreen;
