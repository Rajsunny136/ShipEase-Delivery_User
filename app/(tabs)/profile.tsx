import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { getUserById, updateUserById } from "../api-request/user_api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userCookie } from "../api-request/config";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [user_id, setUser_id] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const token = await AsyncStorage.getItem(userCookie);
      if (!token) throw new Error("Token not found in AsyncStorage");

      const decodedToken: any = jwtDecode(token);
      const user_id = decodedToken.id;
      setUser_id(user_id);
      const userData = await getUserById(user_id);
      setUser(userData);

      const [first, last] = userData.username.split(" ");
      setFirstName(first);
      setLastName(last);
      setEmail(userData.email);
      setPassword(userData.password);
      setGender(userData.gender);
      setPhone(userData.phone);
    } catch (error) {
      console.error("Failed to initialize user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initialize().finally(() => setRefreshing(false));
  }, []);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        gender,
        mobile_number: phone,
      };
      if (user_id) {
        await updateUserById(user_id, updatedData);
        Alert.alert("Success", "User details updated successfully.");
        setModalVisible(false);
        const updatedUser = await getUserById(user_id);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(userCookie);
      Alert.alert("Logged out", "You have been logged out successfully.");
      navigation.navigate("Login" as never);
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fa8f0e" />
      </View>
    );
  }

  return (

    <>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          {user && (
            <>
              <Card style={styles.headerCard}>
                <Card.Content style={styles.headerContent}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={{ uri: user.profile_image || "default_image_url" }} // Add default image URL if needed
                      style={styles.profileImage}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.headerText}>{user.username}</Text>
                      <Text style={styles.headerSubText}>{user.phone}</Text>
                      <Text style={styles.headerSubText}>{user.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    // style={styles.option}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.optionTextedit}>
                      Edit Profile{" "}
                      <Ionicons name="chevron-forward" size={12} color="black" />
                    </Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SavedAddressesScreen" as never)
                }
              >
                <Card style={styles.card}>
                  <View style={styles.option}>
                    <Text style={styles.optionText}>Saved Addresses</Text>
                    <Ionicons name="home-outline" size={24} color="#000000" />
                  </View>
                </Card>
              </TouchableOpacity>

              {/* Help & Support */}
              <TouchableOpacity
                onPress={() => navigation.navigate("HelpAndSupport" as never)}
              >
                <Card style={styles.card}>
                  <View style={styles.option}>
                    <Text style={styles.optionText}>Help & Support</Text>
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color="#000000"
                    />
                  </View>
                </Card>
              </TouchableOpacity>

              {/* Refer your friends */}
              <TouchableOpacity
                onPress={() => navigation.navigate("ReferYourFriends" as never)}
              >
                <Card style={styles.card}>
                  <View style={styles.option}>
                    <Text style={styles.optionText}>Refer your friends!</Text>
                    <Ionicons
                      name="share-social-outline"
                      size={24}
                      color="#000000"
                    />
                  </View>
                </Card>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <Card style={styles.card}>
                  <View style={styles.option}>
                    <Text style={styles.optionText}>Logout</Text>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                  </View>
                </Card>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.ProfileModalContainer}>
          <View style={styles.ProfileModalContent}>
            <TextInput
              style={styles.ProfileInput}
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.ProfileInput}
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.ProfileInput}
              label="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.ProfileInput}
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.ProfileInput}
              label="Gender"
              value={gender}
              onChangeText={setGender}
            />
            <TextInput
              style={styles.ProfileInput}
              label="Phone"
              value={phone}
              onChangeText={setPhone}
            />
            <View style={styles.ProfileButtonContainer}>
              <Button
                mode="contained"
                onPress={handleUpdate}
                style={styles.ProfileUpdateButton}
              >
                Update
              </Button>
              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.ProfileCancelButton}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

    </>
  );
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    padding: width * 0.02, // Responsive padding
  },
  headerCard: {
    marginBottom: height * 0.02, // Responsive margin
    backgroundColor: "#f0dcf8",
  },
  headerContent: {
    // alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.03, // Responsive padding
  },
  profileImage: {
    width: width * 0.2, // 20% of screen width
    height: width * 0.2, // Maintain aspect ratio
    borderRadius: width * 0.1, // Rounded corners
    marginRight: width * 0.04, // Responsive margin
  },
  userInfo: {
    flex: 1,
  },
  headerText: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: "bold",
  },
  headerSubText: {
    fontSize: width * 0.045, // 4.5% of screen width
    marginTop: height * 0.01, // Responsive margin
  },
  button: {
    marginVertical: height * 0.02, // Responsive vertical margin
    marginHorizontal: width * 0.05, // Responsive horizontal margin
  },
  ProfileModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ProfileModalContent: {
    width: width * 0.8, // Responsive width
    backgroundColor: "#fff",
    padding: width * 0.05, // Responsive padding
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ProfileInput: {
    marginBottom: height * 0.02, // Responsive margin
  },
  ProfileButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ProfileUpdateButton: {
    flex: 1,
    marginRight: width * 0.02, // Responsive margin
    backgroundColor: "#bb8fce",
  },
  ProfileCancelButton: {
    flex: 1,
    backgroundColor: "#bb8fce",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: width * 0.05, // Responsive padding
  },
  card: {
    marginVertical: 10, // Adds spacing between cards
    padding: 5, // Adjust padding to ensure proper spacing inside the card
    borderRadius: 8, // Rounded corners for the card
    elevation: 2, // Adds shadow for Android
    backgroundColor: "#fff", // Background color of the card
  },
  optionText: {
    fontSize: width * 0.045, // 4.5% of screen width
  },
  optionTextedit: {
    fontSize: width * 0.045, // 4.5% of screen width
    color: "black",
    marginLeft: width * 0.02, // Responsive margin
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
});
export default Profile;
