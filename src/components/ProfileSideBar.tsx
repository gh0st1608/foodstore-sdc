import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import SwitchTest from "./SwitchTest";
import { useNotifications } from "../context/NotificationsContext";
import SwitchNotification from "./SwitchNotification";
import SwitchStatusTest from "./SwitchStatusTest";

type NavigationProps = StackNavigationProp<RootStackParamList, "EditProfile">;

const ProfileSidebar = () => {
  const navigation = useNavigation<NavigationProps>();


  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSwitch = () => {
    console.log("Modo oscuro activado:", isDarkMode);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Submenú de Navegación */}
        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </Pressable>

        <Pressable
          style={styles.menuItem}
          onPress={() => navigation.navigate("MyOrders")}
        >
          <Text style={styles.menuText}>Mis Pedidos</Text>
          <Feather name="chevron-right" size={20} color="gray" />
        </Pressable>


        {/* Submenú con Switch */}
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Modo Oscuro</Text>
          <Switch

          trackColor={{ false: "#767577", true: "#6200ee" }} //  Color de la pista (fondo del switch)
          thumbColor={isDarkMode ? "#ffffff" : "#f4f4f4"} //  Color del círculo
          ios_backgroundColor="#3e3e3e" //  Fallback en iOS
          onValueChange={toggleSwitch} //  Cambia el estado cuando se activa
          value={isDarkMode} //  Refleja el estado actual
        />
          {/* <SwitchTest /> */}
        </View>


          <SwitchNotification />

          <SwitchStatusTest />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,

  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // position: "relative",
    // zIndex: -999,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },

});

export default ProfileSidebar;
