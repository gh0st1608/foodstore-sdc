import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const EditProfileScreen = () => {
    const navigation = useNavigation();
  return (

    <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
  <Feather name="arrow-left" size={24} color="black" />
</Pressable>
      <Text style={styles.text}>Pantalla de Edición de Perfil</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    backButton: {
        
    },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
