import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    StatusBar,
    ActivityIndicator,
    Dimensions,
    PixelRatio,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userCookie } from "@/app/api-request/config";
import { jwtDecode } from "jwt-decode";
import { sendUserOTP } from "@/app/api-request/otp_api";
import { RootStackParamList } from "@/app";

const checkAuthentication = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem(userCookie);
        return token !== null;
    } catch (error) {
        console.error("Error checking authentication status:", error);
        return false;
    }
};
const Login: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [phone, setPhone] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuthenticated = await checkAuthentication();
                const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

                console.log("isAuthenticated:", isAuthenticated);
                console.log("isLoggedIn:", isLoggedIn);

                if (isAuthenticated || isLoggedIn === "true") {
                    const token = await AsyncStorage.getItem(userCookie);
                    if (token) {
                        console.log("Token retrieved from AsyncStorage:", token); // Debug log
                        const decodedToken: any = jwtDecode(token);
                        const userId = decodedToken.id; // Adjust according to your JWT structure

                        console.log("User ID from token:", userId);

                        navigation.navigate("Tablayout", {
                            user_id: userId,
                            phone: phone
                        });
                    } else {
                        console.error("Token not found in AsyncStorage");
                    }
                } else {
                    console.log("User is not authenticated or not logged in");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
            }
        };

        checkAuth();
    }, [navigation]);

    const validatePhoneNumber = (number: string) => {
        // Regex to allow exactly 10 digits
        const phoneRegex = /^[6-9]\d{9}$/; // Ensures the number starts with 6, 7, 8, or 9 and has 10 digits

        // Reject repeated sequences like "7777777777", "0000000000", etc.
        const repeatedNumberRegex = /^(\d)\1{9}$/; // Checks if all digits are the same

        // First, check if the number matches the valid phone number pattern
        if (!phoneRegex.test(number)) {
            return false;
        }

        // Then, reject numbers with repeated digits
        if (repeatedNumberRegex.test(number)) {
            return false;
        }

        return true; // Number is valid if both checks pass
    };
    const handleSendOtp = async () => {
        if (!phone) {
            setError("Phone number is required");
            return;
        }

        if (!validatePhoneNumber(phone)) {
            setError("Please enter a valid phone number");
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

    return (
        <View style={styles.maindrivercontainer}>
            <StatusBar
                backgroundColor="#37474F" // Same color as the header
                barStyle="dark-content" // You can use 'light-content' if needed for white text/icons
            />
            <View style={styles.logonamebox}>
                <Text style={styles.headerTex}>ShipEase</Text>
            </View>

            <Image
                source={require("@/assets/images/login.png")}
                style={styles.logoElemove}
            />

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.textbox}>Welcome</Text>
                        <Text style={styles.textboxpara}>
                            With a valid number, you can access deliveries and our other
                            services.
                        </Text>
                    </View>
                    <View style={styles.mobilenumbercontainer}>
                        <TextInput
                            label="Phone Number"
                            placeholder="Enter phone number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            mode="outlined"
                            style={styles.mobileTextInput}
                            outlineColor={error ? "red" : "gray"} // border color when inactive
                            activeOutlineColor={error ? "red" : "#017ce8"} // border color when focused
                            error={!!error}
                            maxLength={10}
                        />
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    </View>
                </View>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#37474F" /> // Loader
                ) : (
                    <Button
                        style={styles.submitButton}
                        mode="contained"
                        onPress={handleSendOtp}
                        disabled={isLoading}
                    >
                        Login
                    </Button>
                )}
            </View>
        </View>
    );
};
const { width, height } = Dimensions.get("window");

// Normalize function to adjust size based on screen width
const normalize = (size: number) => {
    const scale = width / 375; // Base screen width (375px)
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const styles = StyleSheet.create({
    maindrivercontainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: normalize(20),
        width: "100%",
        height: height * 0.95, // 95% of screen height
        backgroundColor: "#ffffff",
    },
    logonamebox: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    logoElemove: {
        width: "100%",
        height: height * 0.35, // 35% of screen height
        resizeMode: "cover",
        borderRadius: normalize(15),
    },
    headerTex: {
        fontSize: normalize(30), // Responsive font size
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },
    formContainer: {
        marginTop: normalize(40), // Responsive margin top
        borderTopRightRadius: normalize(20),
        borderTopLeftRadius: normalize(20),
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    welcomeContainer: {
        height: height * 0.5, // 50% of screen height
        alignItems: "flex-start",
        justifyContent: "flex-end",
    },
    textbox: {
        fontSize: normalize(24), // Responsive font size
        color: "#000",
        marginLeft: normalize(20),
        fontWeight: "bold",
    },
    textboxpara: {
        marginLeft: normalize(20),
        marginRight: normalize(10),
    },
    inputContainer: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: "auto",
        width: "100%",
    },
    mobileTextInput: {
        height: normalize(50),
        width: "100%",
        marginTop: normalize(20),
        marginBottom: normalize(10),
        backgroundColor: "white",
    },
    submitButton: {
        marginTop: normalize(20),
        width: width * 0.85, // 85% of screen width
        backgroundColor: "#37474F",
        borderRadius: normalize(5),
        padding: normalize(10),
    },
    mobilenumbercontainer: {
        flexDirection: "column",
        width: "95%",
    },
    link: {
        color: "blue",
        textDecorationLine: "underline",
    },
    errorText: {
        color: "red",
        marginTop: normalize(5),
    },
});

export default Login;