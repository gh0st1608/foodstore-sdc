import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ScrollView } from "react-native";
import MenuMockScreen from "./MenuMockScreen";

const { width, height } = Dimensions.get("window"); // Obtener dimensiones del dispositivo

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>

        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <Text style={styles.text}>🏠 Bienvenido al Home de blablabla</Text>
        <MenuMockScreen />
        </ScrollView>


      </View>

      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  container: {
    flex: 1,
    width: width,
    height: height - 60, // Restar la altura del menú
    // justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 100,
    paddingBottom: 30
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default HomeScreen;
