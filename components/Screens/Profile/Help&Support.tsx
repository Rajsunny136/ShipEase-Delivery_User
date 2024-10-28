import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Linking } from "react-native";

const HelpAndSupport = () => {
  const navigation = useNavigation();

  const contactSupport = () => {
    Linking.openURL("mailto:support@shipease.com"); // Example email address
  };

  const callSupport = () => {
    Linking.openURL("tel:+919441482439"); // Example phone number
  };

  return (
    <ScrollView style={styles.container}>
      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FAQs</Text>

        <TouchableOpacity
          style={styles.faqItem}
          onPress={() => navigation.navigate("ReturnProcessScreen" as never)} // Navigate to ReturnProcessScreen
        >
          <Text style={styles.faqText}>How to Return Product</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.faqItem}
          onPress={() => navigation.navigate("DeliveryChargesScreen" as never)} // Navigate to DeliveryChargesScreen
        >
          <Text style={styles.faqText}>What are the delivery charges?</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.faqItem}
          onPress={() => navigation.navigate("CancelOrderScreen" as never)}
        >
          <Text style={styles.faqText}>How do I cancel my order?</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Contact Us Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.contactItem} onPress={callSupport}>
          <Ionicons name="call-outline" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>Call Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={contactSupport}>
          <Ionicons name="mail-outline" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>Email Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => navigation.navigate("ChatScreen" as never)}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>Live Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Support Channels with Expo Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Topics</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="location-outline" size={40} color="#4CAF50" />
            <Text style={styles.gridText}>Order Tracking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("DeliveryIssuesScreen" as never)} // Navigate to DeliveryIssuesScreen
          >
            <Ionicons name="time-outline" size={40} color="#4CAF50" />
            <Text style={styles.gridText}>Delivery Issues</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <Ionicons name="card-outline" size={40} color="#4CAF50" />
            <Text style={styles.gridText}>Payment Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() =>
              navigation.navigate("AccountSettingsScreen" as never)
            }
          >
            <Ionicons name="settings-outline" size={40} color="#4CAF50" />
            <Text style={styles.gridText}>Account Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  faqText: {
    fontSize: 16,
    color: "#666",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
});

export default HelpAndSupport;
