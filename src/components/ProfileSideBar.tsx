import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Switch, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type NavigationProps = StackNavigationProp<RootStackParamList, "EditProfile">;

const ProfileSidebar = () => {
  const navigation = useNavigation<NavigationProps>();

  // ✅ Estado del switch
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ Función para alternar el estado del switch
  const toggleSwitch = () => {
    console.log("Modo oscuro activado:", isDarkMode);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <SafeAreaProvider>
            <SafeAreaView>
            <View style={styles.container}>
      {/* Submenú de Navegación */}
      <Pressable 
        style={styles.menuItem} 
        onPress={() => navigation.navigate("EditProfile")} 
      >
        <Text style={styles.menuText}>Editar Perfil</Text>
        <Feather name="chevron-right" size={20} color="gray" />
      </Pressable>

      {/* Submenú con Switch */}
      <View style={styles.menuItem}>
        <Text style={styles.menuText}>Modo Oscuro</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#6200ee" }} // ✅ Color de la pista (fondo del switch)
          thumbColor={isDarkMode ? "#ffffff" : "#f4f4f4"} // ✅ Color del círculo
          ios_backgroundColor="#3e3e3e" // ✅ Fallback en iOS
          onValueChange={toggleSwitch} // ✅ Cambia el estado cuando se activa
          value={isDarkMode} // ✅ Refleja el estado actual
        />
      </View>
      <Switch
          trackColor={{ false: "#767577", true: "#6200ee" }} // ✅ Color de la pista (fondo del switch)
          thumbColor={isDarkMode ? "#ffffff" : "#f4f4f4"} // ✅ Color del círculo
          ios_backgroundColor="#3e3e3e" // ✅ Fallback en iOS
          onValueChange={toggleSwitch} // ✅ Cambia el estado cuando se activa
          value={isDarkMode} // ✅ Refleja el estado actual
        />
    </View>
    </SafeAreaView>
    </SafeAreaProvider>
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
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },

});

export default ProfileSidebar;
