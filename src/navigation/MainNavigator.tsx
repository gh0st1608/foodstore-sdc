import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import BottomTabNavigator from "./BottomTabNavigator"; // ✅ Importamos el nuevo archivo
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import ProfilePreview from "../components/ProfilePreview";
import { useAuth } from "../hooks/useAuth";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ProfilePreview />

      <Stack.Navigator
      id={undefined}
      screenOptions={{ headerShown: false }}>
        {/* 📌 El Tab Navigator sigue como la navegación principal */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

        {/* 📌 Pantalla de Edición de Perfil */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainNavigator;
