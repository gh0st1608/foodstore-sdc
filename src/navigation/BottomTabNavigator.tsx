import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/search/SearchScreen";
import CartScreen from "../screens/cart/CartScreen";
import FavoritesScreen from "../screens/favorites/FavoritesScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,

        tabBarButton: ({ onPress, accessibilityState, children }) => (
          <Pressable
            onPress={onPress}
            accessibilityState={accessibilityState}
            android_ripple={{
              color: "rgba(255, 87, 51, 0.2)",
              borderless: false,
              radius: 20,
            }}
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.pressedStyle,
            ]}
          >
            {children}
          </Pressable>
        ),

        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          if (route.name === "Search") iconName = "search";
          if (route.name === "Cart") iconName = "shopping-cart";
          if (route.name === "Favorites") iconName = "favorite";
          if (route.name === "Notifications") iconName = "notifications";

          return (
            <MaterialIcons
              name={iconName as keyof typeof MaterialIcons.glyphMap}
              size={28}
              color={focused ? "#FF5733" : "#999"}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  buttonStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    overflow: "hidden",
  },
  pressedStyle: {
    opacity: 0.7,
  },
});

export default BottomTabNavigator;
