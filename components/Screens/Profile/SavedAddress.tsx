
  import React, { useEffect, useState, useCallback } from "react";
  import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
  } from "react-native";
  import { StackNavigationProp } from "@react-navigation/stack";
  import {
    useNavigation,
    useFocusEffect,
    RouteProp,
  } from "@react-navigation/native";
  import { jwtDecode } from "jwt-decode";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { fetchAddressesByUserid } from "@/app/api-request/Adress_api";
  import { userCookie } from "@/app/api-request/config";
  import Icon from "react-native-vector-icons/MaterialIcons";
  import { RootStackParamList } from "@/app";
import { Ionicons } from "@expo/vector-icons";
  type SavedAddressesScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "SavedAddressesScreen"
  >;

  type SavedAddressesScreenProps = {
    route: RouteProp<RootStackParamList, "SavedAddressesScreen">;
  };

  interface Address {
    id: number;
    user_id: number;
    type: string;
    house_number: string;
    apartment?: string;
    landmark?: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone_number: string;
    alternative_phone_number?: string;
  }

  const SavedAddressesScreen: React.FC<SavedAddressesScreenProps> = ({
    route,
  }) => {
    const { address_id } = route.params || {};
    const navigation = useNavigation<SavedAddressesScreenNavigationProp>();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user_id, setuser_id] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
      null
    );

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
            setuser_id(user_id);
            await getAddresses(user_id);
          } else {
            setError("Failed to decode user_id.");
          }
        } catch (error: any) {
          setError("An error occurred during initialization.");
        } finally {
          setLoading(false);
        }
      };

      initialize();
    }, []);

    useFocusEffect(
      useCallback(() => {
        if (user_id !== null) {
          getAddresses(user_id);
        }
      }, [user_id])
    );

    const getAddresses = async (user_id: number) => {
      setLoading(true);
      try {
        const fetchedAddresses = await fetchAddressesByUserid(user_id);
        setAddresses(fetchedAddresses);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    };

    const handleAddAddress = () => {
      navigation.navigate("NewAddress", { address_id });
    };

    const renderItem = ({ item }: { item: Address }) => (
      <View style={styles.addressContainer}>
        <View style={styles.addressDetails}>
          <Text style={styles.addressType}>{item.type}</Text>
          <Text style={styles.addressText}>
            {item.house_number} {item.apartment ? `, ${item.apartment}` : ""}
          </Text>
          <Text style={styles.addressText}>{item.landmark}</Text>
          <Text style={styles.addressText}>
            {item.city}, {item.state} {item.zipcode}
          </Text>
          <Text style={styles.addressText}>{item.country}</Text>
          <Text style={styles.phoneText}>Phone: {item.phone_number}</Text>
          {item.alternative_phone_number && (
            <Text style={styles.phoneText}>
              Alt: {item.alternative_phone_number}
            </Text>
          )}
        </View>

        <View style={styles.actionsContainer}>
          {/* Delete Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Delete")}
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>

          {/* Share Icon */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => console.log("Share")}
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    );

    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (addresses.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>No addresses found.</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
            <Text style={styles.addButtonText}>ADD NEW ADDRESS</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={addresses}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={renderItem}
          // ListHeaderComponent={
          //   <Text style={styles.headersaveadress}>SAVED ADDRESSES</Text>
          // }
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Text style={styles.addButtonText}>ADD NEW ADDRESS</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const { width, height } = Dimensions.get("window");
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    headersaveadress: {
      fontSize: 17,
      fontWeight: "bold",
      marginBottom: 16,
      color: "#333",
    },
    addressContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
      borderRadius: 8,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    checkboxContainer: {
      marginRight: 10,
    },
    addressDetails: {
      flex: 1,
    },
    label: {
      fontWeight: "bold",
    },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 10,
    },
    button: {
      marginRight: 10,
      color: "orange",
    },
    addButton: {
      marginTop: 16,
      padding: 16,
      backgroundColor: "#A487E7",
      borderRadius: 4,
      alignItems: "center",
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
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
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyMessage: {
      fontSize: 18,
      marginBottom: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorMessage: {
      fontSize: 16,
      color: "red",
    },
    errorText: {
      color: "red",
      textAlign: "center",
      marginTop: 20,
    },
    addressType: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
      marginBottom: 4,
    },
    addressText: {
      fontSize: 14,
      color: "#666",
      marginBottom: 2,
    },
    phoneText: {
      fontSize: 14,
      color: "#007AFF",
      marginTop: 8,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconButton: {
      marginLeft: 12,
      padding: 8,
      backgroundColor: "#F2F2F2",
      borderRadius: 50,
    },
  });

  export default SavedAddressesScreen;
