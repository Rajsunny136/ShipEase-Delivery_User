import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator, Linking } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";

type PaymentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "PaymentScreen"
>;
type PaymentScreenRouteProp = RouteProp<RootStackParamList, "PaymentScreen">;

const PaymentScreen = () => {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { status, totalPrice } = route.params;
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // You might want to set it to false initially

  const handleConfirmPayment = () => {
    const paymentUrl = selectedPayment === "phonepe"
      ? `phonepe://pay?amount=${encodeURIComponent(totalPrice.toString())}`
      : selectedPayment === "googlepay"
      ? `gpay://pay?amount=${encodeURIComponent(totalPrice.toString())}`
      : null;
  
    console.log("Opening URL:", paymentUrl); // Log the URL
  
    if (paymentUrl) {
      Linking.openURL(paymentUrl).catch(err => {
        Alert.alert("Error", "Failed to open payment app: " + err.message);
      });
    } else {
      Alert.alert("Payment Successful", `Total Paid: ₹${totalPrice}`);
      navigation.navigate("Tablayout" as never);
    }
  };
  

  const handlePayment = useCallback((method: string) => {
    setSelectedPayment(method);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#3b5998" style={styles.loadingIndicator} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.totalPriceText}>
            Total Payment: ₹{totalPrice !== undefined && typeof totalPrice === "number" ? totalPrice.toFixed(2) : "0.00"}
          </Text>

          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePayment("phonepe")}>
            <Image
              source={require("../../../assets/images/phonepe.png")}
              style={styles.paymentImage1}
            />
            <Text style={styles.paymentText}>PhonePe</Text>
            <RadioButton
              value="PhonePe"
              status={selectedPayment === "phonepe" ? "checked" : "unchecked"}
              onPress={() => handlePayment("phonepe")}
            />
          </TouchableOpacity>
          {selectedPayment === "phonepe" && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.dropdownText}>
                  Pay via PhonePe ₹{totalPrice ? totalPrice.toFixed(2) : "0.00"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePayment("googlepay")}>
            <Image
              source={require("../../../assets/images/gpay1.jpg")}
              style={styles.paymentImage}
            />
            <Text style={styles.paymentText}>Google Pay</Text>
            <RadioButton
              value="Google Pay"
              status={selectedPayment === "googlepay" ? "checked" : "unchecked"}
              onPress={() => handlePayment("googlepay")}
            />
          </TouchableOpacity>
          {selectedPayment === "googlepay" && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.dropdownText}>
                  Pay via Google Pay ₹{totalPrice ? totalPrice.toFixed(2) : "0.00"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.paymentOption} onPress={() => handlePayment("cash_on_delivery")}>
            <FontAwesome name="money" size={40} color="green" />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
            <RadioButton
              value="cash_on_delivery"
              status={selectedPayment === "cash_on_delivery" ? "checked" : "unchecked"}
              onPress={() => handlePayment("cash_on_delivery")}
            />
          </TouchableOpacity>
          {selectedPayment === "cash_on_delivery" && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleConfirmPayment}
              >
                <Text style={styles.dropdownText}>
                  Pay via Cash on Delivery ₹{totalPrice ? totalPrice.toFixed(2) : "0.00"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    flex: 1,
    paddingTop: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  totalPriceText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "95%",
    justifyContent: "space-between",
  },
  paymentText: {
    fontSize: 18,
    marginLeft: 10,
  },
  dropdown: {
    backgroundColor: "#bb8fce",
    width: "95%",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,  // Correct usage
    paddingVertical: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "white",
  },
  scrollViewContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 50,
  },
  paymentImage: {
    width: 50,
    height: 42,
  },
  paymentImage1: {
    width: 45,
    height: 45,
  },
});

export default PaymentScreen;
