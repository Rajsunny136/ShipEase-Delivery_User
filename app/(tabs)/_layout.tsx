import React from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons } from '@expo/vector-icons';
import Home from "./home";
import Orders from "./orders";
import Payments from "./payments";
import Profile from "./profile";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

export default function TabLayout() {
    return (
      <>
        <StatusBar
          backgroundColor="#A487E7" // Same color as the header
          barStyle="light-content" // White text/icons for dark background
        />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = <Entypo name="home" size={size} color={color} />;
              } else if (route.name === "Orders") {
                iconName = (
                  <Ionicons name="receipt" size={size} color={color} />
                );
              } else if (route.name === "Payments") {
                iconName = <Entypo name="wallet" size={size} color={color} />;
              } else if (route.name === "Profile") {
                iconName = <Ionicons name="person" size={23} color={color} />;
              }

              return (
                <View style={styles.iconLabelContainer}>
                  {iconName}
                  <Text style={[styles.label, { color }]}>{route.name}</Text>
                </View>
              );
            },
            tabBarActiveTintColor: "white",
            tabBarInactiveTintColor: "black",
            tabBarStyle: {
              backgroundColor: "#A487E7",
              height: height * 0.07, // Adjust height dynamically
            },
            tabBarLabelStyle: { fontSize: 14 },
            tabBarShowLabel: false, // Hide default label, we are customizing it
            headerStyle: { backgroundColor: "#A487E7" }, // Custom header color
            headerTintColor: "white", // Header text/icon color
          })}
        >
          <Tab.Screen
            name="Home"
            component={Home}
            options={{ headerShown: true, headerTitle: "ShipEase" }}
          />
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{ headerShown: true }}
          />
          <Tab.Screen
            name="Payments"
            component={Payments}
            options={{ headerShown: true }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: true }}
          />
        </Tab.Navigator>
      </>
    );
}

const styles = StyleSheet.create({
    iconLabelContainer: {
        flexDirection: 'column', // Ensures icon and text are in the same direction
        alignItems: 'center',    // Centers the icon and text horizontally
        justifyContent: 'center',
        gap: 2, // Adjusts the gap between the icon and label
    },
    label: {
        fontSize: 13,            // Adjust the label size
        marginTop: 0,            // Small margin between icon and text
    }
});