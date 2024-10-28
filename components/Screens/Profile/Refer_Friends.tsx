import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReferYourFriends = () => {
  const referralCode = "ShiEase123"; // Example referral code

  const shareReferral = async () => {
    try {
      const result = await Share.share({
        message: `Use my referral code ${referralCode} to get discounts on your first delivery with ShipEase!`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing referral code:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Refer a Friend</Text>
        <Text style={styles.description}>
          Share your referral code with friends and get rewards when they sign
          up and use our service!
        </Text>
      </View>

      {/* Referral Code Section */}
      <View style={styles.referralSection}>
        <Text style={styles.referralLabel}>Your Referral Code:</Text>
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCode}>{referralCode}</Text>
          <TouchableOpacity onPress={() => shareReferral()}>
            <Ionicons name="share-social-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Options */}
      <View style={styles.shareOptions}>
        <Text style={styles.shareTitle}>Share with your friends</Text>
        <View style={styles.shareButtonsContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={shareReferral}>
            <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
            <Text style={styles.shareText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={shareReferral}>
            <Ionicons name="mail-outline" size={28} color="#0078D4" />
            <Text style={styles.shareText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={shareReferral}>
            <Ionicons name="logo-facebook" size={28} color="#3b5998" />
            <Text style={styles.shareText}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  referralSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  referralLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  referralCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  referralCode: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  shareOptions: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  shareButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shareButton: {
    alignItems: "center",
  },
  shareText: {
    marginTop: 8,
    fontSize: 14,
    color: "#333",
  },
});

export default ReferYourFriends;
