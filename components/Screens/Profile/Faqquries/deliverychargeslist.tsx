import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DeliveryChargesScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Delivery Charges</Text>
            <View style={styles.card}>
                <Text style={styles.description}>
                    We strive to keep delivery costs as low as possible. Here’s a breakdown of our delivery charges:
                </Text>
                <Text style={styles.step}>• Standard Delivery: $5.00</Text>
                <Text style={styles.step}>• Express Delivery: $10.00</Text>
                <Text style={styles.step}>• Free Delivery on orders over $50.00</Text>
                <Text style={styles.step}>• Delivery to remote areas may incur additional charges.</Text>
                <Text style={styles.extraPointsTitle}>Additional Information:</Text>
                <Text style={styles.step}>• Estimated delivery time for Standard Delivery: 3-5 business days.</Text>
                <Text style={styles.step}>• Estimated delivery time for Express Delivery: 1-2 business days.</Text>
                <Text style={styles.step}>• Special promotions: Get 10% off delivery charges on your first order.</Text>
                <Text style={styles.step}>• Join our loyalty program for free delivery on every order after 5 purchases.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        paddingLeft: 8,
        marginTop: 10,
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    description: {
        fontSize: 14,
        marginBottom: 10,
        color: "#666",
    },
    step: {
        fontSize: 14,
        marginVertical: 4,
        color: "#666",
    },
    extraPointsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 12,
        color: "#333",
    },
});

export default DeliveryChargesScreen;
