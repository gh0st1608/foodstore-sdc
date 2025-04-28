import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window"); // Obtener dimensiones del dispositivo

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    width: width, // Ocupar todo el ancho del dispositivo
    height: height - 60, // Restar la altura del menú
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;
