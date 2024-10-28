import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  PixelRatio,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the JWT
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import { verifyUserOTP, sendUserOTP } from "@/app/api-request/otp_api";
import { userCookie } from "@/app/api-request/config";
import Icon from "react-native-vector-icons/MaterialIcons";

type VerifyOtpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Verifyotp"
>;

type VerifyOtpScreenRouteProp = RouteProp<RootStackParamList, "Verifyotp">;

type Props = {
  navigation: VerifyOtpScreenNavigationProp;
  route: VerifyOtpScreenRouteProp;
};

const Verifyotp: React.FC<Props> = ({ route, navigation }) => {
  const params = route.params || {};
  const phone = (params.phone || "").toString();
  const orderId = (params.orderId || "").toString();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading

  console.log("Params:", params);
  console.log("Phone (type):", phone, typeof phone);
  console.log("OrderId (type):", orderId, typeof orderId);

  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));

  const inputRefs = useRef<TextInput[]>([]);

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      Alert.alert("Error", "Please enter the complete OTP");
      return;
    }

    try {
      const response = await verifyUserOTP({ phone, otp: otpCode, orderId });

      if (response.message === "OTP Verified Successfully!" && response.token) {
        await AsyncStorage.setItem(userCookie, response.token);
        console.log("response token id", response.token);

        const decodedToken: any = jwtDecode(response.token);
        const user_id = decodedToken.id;

        console.log("Decoded user ID:", user_id);

        navigation.navigate("Tablayout", {
          user_id: user_id,
          phone: phone,
        });
      } else if (response.error === "User not found") {
        // Navigate to EleMoveScreen if user is not found
        navigation.navigate("Signup", {
          phone: phone,
        });
      } else {
        Alert.alert("Error", response.message || "Invalid OTP");
      }
    } catch (error) {
      // console.error("Error verifying OTP:", error || error);
      Alert.alert("Error", "Failed to verify OTP");
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Phone number is required");
      return;
    }

    setError("");
    setIsLoading(true); // Start loading indicator

    try {
      // Send OTP request to OTPless API
      const response = await sendUserOTP({ phone });
      if (response.orderId) {
        // OTP sent successfully
        console.log("OTP sent successfully");
        await AsyncStorage.setItem("isLoggedIn", "true");
        navigation.navigate("Verifyotp", { phone, orderId: response.orderId });
      } else {
        // Handle unexpected response format
        setError(response.error || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error.message);
      setError(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <View style={styles.otpContainer}>
        <StatusBar
          backgroundColor="#A487E7" // Same color as the header
          barStyle="dark-content" // You can use 'light-content' if needed for white text/icons
        />
        <StatusBar barStyle="dark-content" />
        <Text style={styles.otpLabel}>Enter the OTP sent to {phone}:</Text>
        <View style={styles.otpInputsContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(index, nativeEvent.key)
              }
              keyboardType="numeric"
              maxLength={1}
              blurOnSubmit={false}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleVerifyOtp}>
          <Text style={styles.submitButtonText}>Verify OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resendButton} onPress={handleSendOtp}>
          <Text style={styles.resendButtonText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const { width, height } = Dimensions.get("window");

// Function to normalize size based on screen width
const normalize = (size: number) => {
  const scale = width / 375; // Based on standard screen width (375px)
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const styles = StyleSheet.create({
  otpContainer: {
    flex: 1,
    justifyContent: "center",
    padding: normalize(16),
    alignItems: "center",
  },
  otpLabel: {
    fontSize: normalize(16),
    marginBottom: normalize(8),
  },
  otpInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(16),
    width: "80%", // Relative to screen width
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: normalize(4),
    padding: normalize(8),
    width: width * 0.12, // Responsive width based on screen width
    height: height * 0.06, // Responsive height based on screen height
    textAlign: "center",
    marginRight: normalize(5),
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  resendButton: {
    backgroundColor: "rgb(122, 115, 150)",
    paddingVertical: normalize(15),
    borderRadius: normalize(5),
    width: "80%",
    alignItems: "center",
    marginBottom: normalize(10),
  },
  resendButtonText: {
    color: "#fff",
    fontSize: normalize(16),
  },
  submitButton: {
    backgroundColor: "#a487e7",
    paddingVertical: normalize(15),
    borderRadius: normalize(5),
    width: "80%",
    alignItems: "center",
    marginBottom: normalize(15),
  },
  submitButtonText: {
    color: "#fff",
    fontSize: normalize(16),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.03, // 3% of screen width
    backgroundColor: "#37474F",
  },
  headerTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: "bold",
    color: "#d5d8dc",
    marginLeft: width * 0.03, // 3% of screen width
  },
});

export default Verifyotp;