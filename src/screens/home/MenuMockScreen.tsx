
import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import DishCard from "../../components/DishCard";
import { getAllDishes, getDishesByCategory, getDishesByPrice, getDishesByVegan } from "../../data/mockData";

const MenuMockScreen = () => {
  const [filterMode, setFilterMode] = useState<"all" | "category2" | "cheap" | "vegan">("all")

  // Obtener los platos según el modo
  let dishes = [];
  if (filterMode === "all") {
    dishes = getAllDishes();
  } else if (filterMode === "category2") {
    dishes = getDishesByCategory(2); // Hamburguesas
  } else if (filterMode === "cheap") {
    dishes = getDishesByPrice(10); // Ej. <= 10
  } else if (filterMode === "vegan") {
    dishes = getDishesByVegan(true); // Veganos
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú Mock con Filtros</Text>

      {/* Botones para cambiar el filtro */}
      <View style={styles.filterRow}>
        <Pressable style={styles.filterBtn} onPress={() => setFilterMode("all")}>
          <Text>Todos</Text>
        </Pressable>
        <Pressable style={styles.filterBtn} onPress={() => setFilterMode("category2")}>
          <Text>Hamburguesas</Text>
        </Pressable>
        <Pressable style={styles.filterBtn} onPress={() => setFilterMode("cheap")}>
          <Text>Baratos ( {`<=$ 10`} )</Text>
        </Pressable>
        <Pressable style={styles.filterBtn} onPress={() => setFilterMode("vegan")}>
          <Text>Veganos</Text>
        </Pressable>
      </View>

      <FlatList

        data={dishes}
        keyExtractor={(dish) => dish.id}
        renderItem={({ item }) => <DishCard dish={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        horizontal={true}

      />
    </View>
  );
};

export default MenuMockScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: "#eee",
    padding: 10,
    marginRight: 8,
    borderRadius: 4,
  },
});
