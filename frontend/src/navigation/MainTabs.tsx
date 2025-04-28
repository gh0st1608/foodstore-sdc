
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeTab from "./stacks/HomeTab";
import SearchTab from "./stacks/SearchTab";
import CartTab from "./stacks/CartTab";
import FavoritesTab from "./stacks/FavoritesTab";
import NotificationsTab from "./stacks/NotificationsTab";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import ProfilePreview from "../components/ProfilePreview";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <>
    {/* <ProfilePreview /> */}
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
          if (route.name === "HomeTab") iconName = "home";
          if (route.name === "SearchTab") iconName = "search";
          if (route.name === "CartTab") iconName = "shopping-cart";
          if (route.name === "FavoritesTab") iconName = "favorite";
          if (route.name === "NotificationsTab") iconName = "notifications";

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

      <Tab.Screen name="HomeTab" component={HomeTab} />
      <Tab.Screen name="SearchTab" component={SearchTab} />
      <Tab.Screen name="CartTab" component={CartTab} />
      <Tab.Screen name="FavoritesTab" component={FavoritesTab} />
      <Tab.Screen name="NotificationsTab" component={NotificationsTab} />
    </Tab.Navigator>
    </>

  );
};

export default MainTabs;

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
