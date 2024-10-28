import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReturnProductScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Return Policy</Text>
            <View style={styles.card}>
                <Text style={styles.description}>
                    We want you to be completely satisfied with your purchase. Here’s our return policy:
                </Text>
                <Text style={styles.step}>• You can return items within 30 days of receipt.</Text>
                <Text style={styles.step}>• Items must be in their original condition and packaging.</Text>
                <Text style={styles.step}>• Return shipping costs are the responsibility of the customer.</Text>
                <Text style={styles.step}>• Refunds will be processed within 7-10 business days after we receive the returned item.</Text>
                <Text style={styles.extraPointsTitle}>How to Return an Item:</Text>
                <Text style={styles.step}>1. Contact our customer service to initiate a return.</Text>
                <Text style={styles.step}>2. Pack the item securely in its original packaging.</Text>
                <Text style={styles.step}>3. Include a copy of your receipt or order confirmation.</Text>
                <Text style={styles.step}>4. Ship the package to the address provided by customer service.</Text>
                <Text style={styles.extraPointsTitle}>Additional Information:</Text>
                <Text style={styles.step}>• Items marked as final sale cannot be returned.</Text>
                <Text style={styles.step}>• If you receive a damaged or incorrect item, please contact us immediately.</Text>
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

export default ReturnProductScreen;
