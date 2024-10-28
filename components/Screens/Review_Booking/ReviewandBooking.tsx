import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Card, Divider, Modal } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons for icons
import { useRoute, RouteProp,useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import { createBooking } from "@/app/api-request/confirmBooking_api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userCookie } from "@/app/api-request/config";
import { jwtDecode } from "jwt-decode";
import { StackNavigationProp } from "@react-navigation/stack";

type BookingSummaryScreenRouteProp = RouteProp<
  RootStackParamList,
  "BookingSummaryScreen"
>;

// Define the type of navigation prop
type BookingSummaryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "BookingSummaryScreen"
>;

const BookingSummaryScreen = () => {
  const route = useRoute<BookingSummaryScreenRouteProp>();
  const navigation = useNavigation<BookingSummaryScreenNavigationProp>();

  // Destructure the route params
  const {
    vehicleId,
    totalPrice,
    vehicleName, // Receive vehicle name
    vehicleImage, // Receive vehicle image URL
    receiver_name,
    receiver_address,
    receiver_phone,
    name,
    location,
    address,
    phone,
  } = route.params;

  const [goodsType, setGoodsType] = useState("General • Loose");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAddressModalVisible, setAddressModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  

  const userDetails = async () => {
    try {
      const token = await AsyncStorage.getItem(userCookie);
      if (!token) throw new Error("Token not found in AsyncStorage");
      const decodedToken: any = jwtDecode(token);
      const user_id = decodedToken.id;
      console.log("User_id is ", user_id);
      setUserId(user_id);
    } catch (error) {
      console.error("Failed to decode token or retrieve user info:", error);
      Alert.alert("Error", "Failed to retrieve user information.");
    }
  };
  useEffect(() => {
    // Fetch user details when the component mounts
    userDetails();
  }, []);

    // Function to generate a random 4-digit OTP
    const generateOTP = () => {
      return Math.floor(1000 + Math.random() * 9000).toString(); // Generate a random number between 1000 and 9999
    };

 const handleBooking = async () => {
  const otp = generateOTP();
   const bookingData = {
     user_id: userId,
     vehicle_id: vehicleId,
     pickup_address: address.name,
     dropoff_address: receiver_address,
     goods_type: goodsType,
     total_price: totalPrice,
     sender_name: name,
     sender_phone: phone,
     receiver_name: receiver_name,
     receiver_phone: receiver_phone,
     vehicle_name: vehicleName,
     vehicle_image: vehicleImage,
     status: "pending",
   };

   console.log("Booking data", bookingData);

   try {
     const result = await createBooking(bookingData);
     console.log("Booking creation result:", result);

     // Accessing the booking id correctly
     const bookingId = result.data.id; // Get the booking ID from the response

     if (result && bookingId) {
      //  Alert.alert(
      //    "Booking Confirmed!",
      //    "Your booking has been successfully made."
      //  );
       console.log("Navigating to SearchingForDriverScreen with params:", {
         bookingId: bookingId.toString(),
         address,
         location,
         totalPrice,
         vehicleName,
         sender_name: name,
         sender_phone: phone,
         receiver_name: receiver_name,
         receiver_phone: receiver_phone,
         otp:otp,
       });
       navigation.navigate("SearchingForDriverScreen", {
         bookingId: bookingId.toString(),
         address,
         location,
         totalPrice,
         vehicleName,
         sender_name: name,
         sender_phone: phone,
         receiver_name: receiver_name,
         receiver_phone: receiver_phone,
         otp:otp,
       });
     } else {
       Alert.alert("Booking Failed", result.message || "Something went wrong.");
     }
   } catch (error) {
     console.error("Error submitting booking:", error);
     Alert.alert("Booking Failed", "Unable to process your booking.");
   }
 };



  const handleViewAddressDetails = () => {
    setAddressModalVisible(true);
  };
  // Function to handle changing goods type
  const handleChangeGoodsType = (type: string) => {
    setGoodsType(type);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Vehicle Information */}
        <Card style={styles.card}>
          <View style={styles.vehicleInfo}>
          <Image
              style={styles.iconImage}
              source={{ uri: vehicleImage }} // Use the vehicle image from params
            />
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleTitle}>{vehicleName}</Text>
              <TouchableOpacity onPress={handleViewAddressDetails}>
                <Text style={styles.linkText}>View Address Details</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.vehicleTime}>1 min away</Text>
          </View>
          <Text style={styles.loadingTime}>
            Free 25 mins of loading-unloading time included.
          </Text>
        </Card>

        {/* Offers and Discounts */}
        <Card style={styles.card}>
          <View style={styles.offers}>
            <Ionicons name="pricetag" size={24} color="#4CAF50" />
            <View style={styles.offerDetails}>
              <Text style={styles.offerText}>
                You saved <Text style={styles.savings}>₹15</Text> with 15OFF
              </Text>
              <Text style={styles.couponText}>Coupon Applied</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Offer removed!")}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Fare Summary */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Fare Summary</Text>
          <View style={styles.fareItem}>
            <Text>Trip Fare (incl. Toll)</Text>
            <Text>₹{totalPrice}</Text>
          </View>
          <View style={styles.fareItem}>
            <Text>Coupon Discount - 15OFF</Text>
            <Text style={styles.discount}>-₹15</Text>
          </View>
          <Divider />
          <View style={styles.fareItem}>
            <Text>Net Fare</Text>
            <Text>₹{totalPrice}</Text>
          </View>
          <View style={styles.fareItem}>
            <Text>Amount Payable (rounded)</Text>
            <Text>₹{totalPrice}</Text>
          </View>
        </Card>

        {/* Goods Type */}
        <Card style={styles.card}>
          <View style={styles.goodsType}>
            <Text style={styles.goodsLabel}>Goods Type</Text>
            <Text>{goodsType}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.linkText}>Change</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Payment Method */}
        <View style={styles.paymentContainer}>
          <View style={styles.paymentMethod}>
            <Ionicons name="cash" size={24} color="#000" />
            <Text style={styles.paymentText}>{totalPrice}</Text>
          </View>
          <View style={styles.paymentAmount}>
            <Text>₹{totalPrice}</Text>
            <Text style={styles.viewBreakup}>View Breakup</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Book Button at the bottom */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Confirm Booking</Text>
      </TouchableOpacity>

      {/* Modal for Changing Goods Type */}
      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.modal}
      >
        <Text style={styles.modalTitle}>Select Goods Type</Text>
        {["General • Loose", "Fragile", "Heavy", "Perishable"].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => handleChangeGoodsType(type)}
          >
            <Text style={styles.modalOption}>{type}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.modalCloseButton}
        >
          <Text style={styles.linkText}>Close</Text>
        </TouchableOpacity>
      </Modal>
         {/* Modal for Address Details */}
      <Modal
        visible={isAddressModalVisible}
        onDismiss={() => setAddressModalVisible(false)}
        contentContainerStyle={styles.modal}
      >
        
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

          <TouchableOpacity
            onPress={() => setAddressModalVisible(false)}
            style={styles.modalCloseButton}
          >
            <Text style={styles.linkText}>Close</Text>
          </TouchableOpacity>
        
      </Modal>

    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    padding: width * 0.04, // 4% of the screen width
    paddingBottom: height * 0.1, // Extra padding at the bottom for button
  },
  card: {
    marginBottom: height * 0.02, // 2% of the screen height
    padding: width * 0.04, // 4% of the screen width
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  vehicleInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleDetails: {
    marginLeft: width * 0.04, // 4% of the screen width
    flex: 1,
  },
  vehicleTitle: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Responsive font size
  },
  vehicleTime: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
  linkText: {
    color: "#1E88E5",
  },
  loadingTime: {
    color: "#888",
    marginTop: height * 0.01, // 1% of the screen height
  },
  offers: {
    flexDirection: "row",
    alignItems: "center",
  },
  offerDetails: {
    marginLeft: width * 0.04, // 4% of the screen width
    flex: 1,
  },
  offerText: {
    fontWeight: "bold",
    fontSize: width * 0.045, // Slightly smaller font size for offers
  },
  savings: {
    color: "#4CAF50",
  },
  couponText: {
    color: "#888",
  },
  removeText: {
    color: "#F44336",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: height * 0.01, // 1% of the screen height
    fontSize: width * 0.045, // Responsive font size
  },
  fareItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.01, // 1% of the screen height
  },
  discount: {
    color: "#4CAF50",
  },
  goodsType: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goodsLabel: {
    fontWeight: "bold",
  },
  paymentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: height * 0.02, // 2% of the screen height
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    marginLeft: width * 0.02, // 2% of the screen width
    fontSize: width * 0.045, // Responsive font size
    fontWeight: "bold",
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  viewBreakup: {
    color: "#1E88E5",
  },
  bookButton: {
    position: "absolute",
    bottom: height * 0.02, // 2% from the bottom of the screen
    left: 0,
    right: 0,
    paddingVertical: height * 0.015, // 1.5% of the screen height
    backgroundColor: "#A487E7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: width * 0.04, // 4% of the screen width on both sides
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modal: {
    backgroundColor: "white",
    padding: width * 0.04, // 4% of the screen width
    borderRadius: 10,
    margin: width * 0.04, // 4% of the screen width
    elevation: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: width * 0.05, // Responsive font size
    marginBottom: height * 0.02, // 2% of the screen height
  },
  modalOption: {
    paddingVertical: height * 0.01, // 1% of the screen height
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    marginTop: height * 0.02, // 2% of the screen height
    alignItems: "center",
  },
  iconImage: {
    width:50,
    height: 50,
    // resizeMode: "cover",
    // tintColor: "#A487E7",
    // marginHorizontal: width * 0.02,
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
});

export default BookingSummaryScreen;