import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import CheckBox from "react-native-check-box";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/app";
import { createUser } from "@/app/api-request/user_api"; // Import createUser function
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import an icon library

type EleMoveScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

type EleMoveScreenRouteProp = RouteProp<RootStackParamList, "Signup">;

type Props = {
  navigation: EleMoveScreenNavigationProp;
  route: EleMoveScreenRouteProp;
};

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  password: string;
  phone: string; // Keep this for the API request
  termsAccepted: boolean; // New field for terms acceptance
}

interface Errors {
  firstname?: string;
  lastname?: string;
  email?: string;
  gender?: string;
  password?: string;
  terms?: string; // New error field for terms acceptance
}

const Signup: React.FC<Props> = ({ route, navigation }) => {
  const { phone } = route.params; // Still keep this for API usage

  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    password: "",
    phone: phone,
    termsAccepted: false, // Initialize terms acceptance
  });

  const [errors, setErrors] = useState<Errors>({});
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // State for password visibility

  const handleInputChange = (name: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.termsAccepted) newErrors.terms = "You must accept the terms and conditions"; // Check terms acceptance

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const userResponse = await createUser(formData);
        console.log("User response:", userResponse); // Log the user response

        if (
          userResponse &&
          userResponse.message === "User created successfully"
        ) {
          if (userResponse.data && userResponse.data.id) {
            Alert.alert("Success", "Registration successful!", [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Login", {
                    phone: formData.phone,
                    user_id: userResponse.data.id,
                  });
                },
              },
            ]);
          } else {
            Alert.alert(
              "Error",
              "Failed to register user. Please try again later."
            );
          }
        } else {
          Alert.alert(
            "Error",
            userResponse.error ||
            "Failed to register user. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        Alert.alert("Error", "Failed to register user. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.userContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.userInput}
          value={formData.firstname}
          onChangeText={(value) => handleInputChange("firstname", value)}
        />
        {errors.firstname && <Text style={styles.userError}>{errors.firstname}</Text>}

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.userInput}
          value={formData.lastname}
          onChangeText={(value) => handleInputChange("lastname", value)}
        />
        {errors.lastname && <Text style={styles.userError}>{errors.lastname}</Text>}

        <Text style={styles.label}>Email ID</Text>
        <TextInput
          style={styles.userInput}
          value={formData.email}
          onChangeText={(value) => handleInputChange("email", value)}
        />
        {errors.email && <Text style={styles.userError}>{errors.email}</Text>}

        <View style={styles.userGenderContainer}>
          <Text>Gender:</Text>
          <View style={styles.userCheckboxContainer}>
            <CheckBox
              isChecked={formData.gender === "M"}
              onClick={() => handleInputChange("gender", "M")}
            />
            <Text style={styles.userGenderText}>Male</Text>
          </View>
          <View style={styles.userCheckboxContainer}>
            <CheckBox
              isChecked={formData.gender === "F"}
              onClick={() => handleInputChange("gender", "F")}
            />
            <Text style={styles.userGenderText}>Female</Text>
          </View>
        </View>
        {errors.gender && <Text style={styles.userError}>{errors.gender}</Text>}

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.userInput}
              value={formData.password}
              secureTextEntry={!passwordVisible}
              onChangeText={(value) => handleInputChange("password", value)}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Icon name={passwordVisible ? "visibility" : "visibility-off"} size={24} />
            </TouchableOpacity>
          </View>
        </View>
        {errors.password && (
          <Text style={styles.userError}>{errors.password}</Text>
        )}

        <View style={styles.termsContainer}>
          <CheckBox
            isChecked={formData.termsAccepted}
            onClick={() => handleInputChange("termsAccepted", !formData.termsAccepted)}
          />
          <Text style={styles.termsText}>I accept the Terms and Conditions</Text>
        </View>
        {errors.terms && <Text style={styles.userError}>{errors.terms}</Text>}
      </ScrollView>

      <TouchableOpacity style={styles.userButton} onPress={handleSubmit}>
        <Text style={styles.userButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    paddingTop:20,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    paddingBottom: 20, // Add some padding at the bottom for spacing
    flexGrow: 1, // Allow the content to grow
  },
  label: {
    fontSize: 14, // Reduced font size
    marginBottom: 3, // Reduced margin
    fontWeight: "bold",
  },
  userInput: {
    borderWidth: 1,
    borderColor: "darkgrey",
    borderRadius: 5,
    marginBottom: 10,
    padding: 8, // Adjust padding to reduce height
    height: 40, // Set a fixed height for uniformity
  },
  userGenderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  userCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  userGenderText: {
    marginLeft: 10,
  },
  passwordContainer: {
    marginBottom: 10,
  },
  passwordInputContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  userButton: {
    backgroundColor: "#A487E7",
    paddingVertical: 15,
    borderRadius: 5,
    margin: 20, // Add some margin for spacing
  },
  userButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  userError: {
    color: "red",
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 10,
  },
});

export default Signup;
