
import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";

interface CategoryDishesScreenProps {
  route: RouteProp<RootStackParamList, "CategoryDishes">;
}

const CategoryDishesScreen: React.FC<CategoryDishesScreenProps> = ({ route }) => {
  const { categoryId } = route.params; // Se recibe el ID enviado al navegar

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.text}>Platos de la Categoría {categoryId}</Text>
        {/* Aquí colocarías un FlatList con platos filtrados por categoryId */}
      </View>
    </SafeAreaView>
  );
};

export default CategoryDishesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    position: "relative",
  },
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "#fff",
    position: "absolute",
    top: 90,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
