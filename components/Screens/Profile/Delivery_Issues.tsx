import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DeliveryIssuesScreen = () => {
  const navigation = useNavigation();

  const contactSupport = () => {
    Linking.openURL("mailto:support@shipease.com");
  };

  const callSupport = () => {
    Linking.openURL("tel:+91 9441482439");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common Delivery Issues</Text>

        <TouchableOpacity style={styles.issueItem}>
          <Text style={styles.issueText}>My order hasn't arrived yet</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.issueItem}>
          <Text style={styles.issueText}>I received the wrong items</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.issueItem}>
          <Text style={styles.issueText}>Delivery was delayed</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Need More Help?</Text>

        <TouchableOpacity style={styles.contactItem} onPress={callSupport}>
          <Ionicons name="call-outline" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>Call Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem} onPress={contactSupport}>
          <Ionicons name="mail-outline" size={24} color="#4CAF50" />
          <Text style={styles.contactText}>Email Support</Text>
        </TouchableOpacity>
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
  issueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  issueText: {
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
});

export default DeliveryIssuesScreen;
