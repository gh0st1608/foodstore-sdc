
import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { getDishesByCategory } from "../../data/mockData";
import { Feather } from "@expo/vector-icons";
import DishCard from "../../components/DishCard";

type CategoryDishesScreenRouteProp = RouteProp<RootStackParamList, "CategoryDishes">;

const CategoryDishesScreen = () => {
  const route = useRoute<CategoryDishesScreenRouteProp>();
  const { categoryId } = route.params;
  const navigation = useNavigation();

  const dishes = getDishesByCategory(categoryId);
  // Si no hay dishes, es posible que la categoría no exista
  if (!dishes || dishes.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="black" />
          </Pressable>
          <Text style={styles.title}>Categoría sin platos o no encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>


        <FlatList
          data={dishes}
          keyExtractor={(dish) => dish.id}
          renderItem={({ item }) => <DishCard dish={item} />}
          contentContainerStyle={styles.listContainer}
          horizontal={false}
          numColumns={2}
                    ListHeaderComponent={() => (
                      <>
                                            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Feather name="arrow-left" size={24} color="black" />
                    </Pressable>
                    <Text style={styles.title}>Platos de la categoría {categoryId}</Text></>
                    )}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryDishesScreen;

const styles = StyleSheet.create({
  backButton: {},
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    // position: "absolute",
    top: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 150,
        margin: "auto"
  },
});
