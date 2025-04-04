import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
// import MainTabs from "../../navigation/MainTabs";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={24} color="black" />
      </Pressable>
      <Text style={styles.text}>Pantalla de Edición de Perfil</Text>
    </View>

    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  backButton: {

  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",

  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    position: "absolute",
    top: 90,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
