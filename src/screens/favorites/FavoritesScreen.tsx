import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DishCard from "../../components/DishCard";
import { getAllDishes } from "../../data/mockData"; // o la función que desees
import { useFavorites } from "../../context/FavoritesContext"; // tu contexto de favoritos

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { favorites } = useFavorites();
  // 'favorites' es un array de IDs de platos (string[])

  // Obtener todos los platos y filtrar por los que estén en 'favorites'
  const allDishes = getAllDishes();
  const favoriteDishes = allDishes.filter((dish) => favorites.includes(dish.id));

  // Si no hay platos favoritos, mostramos un mensaje
  if (favoriteDishes.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>No hay favoritos aún</Text>
          {/* Opcional: Botón para volver */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>

    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>


        <FlatList
          data={favoriteDishes}
          keyExtractor={(dish) => dish.id}
          renderItem={({ item }) => <DishCard dish={item} />}
          contentContainerStyle={styles.listContent}
          // horizontal={false}
          ListHeaderComponent={() => (
            <Text style={styles.title}>Mis Favoritos</Text>
          )}
          // columnWrapperStyle={{ justifyContent: "center" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",

  },
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    // padding: 10,
    // position: "absolute",
    alignItems: "flex-start",
    top: 100,
    // height: "auto",
    // width: "auto",
    flexDirection: "row",
    flexWrap: "wrap",


  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 150,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 4,
    alignSelf: "center",
  },
  backButtonText: {
    fontWeight: "bold",
  },
});
