import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CancelOrderScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How to Cancel My Order</Text>
            <View style={styles.card}>
                <Text style={styles.description}>
                    We understand that sometimes you may need to cancel your order. Here’s how you can do it:
                </Text>
                <Text style={styles.step}>• You can cancel your order within 30 minutes of placing it.</Text>
                <Text style={styles.step}>• To cancel, go to 'My Orders' in your account.</Text>
                <Text style={styles.step}>• Select the order you wish to cancel and click on the 'Cancel Order' button.</Text>
                <Text style={styles.step}>• You will receive a confirmation once your order is successfully canceled.</Text>
                <Text style={styles.extraPointsTitle}>Additional Information:</Text>
                <Text style={styles.step}>• Orders that have already been shipped cannot be canceled.</Text>
                <Text style={styles.step}>• If you cancel after the 30-minute window, you may need to initiate a return process once you receive the item.</Text>
                <Text style={styles.step}>• For any assistance, please contact our customer service team.</Text>
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

export default CancelOrderScreen;
